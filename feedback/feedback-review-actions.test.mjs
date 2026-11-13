import test from 'node:test';
import assert from 'node:assert/strict';
import {playtestReviewActions} from './feedback-review-actions.mjs';
const item=clarity=>({kind:'player',adventureId:'voynich-playtest',version:'v1',clarity,contact:'fictional@example.org'});
test('declining ratings prompt human review without publishing',()=>{
 const result=playtestReviewActions([item(5)],[item(2)],'voynich-playtest');
 assert.deepEqual(result.actions,[{criterion:'clarity',action:'review-decline',requiresHumanReview:true}]);
 assert.equal(result.approvedForPublication,false);
 assert.doesNotMatch(JSON.stringify(result),/fictional@example.org/);
});
test('empty current batch requests more feedback',()=>{
 const result=playtestReviewActions([item(5)],[],'voynich-playtest');
 assert.ok(result.actions.some(a=>a.action==='collect-feedback'));
});
