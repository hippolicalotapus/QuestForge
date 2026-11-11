"""QuestForge browser regression smoke test.

Run locally with: python -m pip install playwright
                  python -m playwright install chromium
                  python scripts/browser_smoke.py

Tests the actual repository index.html on desktop and mobile. No deployment.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import sys
from playwright.sync_api import sync_playwright


def run(site):
    site = Path(site).resolve()
    if not site.is_file():
        raise SystemExit(f"Missing website: {site}")
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory=str(site.parent)))
    Thread(target=server.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{server.server_port}/{site.name}"
    failures = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            try:
                for name, viewport in (("desktop", {"width": 1440, "height": 900}), ("mobile", {"width": 390, "height": 844})):
                    context = browser.new_context(viewport=viewport)
                    page = context.new_page()
                    errors = []
                    page.on("pageerror", lambda err: errors.append(str(err)))
                    try:
                        page.goto(url, wait_until="load")
                        assert page.title() == "QuestForge | Fantasy Adventure Studio"
                        page.locator("#unroll").click()
                        assert "open" in (page.locator("#map").get_attribute("class") or "")
                        page.locator("#map button[onclick=\"show('studio')\"]").click()
                        assert "active" in (page.locator("#studio").get_attribute("class") or "")
                        assert page.locator("#welcome").is_hidden()
                        page.get_by_role("button", name="Home & Map").click()
                        assert page.locator("#welcome").is_visible()
                        assert not errors, f"JavaScript errors: {errors}"
                        print(f"PASS {name}: map, workshop, home, no JavaScript exceptions")
                    except Exception as exc:
                        failures.append(f"{name}: {exc}")
                    finally:
                        context.close()
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()
    if failures:
        raise SystemExit("Browser smoke FAILED:\\n" + "\\n".join(failures))


if __name__ == "__main__":
    run(sys.argv[1] if len(sys.argv) > 1 else "index.html")
