# Inkbound Threshold — Level 1 private playtest gate

Internal Dungeon Master (DM) release checklist; not publication approval.

## Print and map checks
- Run `node development/verify-inkbound-packet.cjs` and `node development/verify-inkbound-print-assets.cjs`.
- Render and visually inspect player and DM SVG maps at print size. Check every legend, room label, clue callout and trim margin.
- Print both HTML handouts to letter-sized PDF. Verify the player journal is on its own sheet and DM-only text does not leak into player materials.
- Confirm 60- and 90-minute routes, fail-forward latch, noncombat recovery and the guaranteed reward remain intact.

## Playtest readiness
- Use fictional or consenting private testers only. Keep player and DM feedback distinct.
- QR codes must resolve to a verified live QuestForge feedback endpoint before inclusion in distributed PDFs; do not substitute untested URLs.
- Confirm level-1 encounter safety and verify artwork and adventure rights before distribution.
- Record test command, exact commit, screenshots, print page count and outstanding issues.

No deployment, publication, spending or public recruitment is authorized by this checklist.
