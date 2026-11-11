from pathlib import Path
import re

site = Path("index.html").read_text(encoding="utf-8")
required = [
    "function buildAdventureDraft()",
    "function printAdventureDraft()",
    "function saveAdventureDraftLocal()",
    "function restoreAdventureDraftLocal()",
    "function addAdventureToLibrary()",
    "function showAdventureLibrary()",
    "function exportAdventureLibrary()",
    "async function importAdventureLibrary()",
    "function calculateEncounterXP()",
    "function sendPartyToForge()",
    "qf-print-cover",
]
missing = [item for item in required if item not in site]
assert not missing, f"Missing features: {missing}"
assert "mailto:questforge.adventures@gmail.com" not in site, "Unverified mailbox must not be published"
assert site.count("<script") == site.count("</script>"), "Unbalanced script tags"
assert site.count("<style") == site.count("</style>"), "Unbalanced style tags"
for fn in ["printAdventureDraft", "addAdventureToLibrary", "importAdventureLibrary"]:
    assert re.search(r"onclick=[\"']" + fn + r"\(\)[\"']", site), f"Missing UI action: {fn}"
print("QuestForge static checks passed (not a substitute for browser tests).")

# Extract inline JavaScript for a real parser check in the workflow.
scripts = re.findall(r"<script[^>]*>(.*?)</script>", site, flags=re.I | re.S)
assert len(scripts) == 1, f"Expected one inline script; found {len(scripts)}"
Path("/tmp/questforge-inline.js").write_text(scripts[0], encoding="utf-8")
print("Inline JavaScript extracted for Node syntax validation.")

# Catch broken navigation/actions and duplicate HTML IDs before browser testing.
ids = re.findall(r'\\bid="([^"]+)"', site)
duplicates = sorted({value for value in ids if ids.count(value) > 1})
assert not duplicates, f"Duplicate HTML IDs: {duplicates}"
inline = scripts[0]
handlers = sorted(set(re.findall(r'onclick="([A-Za-z_$][\\w$]*)\\(', site)))
missing_handlers = [name for name in handlers if not re.search(r'\\bfunction\\s+' + re.escape(name) + r'\\s*\\(', inline)]
assert not missing_handlers, f"Missing JavaScript click handlers: {missing_handlers}"
print(f"Verified {len(ids)} unique HTML IDs and {len(handlers)} click handler names.")
