"use strict";
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname);
const dm = fs.readFileSync(path.join(root, "inkbound-threshold-dm-playtest-packet.md"), "utf8");
const player = fs.readFileSync(path.join(root, "inkbound-threshold-player-handout-01.md"), "utf8");
const story = fs.readFileSync(path.join(root, "voynich-level1-encounter-draft.md"), "utf8");
const tests = [
  ["Level 1 and DM packet", dm.includes("Level 1") && dm.includes("Dungeon Master")],
  ["Gate clue consistent", player.includes("ONLY WHAT GROWS MAY PASS") && story.includes("Only what grows may pass")],
  ["Fountain clue consistent", player.includes("PETALS   P O I N T") || (player.includes("P E T A L S") && story.includes("PETALS POINT TO WATER"))],
  ["Botanical clue is explicitly not a cipher", story.includes("not a cipher") && dm.includes("not a cipher")],
  ["Noncombat resolution", story.includes("Persuasion") && dm.includes("conversation")],
  ["No forced combat", dm.includes("not automatic initiative")],
  ["No automatic hazard damage", dm.includes("no automatic damage")],
  ["Player and DM map separation", dm.includes("Player map") && dm.includes("DM map")],
  ["Private release gate", dm.includes("not for sale") && story.includes("NOT FOR PUBLICATION")],
  ["Feedback remains offline", dm.includes("no data collection") && dm.includes("QR codes tested")],
  ["Player source handout has no DM-only spoiler section", !player.includes("## Dungeon Master") && !player.includes("## DM assembly")],
  ["Player handout excludes DM-only assembly notes", !player.includes("DM) assembly and quality notes") && !player.includes("remove from player print")],
  ["Journal leaf has an explicit delayed reveal", player.includes("recovered journal leaf is given only after the journal is found")],
  ["Player and story share the same fountain clue", player.includes("P E T A L S   P O I N T   T O   W A T E R") && story.includes("PETALS POINT TO WATER")]
];
for (const [name, result] of tests) assert.ok(result, name);
console.log("PASS: " + tests.length + " manuscript continuity and safety checks");
