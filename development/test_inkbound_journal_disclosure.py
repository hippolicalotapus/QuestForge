"""Keep the later journal clue out of initial screen reading, including without JS."""
from pathlib import Path
import re
import unittest

import fitz
from weasyprint import CSS, HTML


class JournalDisclosureTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = (Path(__file__).parent /
                      'inkbound-threshold-player-handout-print.html').read_text()

    def screen_text(self, source):
        output = HTML(string=source, media_type='screen').write_pdf(stylesheets=[CSS(
            string='@page{size:390px 4000px!important;margin:0!important}')])
        with fitz.open(stream=output, filetype='pdf') as pdf:
            return ' '.join(' '.join(page.get_text().split()) for page in pdf)

    def test_journal_requires_deliberate_screen_reveal(self):
        text = self.screen_text(self.source)
        self.assertIn('ONLY WHAT GROWS MAY PASS.', text)
        self.assertNotIn('PETALS POINT TO WATER', text)
        control = re.search(r'<input\b[^>]*id="journal-toggle"[^>]*>', self.source)
        self.assertIsNotNone(control, 'native journal disclosure control must exist')
        self.assertNotIn('checked', control[0], 'journal must begin concealed')
        self.assertIn('type="checkbox"', control[0])
        self.assertIn('aria-controls="journal-sheet"', control[0])
        revealed = self.source.replace(control[0], control[0][:-1] + ' checked>')
        self.assertIn('PETALS POINT TO WATER', self.screen_text(revealed))
        self.assertIn('Hide recovered journal sheet', self.screen_text(revealed))

    def test_print_is_identical_whether_journal_is_revealed_or_concealed(self):
        control = re.search(r'<input\b[^>]*id="journal-toggle"[^>]*>', self.source)
        self.assertIsNotNone(control)
        revealed = self.source.replace(control[0], control[0][:-1] + ' checked>')
        hidden_pdf = HTML(string=self.source).write_pdf()
        shown_pdf = HTML(string=revealed).write_pdf()
        with fitz.open(stream=hidden_pdf, filetype='pdf') as hidden, \
                fitz.open(stream=shown_pdf, filetype='pdf') as shown:
            self.assertEqual(len(hidden), 2)
            self.assertEqual(len(shown), 2)
            for i in range(2):
                self.assertEqual(tuple(hidden[i].rect), (0, 0, 612, 792))
                self.assertEqual(hidden[i].get_pixmap().samples, shown[i].get_pixmap().samples)
                self.assertNotIn('Show recovered journal sheet', hidden[i].get_text())
            self.assertNotIn('PETALS POINT TO WATER', hidden[0].get_text())
            self.assertIn('PETALS POINT TO WATER', ' '.join(hidden[1].get_text().split()))


if __name__ == '__main__':
    unittest.main()
