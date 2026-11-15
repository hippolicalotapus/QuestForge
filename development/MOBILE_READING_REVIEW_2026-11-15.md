# Inkbound Threshold mobile-reading improvements — 2026-11-15

Baseline: `feature/voynich-playtest-readiness-20261113` at `288c59db30a6323e2e1cf4cec83ea1498fa9fa6b`. This review concerns reading and printing, not gameplay balance or a completed player playtest.

## Confirmed reading problems

An actual Chrome iframe inspection at a 320px viewport showed that the DM quick sheet retained about 38px of padding on each side. Its table was only 228px wide, with roughly 99px for a gate-clue cell, producing many short wrapped lines. The problem was cramped reading rather than horizontal page overflow.

The standalone player map has a 1200px-wide canvas. Its 21px room labels shrink to about 5.6px when the complete plan is fit to a 320px-wide view; the 17px legend becomes about 4.5px. An overview alone cannot provide readable label access at that width.

## Changes

- The DM quick sheet has a screen-only breakpoint through 600px: 20px main padding, 16px body text with 1.5 line height, and slightly more cell padding. Existing print styles remain unchanged.
- The new `inkbound-threshold-player-map-view.html` uses the exact existing player SVG for both a whole-plan overview and a native full-size detail disclosure. The detail region supports horizontal and vertical scrolling and keyboard focus. A player-safe room and line-legend key is provided as HTML text.
- The reader print layout selects the original map alone on one landscape Letter sheet; the local WeasyPrint proof verifies that layout. Neither SVG map, the approved illustrations nor adventure content was edited.
- The playtest packet and package inventory link the reader; the hosted launcher's integration is handled separately.

## Executed local verification

- 25 manuscript checks and 36 print-source checks passed.
- 13 printable-audit Node tests passed.
- Four Python tests passed, including botanical raster tests, both feedback-sheet PDF subtests, and the map-reader structure/audience/print test.
- The existing render script passed 49 checks. The original two player sheets, one DM quick sheet and both maps remain intact.
- The DM quick-sheet print raster was byte-identical before and after the screen-only CSS change using the same WeasyPrint/PyMuPDF environment.
- The new map-reader print proof was visually inspected: one 792 x 612pt landscape Letter page with the full original map, readable trim margins and no screen controls or additional blank page.

Screen-reader sessions, physical print proofs, actual player testing and final professional-art acceptance remain unverified. No feedback API, participant data collection, new live endpoint or balance-testing claim is introduced by this change.

## Actual Chrome post-change checks

The integrated review checked the changed source in actual Chrome iframes before hosted deployment:

- DM sheet at viewport 320px: document width 305px with a 15px vertical scrollbar, no horizontal overflow, body text 16px. The table widened from 228px to 265px and the measured clue cell from about 99px to 124.58px.
- DM sheet at viewport 390px: document width 375px, body text 16px, table width 335px.
- Player map reader at viewport 320px: document width 305px with no horizontal page overflow. Focusing the native disclosure and pressing Enter opened it. The map detail rendered at its intended 1200px width inside a 218px-wide scroll region with 1200px scroll width. The region had an accessible label and was keyboard focusable. The image used the original player SVG.

These checks establish the reported Chrome viewport behavior and native keyboard interaction. They are not a physical-phone, assistive-technology or actual-player test. The screen-reading journal-disclosure issue in the combined player handout remains a separate usability item; its two-page print structure was not changed in this pass.
