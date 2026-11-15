# Private print rendering checks

Run the existing Node manuscript and print-source validators first. Then install the optional render dependencies in a local virtual environment:

```sh
python -m pip install -r development/requirements-render-qa.txt
python -m unittest discover -s development -p 'test_inkbound*.py'
python development/verify-inkbound-renders.py --output-dir /tmp/questforge-render-qa
```

The script renders both SVG maps, the two player clue sheets and the one-page Dungeon Master quick sheet. It checks Letter page size, text margins, clue separation and the DM warning/footer. Inspect the resulting PNGs as well: these checks do not establish artistic quality, gameplay balance, endpoint availability or browser printing equivalence.

The renderer reads repository assets and writes only to the requested local output directory. It does not deploy, contact a service, generate feedback QR codes or claim commercial readiness. Installing its dependencies requires normal package access; system Cairo/Pango libraries may also be required. Keep generated outputs outside the repository.

2026-11-14 verification: 60 existing source checks and 48 render checks passed. Two isolated negative checks confirmed that the renderer rejects a two-page DM quick sheet and a journal clue exposed on the gate sheet. The maps and three printable pages were visually inspected.

The private playtest workflow now watches the renderer, its dependency file and this guide as well as the manuscript/print assets. A separate bounded job installs the pinned renderer dependencies, runs the render checks and retains the private render evidence for three days. Existing Node source checks remain unchanged. This workflow has no deployment step; a newly edited workflow is verified only once its exact commit's Actions run passes.


2026-11-15 botanical regression: the illustrations now carry their own SVG paint attributes, so print renderers retain the green stems and outlines, pale petals and gold flower center. The raster tests above run each embedded SVG independently of host-page CSS; they caught the previous black silhouettes before the correction. See `BOTANICAL_PRINT_REVIEW_2026-11-15.md`.

The test discovery command also renders the separate player and DM paper-feedback sheets. Each must remain one Letter page with readable margins and audience-specific text. Paper sheets contain no web submission controls or unverified destinations.

The map-reader test checks the same original SVG is used for overview and detail, the native disclosure starts collapsed, the scroll area is keyboard focusable, and a landscape Letter print proof contains vector map artwork. Original standalone SVG maps remain unchanged. See `MOBILE_READING_REVIEW_2026-11-15.md` for screen-reading evidence and remaining limits.
