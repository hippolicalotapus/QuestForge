# QuestForge production and release checkpoint

Private development review, 2026-11-14. Starting source: `03cbb281db2cbf14dae83e1ec81b012bbf0c2aa8` on `feature/voynich-playtest-readiness-20261113`.

## Adventure production

The current source is **The Inkbound Threshold**, a four-character Level 1 private-playtest scenario. It is not proof that the earlier complete **The Scholar's Last Message** adventure has been revised, reconciled or made ready for release. Keep the two titles and their assets distinct.

The DM packet supplies four rehearsal paths, a 60/90-minute time budget, player handout timing, optional fountain resolution and a manual observation record. Journal recovery and the 20 gp party reward do not depend on a successful roll or optional fountain visit. The keeper is a conversation first; optional combat has not been approved as balanced.

This review corrected rehearsal Path C: it now explicitly waters the trough before obtaining and keeping the leaf token. Careful crossing alone does not reveal the token. The story's acquisition condition, choice to return or keep the token, and no-roll keeper recovery are preserved.

Validation after the edit: 25 manuscript continuity/safety source checks and 35 map confidentiality/print-source checks passed locally. These are executable source checks, not evidence of a completed player playtest or combat balance.

## Release readiness

| Component | Evidence and remaining gate |
|---|---|
| Session flow | Four DM rehearsal routes exist. Run them with the final map geometry and collect real timing and player observations before claiming tested usability. |
| Player clues | Gate and journal clues have separate printable sheets. Keep the journal sheet concealed until recovery and the fountain message out of player handouts. |
| Maps and printing | The print/package workstream verified two clean player pages and one DM page, with 108 source/render checks passing against the starting source. The map workstream corrected a missing cellar doorway in both maps and reported rendered inspection plus seven geometry checks. Re-run rendering after combining changes; do not equate a passing check with professional-art approval. See `PACKAGE_READINESS.md`. |
| Four Level 1 characters | Four older sheets exist in `Voynich_Codex_Complete_Print_and_Play_2026-11-08.pdf`, physical pages 19–22: Mira Quill, Bran Tor, Lyra Fen and Orin Vale. They belong to The Scholar's Last Message and are not included in the current repository packet. Reconcile their scenario use, intended rules edition and complete mechanical choices before packaging; do not silently create replacement characters. |
| Optional combat | The keeper's temporary stand-in is not a verified balanced, licensed release encounter. A private noncombat rehearsal can use negotiation/retreat; do not certify the combat path from the manuscript alone. |
| Feedback | The separate `dev/questforge-static-checks-20261111` branch at `36c2daad9de8d3ce20c111c370b5ee715521755a` contains a local feedback prototype; its workstream passed 88 tests including a synthetic loopback submission/receipt. It is not integrated into this Voynich branch and uses one role-selecting preview rather than separately verified hosted player and DM destinations. No verified live HTTPS endpoint or QR print assets were established. Do not tunnel/publish that local server or use it as a QR destination. Integrate, then verify separate live submissions and phone-tested QR destinations before printing QR codes or recruiting publicly. Manual paper feedback remains available for private rehearsal. See `FEEDBACK_READINESS.md`. |
| Complete distribution | Check the final file manifest, download access, PDF/ZIP contents and absence of player-facing DM spoilers. The repository's source files alone do not establish a complete distributable adventure. |
| CI | The CI workstream added an optional render job and trigger coverage, and reported 108 local source/render checks passing. Verify the final combined commit's GitHub Actions results before claiming the new CI coverage passed remotely. |
| Release decision | No publication, sales, public registration or live checkout is authorized by this development batch. Credit authorization for development does not certify launch readiness. |

## Next production handoff

Combine the map, print, character, feedback and CI workstream evidence without overwriting approved work. Re-run source and render checks on the combined files. Resolve the character and feedback gates, then run a private noncombat playtest with four Level 1 characters and record actual timing. Keep unresolved items explicit instead of marking the package complete.

## One-time ten-workstream execution

These workstreams were executed once in this conversation across six parallel workers, followed by one combined review. This was not a simultaneous launch of ten saved scheduled automations; those project schedules remained paused.

| Workstream | Verified outcome |
|---|---|
| Player map validation | Missing cellar doorway corrected; player confidentiality retained. |
| DM map validation | Matching doorway corrected; keyed information retained. |
| Handout print layout | Two player pages and one DM page rendered cleanly. |
| Level One balance | Four noncombat/fail-forward routes reviewed; combat remains provisional. |
| Character sheet checks | Four older pregens recovered and 11 internal arithmetic checks passed; integration/build review remains. |
| Feedback QR checks | Existing separate-branch local implementation passed 88 tests; hosted destinations and QR remain unverified. |
| Adventure CI repair | Added render-job trigger coverage and a bounded render job; final exact-commit CI still requires verification. |
| Package integrity | Baseline inventory, local links and temporary source ZIP verified; audience boundaries documented. |
| Adventure production | Rehearsal Path C now acquires the token before keeping it. |
| Release readiness | Distinct adventure editions and remaining gates documented; no release-ready claim. |

Final combined local verification after preserving concurrent map-legend improvements: **25 manuscript + 36 print-source + 48 render checks passed**. The two final maps were visually inspected after the doorway correction. This does not substitute for actual playtesting, final professional-art acceptance, hosted feedback verification or approval to publish.
