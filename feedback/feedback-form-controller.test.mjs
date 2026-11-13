import test from 'node:test';
import assert from 'node:assert/strict';
import {createFeedbackFormController} from './feedback-form-controller.mjs';
const valid={kind:'player',adventureId:'voynich-playtest',version:'1.0'};
test('controller blocks invalid feedback before making any request',async()=>{
 let calls=0;
 const process=createFeedbackFormController({endpoint:'/api/feedback',fetchImpl:async()=>{calls++;throw Error('must not fetch');}});
 const result=await process({...valid,partySize:4});
 assert.equal(result.ok,false);assert.equal(result.submitted,false);assert.equal(calls,0);
});
test('controller returns confirmed receipt for valid feedback',async()=>{
 let payload;
 const process=createFeedbackFormController({endpoint:'/api/feedback',fetchImpl:async(url,options)=>{payload=JSON.parse(options.body);return {status:201,json:async()=>({ok:true,receipt:'saved-123'})};}});
 const result=await process(valid);
 assert.deepEqual(result,{ok:true,receipt:'saved-123',submitted:true});
 assert.deepEqual(payload,valid);
});
test('controller does not claim submission when server fails',async()=>{
 const process=createFeedbackFormController({endpoint:'/api/feedback',fetchImpl:async()=>({status:503,json:async()=>({ok:false,error:'Storage unavailable'})})});
 const result=await process(valid);
 assert.equal(result.submitted,false);assert.equal(result.ok,false);assert.equal(result.error,'Storage unavailable');
});
