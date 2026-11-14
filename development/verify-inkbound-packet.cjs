"use strict";
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname);
const dm = fs.readFileSync(path.join(root, "inkbound-threshold-dm-playtest-packet.md"), "utf8");
const player = fs.readFileSync(path.join(root, "inkbound-threshold-player-handout-01.md"), "utf8");
const story = fs.readFileSync(path.join(root, "voynich-level1-encounter-draft.md"), "utf8");
const tests = [
  ["DM rehearsal checks real print-size map readability", dm.includes("100% print size") && dm.includes("three ceramic pots")],
  ["DM rehearses no-roll paths and avoids unsafe scarecrow", dm.includes("Dry-run the four routes without dice") && dm.includes("do not substitute the full scarecrow monster")],
  ["Level-1 combat is explicitly optional and calibrated", story.includes("one creature only") && story.includes("not evidence of balanced combat") && story.includes("do not use the scarecrow monster stat block")],
  ["Keeper escalation is noncombat-first", story.includes("backs away and repeats the choice before initiative") && story.includes("Combat is not needed")],
  ["Level 1 and DM packet", dm.includes("Level 1") && dm.includes("Dungeon Master")],
  ["Gate clue consistent", player.includes("ONLY WHAT GROWS MAY PASS") && story.includes("Only what grows may pass")],
  ["Fountain clue consistent", player.includes("PETALS   P O I N T") || (player.includes("P E T A L S") && story.includes("PETALS POINT TO WATER"))],
  ["Botanical clue is explicitly not a cipher", story.includes("botanical clue") && dm.includes("not a cipher")],
  ["Noncombat resolution", story.includes("Persuasion") && dm.includes("conversation")],
  ["Keeper failed persuasion has a no-roll recovery", story.includes("If Persuasion fails") && dm.includes("If the players fail Persuasion")],
  ["Keeper leaf token is optional and usable later", story.includes("Returning the leaf token is optional") && dm.includes("Returning the token is a choice")],
  ["No forced combat", dm.includes("not automatic initiative")],
  ["Gate failure remains fail-forward in both sources", story.includes("noisy second attempt") && dm.includes("noisy second attempt")],
  ["Journal reward never depends on fountain visit order", story.includes("whether or not they have visited the fountain") && dm.includes("whether the party visits the fountain before or after receiving payment")],
  ["Four rehearsal paths documented", ["A — Puzzle solvers","B — Failed rolls","C — Careful negotiators","D — Time-limited group"].every(x => dm.includes(x))],
  ["60 and 90 minute pacing controls", dm.includes("60-minute session") && dm.includes("90-minute session")],
  ["No automatic hazard damage", dm.includes("no automatic damage")],
  ["Player and DM map separation", dm.includes("Player map") && dm.includes("DM map")],
  ["Private release gate", dm.includes("not for sale") && story.includes("NOT FOR PUBLICATION")],
  ["Feedback remains offline", dm.includes("no data collection") && dm.includes("QR codes tested")],
  ["Player source handout has no DM-only spoiler section", !player.includes("## Dungeon Master") && !player.includes("## DM assembly")],
  ["Player handout excludes DM-only assembly notes", !player.includes("DM) assembly and quality notes") && !player.includes("remove from player print")],
  ["Journal leaf has an explicit delayed reveal", player.includes("recovered journal leaf is given only after the journal is found")],
  ["Fountain compartment clue is not revealed in journal handout", !player.includes("The spring wakes at first frost.")],
  ["Player and story share the same fountain clue", player.includes("P E T A L S   P O I N T   T O   W A T E R") && story.includes("PETALS POINT TO WATER")]
];
for (const [name, result] of tests) assert.ok(result, name);
console.log("PASS: " + tests.length + " manuscript continuity and safety checks");
