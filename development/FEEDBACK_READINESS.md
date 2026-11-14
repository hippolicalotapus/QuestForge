# QuestForge feedback and QR readiness

Verified on 2026-11-14. This is a private development checkpoint, not an endpoint announcement or permission to collect participant information.

## Existing work to preserve

The current Voynich branch (`feature/voynich-playtest-readiness-20261113`, source commit `03cbb281db2cbf14dae83e1ec81b012bbf0c2aa8`) contains feedback requirements and readiness notices, but no feedback submission implementation.

An existing implementation is on the separate `dev/questforge-static-checks-20261111` branch at `36c2daad9de8d3ce20c111c370b5ee715521755a`. It must be reviewed and integrated deliberately; it is not present on the current Voynich branch merely because its tests pass.

| Requirement | Verified evidence | Remaining work |
| --- | --- | --- |
| Player and Dungeon Master experiences | `feedback/index.html` has role selection, shared questions and conditional DM fields; payload and validation tests separate player/DM fields. | Separate verified mobile destinations are not established. |
| Anonymous feedback | Validation and intake tests accept player and DM feedback without contact details. | Verify this behavior through each final hosted experience. |
| Optional contact with consent | The preview disables and clears email without consent; intake/store tests keep opted-in contact separate. | Final privacy, retention, deletion and access policies remain prerequisites for real responses. |
| Confirmed submission | The local controller, handler, storage and listener return a receipt only after a successful save. | This is a loopback-only synthetic-data service, not a live HTTPS endpoint. |
| Separate printable QR codes | No verified final player/DM URLs or printable QR assets were found in the four inspected repository branches. | Verify final URLs, anonymous and opt-in submissions, phone access and printed-code scans before generating or inserting QR codes. |

The existing implementation includes `feedback/LOCAL_TESTING.md`, a loopback server, request validation, abuse-limit fixtures, private JSONL storage and redacted summaries. Its own instructions prohibit publishing, proxying or tunneling that local server and prohibit QR codes pointing to it. Preserve that boundary; it is not a production deployment candidate as-is.

## Checks actually run

Retrieved the 37 existing `feedback/` files from the exact separate-branch commit above into an isolated source snapshot and ran:

```sh
node --test feedback/*.test.mjs
```

Result: **88 passed, 0 failed, 0 skipped**. The suite includes a real loopback HTTP submission and receipt with synthetic data, anonymous player/DM validation, consent handling, role-specific fields, failed-storage handling, request limits and local storage checks. This is not evidence of a public endpoint, a phone scan, a screen-reader session or a browser end-to-end test.

Inspected all tracked file paths on the current Voynich, default, revenue-storefront and static-check branches. No production feedback deployment configuration or verified final QR destination was established from that source. No external endpoint was guessed or submitted to.

## Next implementation gate

Review the existing static-check branch for controlled integration rather than building duplicate forms. Then implement an approved hosted storage/consent design and distinct player/DM destinations. Do not place QR codes into the printable adventure until both final destinations have verified receipts and successful phone/printed-proof scans. Continue private paper feedback for playtests in the meantime.

No public files, endpoint settings or printable QR assets changed during this audit. No deployment, publication, external message or real participant submission occurred.
