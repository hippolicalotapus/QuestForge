# Recovered-journal screen disclosure — 2026-11-15

Baseline: `feature/voynich-playtest-readiness-20261113` at `8a171e50c37dea5db707e94157ad78f83fd529ec`, preserving the newer Chromium print-review record and previous hosted-preview work.

## Defect and correction

The combined player handout correctly printed to two separate Letter sheets, but screen reading immediately exposed the Scene 3 recovered-journal clue below the gate sheet. A new screen-media regression test reproduced that exposure against the exact baseline source.

A native, initially unchecked checkbox now controls journal visibility through screen-only CSS. An explicit warning says to reveal it only after the Dungeon Master confirms recovery in Scene 3. The label changes between showing and hiding the sheet; the control identifies the journal via `aria-controls` and has a keyboard-focus treatment. No JavaScript, network request or closed-details printing behavior is involved.

Print media always includes the two original sheets regardless of checkbox state. The disclosure controls and instructions are absent from print. The original artwork, wording, scene timing and Letter page breaks remain intact.

This is a spoiler-avoidance control, not access control: the journal remains in the source, and printing intentionally includes it on page 2 for the facilitator to distribute separately.

## Executed local evidence

- New tests first failed because the baseline screen render exposed `PETALS POINT TO WATER` and had no disclosure control.
- Six Python tests passed after correction, including concealed/revealed screen-media checks and pixel-identical print output with the checkbox both checked and unchecked.
- 25 manuscript checks, 36 print-source checks, 13 Node audit tests and 49 existing render checks passed.
- Compared the corrected print output with the exact baseline source using the same WeasyPrint/PyMuPDF runtime: both Letter pages were pixel-for-pixel identical. Visually inspected the two corrected print-page PNGs as well.

Physical print proofs, assistive-technology sessions, actual player testing and final adventure release readiness remain separate gates. Hosted deployment and launcher integration are handled separately from this source correction.

Resume verification recovered all 33 tracked baseline files by exact Git blob SHA into a separate snapshot, then overlaid only the journal HTML and its regression test. Against that exact source, 25 manuscript checks, 36 print-source checks, 13 Node audit tests, six Python tests and 49 render checks passed. Native Chromium at a 320px iframe viewport confirmed initial concealment, keyboard Space reveal and Space concealment. The original print-review record at baseline 8a171e5 is preserved by using its tree as the commit base. No deployment or Actions were run.
