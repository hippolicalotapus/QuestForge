"""Render the separate private paper-feedback sheets and check audience boundaries."""
from pathlib import Path
import re
import unittest

import fitz
from weasyprint import HTML


class PaperFeedbackTests(unittest.TestCase):
    def test_each_audience_gets_one_readable_letter_page(self):
        for audience in ('player', 'dm'):
            with self.subTest(audience=audience):
                path = Path(__file__).parent / f'inkbound-threshold-{audience}-feedback-print.html'
                self.assertTrue(path.is_file(), f'{audience} paper feedback sheet is missing')
                source = path.read_text()
                self.assertFalse(re.search(r'<(?:script|form|input|textarea|iframe)\b', source, re.I),
                                 'paper-only sheets must not imply a working online submission')
                self.assertFalse(re.search(r'(?:href|src|action)\s*=', source, re.I),
                                 'paper-only sheets must not depend on unverified destinations')
                with fitz.open(stream=HTML(filename=str(path)).write_pdf(), filetype='pdf') as pdf:
                    self.assertEqual(len(pdf), 1, 'each audience needs a separate one-page sheet')
                    page = pdf[0]
                    self.assertEqual(tuple(page.rect), (0, 0, 612, 792))
                    text = ' '.join(page.get_text().split())
                    for phrase in ('Optional', 'No name or contact details', 'Skip any question',
                                   'paper only', 'The Inkbound Threshold'):
                        self.assertIn(phrase, text)
                    for block in page.get_text('blocks'):
                        if block[6] == 0 and block[4].strip():
                            self.assertGreaterEqual(block[0], 35)
                            self.assertGreaterEqual(block[1], 35)
                            self.assertLessEqual(block[2], 577)
                            self.assertLessEqual(block[3], 757)
                    if audience == 'player':
                        self.assertIn('PLAYER FEEDBACK', text)
                        self.assertNotRegex(text, r'first frost|hidden compartment|leaf token|DC \d+')
                    else:
                        self.assertIn('DUNGEON MASTER FEEDBACK', text)
                        self.assertIn('Keep separate from player sheets', text)


if __name__ == '__main__':
    unittest.main()
