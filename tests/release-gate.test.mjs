import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const {validateRelease}=createRequire(import.meta.url)("../tools/release-gate.cjs");
const draft={id:"first-age-chronicles",title:"First Age Chronicles",level:1,version:"0.1.0",pdfPath:"releases/first-age-chronicles.pdf",playerFeedbackUrl:"https://example.org/player",dmFeedbackUrl:"https://example.org/dm",rightsReviewed:true,mapsApproved:true,playtested:true,feedbackTested:true,downloadVerified:true,ownerApproved:true};
test("release gate requires complete independently verified approvals",()=>{assert.equal(validateRelease(draft).ready,true);for(const key of ["rightsReviewed","mapsApproved","playtested","feedbackTested","downloadVerified","ownerApproved"]){const m={...draft,[key]:false};assert.equal(validateRelease(m).ready,false,key)}});
test("rejects non-level-one, missing PDF, or unsafe feedback links",()=>{for(const m of [{...draft,level:2},{...draft,pdfPath:"../../secret"},{...draft,dmFeedbackUrl:"javascript:alert(1)"},{...draft,playerFeedbackUrl:"http://example.org"}])assert.equal(validateRelease(m).ready,false)});
test("rejects empty or missing manifest",()=>{assert.equal(validateRelease(null).ready,false);assert.equal(validateRelease({}).ready,false)});
