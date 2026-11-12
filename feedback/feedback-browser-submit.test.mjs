import test from 'node:test';
import assert from 'node:assert/strict';
import {createFeedbackSubmitter} from './feedback-browser-submit.mjs';
test('browser submitter requires explicit same-origin endpoint',()=>{
 for(const endpoint of [undefined,'https://example.com/submit','//evil.test','/feedback?x=1','/feedback#x']) assert.throws(()=>createFeedbackSubmitter({endpoint,fetchImpl:async()=>({})}));
});
test('browser submitter confirms success only with a saved receipt',async()=>{
 let request;
 const submit=createFeedbackSubmitter({endpoint:'/api/feedback',fetchImpl:async(url,options)=>{request={url,options};return {status:201,json:async()=>({ok:true,receipt:'receipt-123'})};}});
 assert.deepEqual(await submit({kind:'player'}),{ok:true,receipt:'receipt-123'});
 assert.equal(request.url,'/api/feedback');assert.equal(request.options.method,'POST');assert.equal(request.options.credentials,'same-origin');
});
test('browser submitter does not claim success without receipt',async()=>{
 const submit=createFeedbackSubmitter({endpoint:'/api/feedback',fetchImpl:async()=>({status:201,json:async()=>({ok:true})})});
 assert.equal((await submit({kind:'player'})).ok,false);
});
test('browser submitter reports transport failures without claiming storage',async()=>{
 const submit=createFeedbackSubmitter({endpoint:'/api/feedback',fetchImpl:async()=>{throw new Error('offline');}});
 const result=await submit({kind:'player'});assert.equal(result.ok,false);assert.match(result.error,/not confirmed saved/);
});
