import test from 'node:test';
import assert from 'node:assert/strict';
import {comparePlaytestBatches} from './feedback-comparison.mjs';
const make=(clarity)=>({kind:'player',adventureId:'voynich-playtest',version:'v1',clarity,suggestions:'private note'});
test('compares aggregate ratings without leaking text',()=>{
 const result=comparePlaytestBatches([make(3)],[make(5)],'voynich-playtest');
 assert.deepEqual(result.ratings.clarity,{previousResponses:1,currentResponses:1,previousMean:3,currentMean:5});
 assert.equal(result.containsContactDetails,false);
 assert.doesNotMatch(JSON.stringify(result),/private note/);
});
test('rejects invalid input instead of silently dropping it',()=>{
 assert.throws(()=>comparePlaytestBatches([make(3)],[{...make(5),address:'private'}],'voynich-playtest'));
});
