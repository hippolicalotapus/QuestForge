# Chromium print inspection — original Inkbound Threshold handouts (2026-11-14 local)

## Source and scope
- GitHub source branch: `feature/voynich-playtest-readiness-20261113`, baseline `1df9070f0f370ed642b27905b7e2337ca061e7f1`.
- Individually retrieved the **exact original HTML content** of `development/inkbound-threshold-player-handout-print.html` and `development/inkbound-threshold-dm-quick-sheet-print.html` through the private GitHub connector. No handout content was edited.
- Rendered locally using installed Chromium  `Page.printToPDF`, `printBackground=true`, `preferCSSPageSize=true`, `displayHeaderFooter=false`; inspected the actual PDF page PNGs. No GitHub Actions, publishing, deployment or paid services.

## Verified outcomes
- Player handout: **2 US Letter pages (612 × 792 pt)**, first gate sheet followed by a distinct recovered-journal sheet. No extra sheets.
- Player page 1 contains **ONLY WHAT GROWS MAY PASS** and not the journal clue.
- Player page 2 contains **PETALS POINT TO WATER** and its conditional distribution instruction.
- Dungeon Master quick sheet: **1 US Letter page (612 × 792 pt)** containing all sections, scene table, pacing notes and the private-only warning.
- On inspected rendered pages, no overlapping text, cut-off tables, clipped headings or blank extra pages were visible.
- Local PDF SHA-256 fingerprints (identification of these render outputs only):
  - Player: `c0ce2fa06ce0fa2f02a9cc8fab200cd2f7dec49c4b8013d67499740e5ff0d885`
  - DM: `7e7141ddb0908665507fa0c0bd39965faf3fb15e1a43b802034974f3b94fa332`

## Unverified / release blockers
- The exact original player and DM **SVG maps have not yet been print-rendered and visually inspected in this run**.
- This inspection covers the original HTML handouts only, not live feedback QR endpoints, D&D balance, rights clearance, player testing, physical printed proofs, or release approval.
- Do not call the adventure production-ready based on this pass alone.
