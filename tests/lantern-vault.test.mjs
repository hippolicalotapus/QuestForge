import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const {adventure,validateDraft}=createRequire(import.meta.url)("../adventures/the-lantern-vault.cjs");
test("original level-one outline has multiple nonviolent paths",()=>{
 assert.equal(validateDraft(adventure),true);assert.equal(adventure.readyForSale,false);assert.equal(adventure.scenes.length,3);
});
test("rejects a non-level-one or purported sale-ready outline",()=>{
 assert.equal(validateDraft({...adventure,level:2}),false);assert.equal(validateDraft({...adventure,readyForSale:true}),false);
});
