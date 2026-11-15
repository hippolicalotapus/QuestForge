"""Check the player map reader's audience boundary, native controls and print proof."""
from html.parser import HTMLParser
from pathlib import Path
import unittest

import fitz
from weasyprint import HTML


class Elements(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.items = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.items.append((tag, dict(attrs)))


class MapReaderTests(unittest.TestCase):
    def test_player_map_has_accessible_detail_without_changing_the_art(self):
        path = Path(__file__).parent / 'inkbound-threshold-player-map-view.html'
        self.assertTrue(path.is_file(), 'player map reading page is missing')
        source = path.read_text()
        elements = Elements(source).items
        images = [attrs for tag, attrs in elements if tag == 'img']
        self.assertEqual(len(images), 2)
        for image in images:
            self.assertEqual(image['src'], 'maps/inkbound-threshold-player-map.svg')
            self.assertTrue((path.parent / image['src']).is_file())
            self.assertTrue(image.get('alt'))
        details = [attrs for tag, attrs in elements if tag == 'details']
        self.assertEqual(len(details), 1)
        self.assertNotIn('open', details[0], 'full-size map should begin collapsed')
        regions = [attrs for tag, attrs in elements if attrs.get('role') == 'region']
        self.assertEqual(len(regions), 1)
        self.assertEqual(regions[0].get('tabindex'), '0')
        self.assertTrue(regions[0].get('aria-label'))
        self.assertNotRegex(source, r'KEYED DM NOTES|Seed pouch|leaf token|hidden compartment|first frost')
        self.assertFalse(any(tag == 'script' for tag, _ in elements))
        for label in ('Gate / vestibule', 'Rootbound Hall', 'Cellar', 'Village fountain',
                      'Wall', 'Passage', 'Path'):
            self.assertIn(f'<dt>{label}</dt>', source)
        with fitz.open(stream=HTML(filename=str(path)).write_pdf(), filetype='pdf') as pdf:
            self.assertEqual(len(pdf), 1)
            self.assertEqual(tuple(pdf[0].rect), (0, 0, 792, 612))
            self.assertGreater(len(pdf[0].get_drawings()), 10, 'print proof must include vector map artwork')


if __name__ == '__main__':
    unittest.main()
