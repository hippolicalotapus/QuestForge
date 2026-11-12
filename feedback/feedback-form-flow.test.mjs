import test from 'node:test';
import assert from 'node:assert/strict';
import {collectFeedback} from './feedback-form-data.mjs';
import {createFeedbackFormController} from './feedback-form-controller.mjs';
function fields(kind,consent){const value=v=>({value:v});return {elements:{kind:value(kind),adventureId:value('voynich-playtest'),version:value('1.0'),consentToContact:{checked:consent},contact:value(consent?'dm@example.com':''),clarity:value('4'),suggestions:value('Useful session'),accessibilityConcerns:value(''),partySize:value('4'),partyLevel:value('1'),encounterBalance:value('3'),rulesAmbiguities:value('')}};}
for(const [kind,consent] of [['player',false],['dm',true]]) {
 test(kind+' form fields produce valid payload and confirmed receipt',async()=>{
  let submitted;
  const controller=createFeedbackFormController({endpoint:'/api/feedback',fetchImpl:async(_url,options)=>{submitted=JSON.parse(options.body);return {status:201,json:async()=>({ok:true,receipt:'test-receipt'})};}});
  const payload=collectFeedback(fields(kind,consent));
  const result=await controller(payload);
  assert.equal(result.ok,true);assert.equal(result.submitted,true);
  assert.deepEqual(submitted,payload);
  assert.equal(Object.hasOwn(submitted,'contact'),consent);
  assert.equal(Object.hasOwn(submitted,'partySize'),kind==='dm');
 });
}
