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
["player map hides DM notes",!player.includes("KEYED DM NOTES")],
["player map hides secret item locations",!/(Seed pouch|leaf token|hidden compartment|Journal)/i.test(player)],
["DM map keeps secret locations",dm.includes("Seed pouch")&&dm.includes("leaf token")],
["player handout does not expose DM directions",!/(DC 11|DC 12|Dungeon Master ONLY|KEYED DM NOTES)/i.test(handout)],
["print layouts supplied",handout.includes("@media print")&&quick.includes("@media print")],
["player clue consistent",handout.includes("PETALS POINT TO WATER")],
["DM sheet private",quick.includes("DUNGEON MASTER ONLY")&&quick.includes("not give to players")],
["DM sheet avoids clipped print content",quick.includes("box-sizing:border-box")&&quick.includes("overflow-wrap:break-word")&&quick.includes("max-width:none")],
["DM print tables preserve row boundaries",quick.includes("tr{break-inside:avoid}")&&quick.includes("thead{display:table-header-group}")],
["player journal stays on a separate printed page",handout.includes("break-before:page")&&handout.includes("Give this page only when the journal is recovered")],
["player handout retains letter-sized print",handout.includes("@page{size:letter;margin:.5in}")],
["DM handout retains letter-sized print",quick.includes("@page{size:letter;margin:.5in}")]
];
for(const [name,ok] of tests)assert.ok(ok,name);
console.log("PASS: "+tests.length+" map confidentiality and print-readiness source checks");
