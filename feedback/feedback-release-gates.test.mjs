import test from 'node:test';
import assert from 'node:assert/strict';
import {validateFeedback} from './feedback-validation.mjs';

const player=()=>({kind:'player',adventureId:'voynich-playtest',version:'v1',clarity:4,suggestions:'Clearer room labels'});
const dm=()=>({kind:'dm',adventureId:'voynich-playtest',version:'v1',partySize:4,partyLevel:1,encounterBalance:4,mapUsability:3});

test('anonymous player and DM feedback can be valid without contact details',()=>{
 assert.equal(validateFeedback(player()).ok,true);
 assert.equal(validateFeedback(dm()).ok,true);
});
test('player cannot submit DM-only fields',()=>{
 for(const field of ['partySize','partyLevel','encounterBalance','mapUsability','rulesAmbiguities','fixes']){
  assert.equal(validateFeedback({...player(),[field]:field==='rulesAmbiguities'||field==='fixes'?'note':1}).ok,false);
 }
});
test('DM feedback requires party size and level',()=>{
 assert.equal(validateFeedback({...dm(),partySize:undefined}).ok,false);
 assert.equal(validateFeedback({...dm(),partyLevel:undefined}).ok,false);
});
test('contact details require explicit opt-in',()=>{
 assert.equal(validateFeedback({...player(),contact:'tester@example.org'}).ok,false);
 assert.equal(validateFeedback({...player(),consentToContact:true,contact:'tester@example.org'}).ok,true);
});
test('unexpected personal fields are rejected',()=>{
 assert.equal(validateFeedback({...player(),homeAddress:'private'}).ok,false);
});
test('overlong notes and invalid ratings are rejected',()=>{
 assert.equal(validateFeedback({...player(),suggestions:'x'.repeat(2001)}).ok,false);
 assert.equal(validateFeedback({...player(),clarity:6}).ok,false);
});
