import test from 'node:test';
import assert from 'node:assert/strict';
import {playtestReviewActions} from './feedback-review-actions.mjs';
const item=clarity=>({kind:'player',adventureId:'voynich-playtest',version:'v1',clarity,contact:'fictional@example.org',consentToContact:true});
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

test('newly rated criterion requires human baseline review',()=>{
 const previous=[item(4)];
 const current=[{...item(4), pacing:3}];
 const result=playtestReviewActions(previous,current,'voynich-playtest');
 assert.ok(result.actions.some(a=>a.criterion==='pacing'&&a.action==='establish-baseline'&&a.requiresHumanReview));
 assert.equal(result.approvedForPublication,false);
 assert.equal(result.containsContactDetails,false);
});
