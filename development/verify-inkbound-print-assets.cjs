"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const base = __dirname;
const player = fs.readFileSync(path.join(base,"maps/inkbound-threshold-player-map.svg"),"utf8");
const dm = fs.readFileSync(path.join(base,"maps/inkbound-threshold-dm-map.svg"),"utf8");
const handout = fs.readFileSync(path.join(base,"inkbound-threshold-player-handout-print.html"),"utf8");
const quick = fs.readFileSync(path.join(base,"inkbound-threshold-dm-quick-sheet-print.html"),"utf8");
const tests = [
["both maps are SVG", [player,dm].every(x=>x.startsWith("<svg")&&x.trim().endsWith("</svg>"))],
["four public locations match", ["GATE / VESTIBULE","ROOTBOUND HALL","CELLAR","VILLAGE FOUNTAIN"].every(x=>player.includes(x)&&dm.includes(x))],
["DM map includes keyed notes",dm.includes("KEYED DM NOTES")],
["DM map note panel has bottom breathing room",(()=>{const panel=dm.match(/<rect x="650" y="(\d+)" width="470" height="(\d+)" fill="#fff9e9"/);const last=dm.match(/<text x="676" y="(\d+)">4 • Five-petal fountain; hidden compartment<\/text>/);return !!panel&&!!last&&Number(panel[1])+Number(panel[2])-Number(last[1])>=20})()],
["player map hides DM notes",!player.includes("KEYED DM NOTES")],
["player map hides secret item locations",!/(Seed pouch|leaf token|hidden compartment|Journal)/i.test(player)],
["DM map keeps secret locations",dm.includes("Seed pouch")&&dm.includes("leaf token")],
["player handout does not expose DM directions",!/(DC 11|DC 12|Dungeon Master ONLY|KEYED DM NOTES)/i.test(handout)],
["print layouts supplied",handout.includes("@media print")&&quick.includes("@media print")],
["player clue consistent",handout.includes("PETALS POINT TO WATER")],
["fountain discovery is not spoiled in printable handout",!handout.includes("The spring wakes at first frost.")],
["fountain discovery is not spoiled by capitalization or spacing",!/the\s+spring\s+wakes\s+at\s+first\s+frost/i.test(handout)],
["DM sheet private",quick.includes("DUNGEON MASTER ONLY")&&quick.includes("not give to players")],
["DM sheet avoids clipped print content",quick.includes("box-sizing:border-box")&&quick.includes("overflow-wrap:break-word")&&quick.includes("max-width:none")],
["DM print tables preserve row boundaries and allow pagination",quick.includes("table{break-inside:auto}")&&quick.includes("tr{break-inside:avoid}")&&quick.includes("thead{display:table-header-group}")&&quick.includes("h2{break-after:avoid}")],
["player handout has exactly two separately printable sheets",handout.match(/<main class="sheet">/g)?.length===2&&handout.includes('</main><main class="sheet">')],
["first player sheet does not reveal recovered journal clue",(()=>{const first=handout.split('</main><main class="sheet">')[0];return !first.includes("PETALS POINT TO WATER")&&!first.includes("The spring wakes at first frost.")})()],
["printable player handouts contain no DM assembly notes",!handout.includes("DM) assembly")&&!handout.includes("remove from player print")],
["player journal stays on a separate printed page",handout.includes("break-before:page")&&handout.includes("Give this page only when the journal is recovered")],
["mobile handout styles cannot override print margins",handout.indexOf("@media(max-width:600px)")>=0&&handout.indexOf("@media print")>handout.indexOf("@media(max-width:600px)")],
["player handout retains letter-sized print",handout.includes("@page{size:letter;margin:.5in}")],
["DM handout retains letter-sized print",quick.includes("@page{size:letter;margin:.5in}")],
["DM clue labels follow mapped objects",dm.includes('<text x="340" y="385">Seed pouch</text>')&&dm.includes('<text x="350" y="605">Water trough + leaf token</text>')&&dm.includes('<text x="775" y="475">Journal</text>')],
["player map uses readable backed room labels",player.includes('<rect x="268" y="338"')&&player.includes('font-size="21"')],
["DM map uses readable backed room labels",dm.includes('<rect x="268" y="338"')&&dm.includes('font-size="21"')],
["map labels have opaque backing to remain readable in SVG renderers", [player,dm].every(x=>x.includes('<rect x="268" y="338" width="270" height="35" fill="#eee6d1"')&&x.includes('<rect x="278" y="443" width="270" height="35" fill="#eee6d1"'))],
["DM sheet preserves guaranteed reward regardless of fountain order",quick.includes("Mara pays 20 gp total on journal return whether the fountain is visited before or afterward")],
["DM sheet preserves noncombat keeper recovery after failed Persuasion",quick.includes("protecting the journal after failed Persuasion allows recovery without combat")],
["DM sheet preserves 60 and 90 minute pacing",quick.includes("For a 60-minute session")&&quick.includes("For 90 minutes")],
["DM sheet never reveals frost clue before fountain exploration",quick.includes("reveal the first-frost note only if explored")],
["DM sheet preserves failed-latch fail-forward",quick.includes("failed DC 12 latch attempt opens on a noisy second attempt")]
];
for(const [name,ok] of tests)assert.ok(ok,name);
console.log("PASS: "+tests.length+" map confidentiality and print-readiness source checks");
