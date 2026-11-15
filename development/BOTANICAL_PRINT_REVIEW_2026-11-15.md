# Botanical handout print correction — 2026-11-15

Source baseline: `feature/voynich-playtest-readiness-20261113` at `b00d1896019372aaf951057a7ff3629ea7e704f0`.

## Confirmed defect and correction

The existing WeasyPrint render pipeline produced solid black botanical silhouettes. The gate sprout's stem and leaf outlines disappeared, and the journal flower lost its pale petals. Styles for SVG shapes lived in the outer HTML stylesheet, which this renderer did not inherit into the embedded drawing. Existing pagination/text checks passed despite this visual defect.

The two original drawings now carry portable SVG paint attributes. The artwork geometry, wording and two-sheet layout remain intact. The sprout and flower render with green outlines and stems; the five petals have pale fills and the flower has a gold center. No external artwork or assets were introduced.

## Executed verification

- `python -m unittest discover -s development -p 'test_inkbound_botanicals.py'`: two tests passed after failing against the original illustrations (three subtest/assertion failures). These raster tests render the actual embedded SVGs without host HTML CSS and check the visible paint colors.
- `node development/verify-inkbound-packet.cjs`: 25 checks passed.
- `node development/verify-inkbound-print-assets.cjs`: 36 checks passed.
- `node --test development/printable-audit.test.cjs`: 13 tests passed.
- `python development/verify-inkbound-renders.py --output-dir /tmp/questforge-render-fixed`: 49 render checks passed.
- Visually inspected the exact resulting two Letter player pages and one Letter DM quick-sheet page; no text clipping, extra pages or journal clue on the gate page was seen. The corrected line art is visible on both player pages.
- Both original 1200 x 900 SVG maps were rendered and visually inspected using Inkscape; the existing CairoSVG pipeline also rendered both maps successfully. No map changes were needed for this correction.

## Limits

Chromium CLI could not start in this environment because socket creation was denied. This pass does not claim a new Chromium print proof, physical print proof, mobile-browser review, professional-art acceptance, encounter balance, actual player testing, feedback endpoint verification or publication approval. The separate Venice integration branch was inspected and preserved; it was not merged into the print branch. No Actions run, deployment, publication or spending was performed.
