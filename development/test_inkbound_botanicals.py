"""Check the actual botanical SVG pixels without relying on host HTML CSS."""
from io import BytesIO
from pathlib import Path
import re
import unittest

import cairosvg
from PIL import Image


class BotanicalPrintTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        source = (Path(__file__).parent /
                  'inkbound-threshold-player-handout-print.html').read_text()
        cls.drawings = re.findall(r'<svg\b.*?</svg>', source, re.S)

    def test_both_botanical_drawings_keep_visible_ink_outlines(self):
        self.assertEqual(len(self.drawings), 2)
        for drawing in self.drawings:
            with self.subTest(drawing=drawing.split('aria-label=')[1].split('>')[0]):
                pixels = Image.open(BytesIO(cairosvg.svg2png(
                    bytestring=drawing.encode()))).convert('RGBA')
                colors = {pixel[:3] for _, pixel in pixels.getcolors(pixels.width * pixels.height) if pixel[3] == 255}
                self.assertIn((64, 94, 72), colors, 'green outlines and stems must render')
                self.assertNotIn((0, 0, 0), colors, 'default black fill must not replace line art')

    def test_journal_flower_keeps_pale_petals_and_gold_center(self):
        pixels = Image.open(BytesIO(cairosvg.svg2png(
            bytestring=self.drawings[1].encode()))).convert('RGBA')
        colors = {pixel[:3] for _, pixel in pixels.getcolors(pixels.width * pixels.height) if pixel[3] == 255}
        self.assertIn((215, 224, 207), colors, 'five petals must retain their pale fill')
        self.assertIn((188, 174, 119), colors, 'flower center must retain its gold fill')


if __name__ == '__main__':
    unittest.main()
