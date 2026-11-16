import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const text=readFileSync(new URL("../adventures/the-lantern-vault-playtest-draft.md",import.meta.url),"utf8");
test("Lantern Vault draft includes all three playtest scenes",()=>{
 for(const heading of ["The Darkened Square","The Starward Steps","The Mirror Room","Resolution","Playtest observations"])assert.ok(text.includes(heading),heading);
});
test("playtest draft remains clearly unlaunched and offers alternatives",()=>{
 assert.ok(text.includes("Not a complete or sale-ready adventure"));
 assert.ok(text.includes("Do not gate the adventure behind a single skill check"));
 assert.ok(text.includes("Do not publish or charge"));
});
