"""Render private playtest assets and check pagination without a browser or network."""
from argparse import ArgumentParser
from pathlib import Path
import sys


def verify(output):
    try:
        import cairosvg
        import fitz
        from weasyprint import HTML
    except ImportError as exc:
        raise RuntimeError(
            'Install development/requirements-render-qa.txt before running render QA'
        ) from exc

    base = Path(__file__).resolve().parent
    output.mkdir(parents=True, exist_ok=True)
    checks = 0

    def require(condition, message):
        nonlocal checks
        if not condition:
            raise RuntimeError(message)
        checks += 1

    for audience in ('player', 'dm'):
        svg = base / 'maps' / f'inkbound-threshold-{audience}-map.svg'
        target = output / f'{audience}-map.png'
        cairosvg.svg2png(url=str(svg), write_to=str(target))
        image = fitz.Pixmap(str(target))
        require((image.width, image.height) == (1200, 900),
                f'{audience} map must retain its full 1200 x 900 canvas')

    expected = {'player-handout': 2, 'dm-quick-sheet': 1}
    for name, pages in expected.items():
        target = output / f'{name}.pdf'
        HTML(filename=str(base / f'inkbound-threshold-{name}-print.html')).write_pdf(str(target))
        with fitz.open(target) as document:
            require(len(document) == pages, f'{name}: expected {pages} pages, got {len(document)}')
            text = []
            for index, page in enumerate(document):
                require(abs(page.rect.width - 612) < 1 and abs(page.rect.height - 792) < 1,
                        f'{name} page {index + 1}: expected Letter paper')
                for block in page.get_text('blocks'):
                    if block[6] == 0 and block[4].strip():
                        require(block[0] >= 35 and block[1] >= 35 and
                                block[2] <= 577 and block[3] <= 757,
                                f'{name} page {index + 1}: text extends beyond print margins')
                text.append(' '.join(page.get_text().split()))
                page.get_pixmap(matrix=fitz.Matrix(1.3, 1.3)).save(
                    str(output / f'{name}-{index + 1}.png'))
            if name == 'player-handout':
                require('ONLY WHAT GROWS MAY PASS.' in text[0], 'Gate clue missing from first sheet')
                require('PETALS POINT TO WATER' not in text[0], 'Journal clue leaked onto gate sheet')
                require('PETALS POINT TO WATER' in text[1], 'Journal clue missing from second sheet')
                require(all('first frost' not in page.lower() for page in text), 'Fountain clue leaked')
            else:
                require('Not release-ready:' in text[0], 'DM readiness warning missing')
                require('Private development reference;' in text[0], 'DM footer missing')
                require('separate balance and rights review' in text[0], 'Combat review boundary missing')
    print(f'PASS: {checks} render checks; maps, PDFs and page PNGs in {output}')


if __name__ == '__main__':
    parser = ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir', type=Path, required=True)
    args = parser.parse_args()
    try:
        verify(args.output_dir.resolve())
    except (RuntimeError, OSError) as exc:
        print(f'FAIL: {exc}', file=sys.stderr)
        sys.exit(1)
