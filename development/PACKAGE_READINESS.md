# Inkbound Threshold private package audit

Audit date: 2026-11-14. Baseline: `feature/voynich-playtest-readiness-20261113` at `03cbb281db2cbf14dae83e1ec81b012bbf0c2aa8`, before the combined parallel-work review. This register records verified source and local render evidence; it does not mark the complete Voynich adventure release-ready.

## Source inventory and audience

| Item | Verified baseline source | Audience / status |
|---|---|---|
| Encounter draft | [Voynich Level 1 encounter draft](voynich-level1-encounter-draft.md) | Dungeon Master; private development |
| Session packet | [DM playtest packet](inkbound-threshold-dm-playtest-packet.md) | Dungeon Master only; includes concealed clues |
| DM quick sheet | [Printable quick sheet](inkbound-threshold-dm-quick-sheet-print.html) | Dungeon Master only; rendered to one Letter page |
| Player clue sheets | [Printable player handouts](inkbound-threshold-player-handout-print.html) | Two separate Letter pages; distribute at different scenes |
| Combined clue source | [Source handout](inkbound-threshold-player-handout-01.md) | Assembly reference; do not distribute both clues at the gate |
| Player map | [Player SVG](maps/inkbound-threshold-player-map.svg) and [responsive reader](inkbound-threshold-player-map-view.html) | Same player-safe schematic; reader adds full-size detail and a text key. Artistic quality remains a separate review |
| DM map | [DM SVG](maps/inkbound-threshold-dm-map.svg) | Dungeon Master only; contains clue positions and keyed notes |
| Validation | [Manuscript checks](verify-inkbound-packet.cjs), [print-source checks](verify-inkbound-print-assets.cjs), [render checks](verify-inkbound-renders.py) | Development tools, not proof of player testing |

## Checks executed in this audit

- Existing Node validators: 25 manuscript checks and 35 print-source checks passed.
- Local SVG/WeasyPrint rendering: 48 checks passed, including Letter dimensions, text margins, staged clue separation and the DM warning/footer.
- Visually inspected both player handout pages and the DM quick sheet: readable, no clipped text, no unwanted blank page, and no journal clue on the gate page.
- Player handouts render as two pages (71 and 54 extracted words); the DM quick sheet renders as one page (339 extracted words). The journal clue is on page 2 only; the first-frost discovery remains absent from both player pages.
- Both baseline local HTML file references resolve: `index.html` to `playtest-readiness.html` and the return link. Neither page offers an adventure PDF or ZIP download.
- All 16 baseline source files are nonempty. A temporary private source ZIP preserved all 16 entries and passed its CRC check. That development-only test archive was not published or represented as a player package.

Generated PDFs, PNGs and the temporary ZIP were written outside the repository for QA. They are not a released download. WeasyPrint results do not establish browser printing equivalence or screen-reader usability.

## Package blockers at the baseline

| Requirement | Evidence and next gate |
|---|---|
| Complete runnable Voynich edition | Current materials explicitly identify this as a development excerpt. Verify the full approved manuscript before assembling a complete edition. |
| Four Level 1 pregenerated character sheets | No such sheets were present in the 16-file baseline. Character Hall is a narrative profile, not a rules-complete character sheet. Review any new character assets separately. |
| Combat balance and rule rights | Optional creature reference is explicitly unverified. Preserve negotiation routes; do not mark combat balanced or licensed. |
| Separate player and DM feedback | Separate one-page [player](inkbound-threshold-player-feedback-print.html) and [DM](inkbound-threshold-dm-feedback-print.html) paper sheets now support the private fallback. Hosted endpoints and tested QR images remain unverified; see [feedback evidence](FEEDBACK_READINESS.md). |
| Accessible final PDF/ZIP download | HTML sources render locally; committed final PDF/ZIP count is zero at the baseline. Assemble and verify the intended private package only after missing contents and audience boundaries are resolved. |
| Professional map acceptance | Legibility/source checks are distinct from approval of finished professional artwork. |
| Actual player playtest | Rehearsal paths and automated checks are not evidence of an external playtest. |
| Release approval | No publication, registration, sales or deployment is authorized by this audit. |

## Private assembly rule

Keep the Dungeon Master packet, DM map, quick sheet and source assembly files out of player-facing bundles. Hand out the gate clue at Scene 1 and the recovered journal leaf only after Scene 3. Re-run source and render checks after integrated changes, then inspect the exact resulting pages and test the exact final links before distribution.

## Combined-work reconciliation

The character review recovered four actual Level 1 sheets in the earlier Scholar's Last Message PDF; their absence from this baseline does not mean they were never produced. See [character reconciliation evidence](LEVEL1_BALANCE_AND_CHARACTER_REVIEW.md). They still need rules-edition/build-choice review and Inkbound-specific reconciliation before inclusion here.

The separate feedback development branch has an existing local implementation with 88 passing tests; it has not been integrated or verified as a hosted endpoint. See [feedback evidence](FEEDBACK_READINESS.md). Do not duplicate those forms or point printed QR codes at the local test server.

After combining the map doorway and DM rehearsal corrections, the final local pass, including the concurrent map-legend regression, passed 25 manuscript, 36 print-source and 48 render checks. The two player pages and one DM page remain intact. The [production checkpoint](PRODUCTION_RELEASE_CHECKPOINT.md) records the complete ten-workstream pass and remaining release gates.
