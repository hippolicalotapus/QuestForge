import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizePlaytestFeedback} from './feedback-summary.mjs';
const player={kind:'player',adventureId:'voynich-playtest',version:'v1',clarity:5,consentToContact:true,contact:'fictional@example.org',suggestions:'Private note'};
const dm={kind:'dm',adventureId:'voynich-playtest',version:'v1',partySize:4,partyLevel:1,clarity:3,mapUsability:4};
test('combines anonymous player and DM ratings without exposing contact',()=>{
 const summary=summarizePlaytestFeedback([player,dm],'voynich-playtest');
 assert.equal(summary.totalResponses,2);assert.equal(summary.byRole.dm,1);
 assert.deepEqual(summary.ratings.clarity,{responses:2,mean:4});
 assert.doesNotMatch(JSON.stringify(summary),/fictional@example.org|Private note/);
});
test('excludes other adventures and rejects malformed records',()=>{
 assert.equal(summarizePlaytestFeedback([player],'other-adventure').totalResponses,0);
 assert.throws(()=>summarizePlaytestFeedback([{...player,privateData:'secret'}],'voynich-playtest'));
});
test('does not modify supplied feedback',()=>{
 const original=JSON.stringify(player);
 summarizePlaytestFeedback([player],'voynich-playtest');
 assert.equal(JSON.stringify(player),original);
});
