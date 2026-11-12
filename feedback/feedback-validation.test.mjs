import test from 'node:test';
import assert from 'node:assert/strict';
import {validateFeedback} from './feedback-validation.mjs';
const player = {kind:'player',adventureId:'voynich-playtest',version:'1.0'};
const dm = {...player,kind:'dm',partySize:4,partyLevel:1};
test('anonymous player and DM submissions accepted',()=>{assert.equal(validateFeedback(player).ok,true);assert.equal(validateFeedback(dm).ok,true)});
test('optional contact requires affirmative consent',()=>{assert.equal(validateFeedback({...player,contact:'person@example.org'}).ok,false);assert.equal(validateFeedback({...player,consentToContact:true,contact:'person@example.org'}).ok,true);assert.equal(validateFeedback({...player,consentToContact:true}).ok,false)});
test('reject invalid identifiers, ratings and long text',()=>{for(const change of [{adventureId:'../bad'},{version:''},{clarity:6},{suggestions:'x'.repeat(2001)},{kind:'unknown'}]) assert.equal(validateFeedback({...player,...change}).ok,false)});
test('DM form validates party size and level',()=>{assert.equal(validateFeedback({...dm,partySize:0}).ok,false);assert.equal(validateFeedback({...dm,partyLevel:21}).ok,false)});
test('invalid shapes fail closed',()=>{for(const input of [null,[],false,{}]) assert.equal(validateFeedback(input).ok,false)});

test('reject unexpected fields and cross-form party data',()=>{
  assert.equal(validateFeedback({...player, admin:true}).ok,false);
  assert.equal(validateFeedback({...player, partySize:4}).ok,false);
  assert.equal(validateFeedback({...player, partyLevel:1}).ok,false);
  assert.equal(validateFeedback({...dm, unexpected:'value'}).ok,false);
});
