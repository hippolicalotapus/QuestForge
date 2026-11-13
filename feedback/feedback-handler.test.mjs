import test from 'node:test';
import assert from 'node:assert/strict';
import {createFeedbackHandler} from './feedback-handler.mjs';
import {createRateLimiter} from './feedback-rate-limit.mjs';
const valid=JSON.stringify({kind:'player',adventureId:'voynich-playtest',version:'1.0'});
const req=(body=valid)=>({method:'POST',contentType:'application/json',rateLimitKey:'test-client',body});
test('rejects wrong method, media type and oversized requests before storage',async()=>{
 let writes=0;const handle=createFeedbackHandler({save:async()=>{writes++;return 'receipt'}});
 assert.equal((await handle({...req(),method:'GET'})).status,405);
 assert.equal((await handle({...req(),contentType:'text/plain'})).status,415);
 assert.equal((await handle(req('x'.repeat(16385)))).status,413);
 assert.equal(writes,0);
});
test('rejects malformed and invalid JSON',async()=>{
 const handle=createFeedbackHandler({save:async()=> 'receipt'});
 assert.equal((await handle(req('{bad'))).status,400);
 assert.equal((await handle(req('{}'))).status,400);
});
test('accepts valid anonymous submission with confirmed receipt',async()=>{
 let stored;const handle=createFeedbackHandler({save:async v=>{stored=v;return 'receipt-123'}});
 assert.deepEqual(await handle(req()),{status:201,body:{ok:true,receipt:'receipt-123'}});
 assert.equal(stored.contact,null);
});
test('reports unavailable storage without false success',async()=>{
 const handle=createFeedbackHandler({save:async()=>{throw Error('offline')}});
 assert.equal((await handle(req())).status,503);
});

test('rejects malformed request envelopes and unsafe size configuration',async()=>{
  assert.throws(()=>createFeedbackHandler({save:async()=> 'ok',maxBytes:0}),RangeError);
  assert.throws(()=>createFeedbackHandler({save:async()=> 'ok',maxBytes:Infinity}),RangeError);
  const handle=createFeedbackHandler({save:async()=> 'ok'});
  assert.equal((await handle(null)).status,400);
  assert.equal((await handle([])).status,400);
});

test('enforces per-client request limit before parsing and storage',async()=>{
 let writes=0;const handle=createFeedbackHandler({save:async()=>{writes++;return 'receipt'},rateLimit:()=>({allowed:false})});
 assert.equal((await handle(req())).status,429);
 assert.equal(writes,0);
 assert.equal((await handle({...req(),rateLimitKey:''})).status,400);
});

test('integrated limiter blocks excess submissions per identity and resets at window boundary',async()=>{
 let time=0;let writes=0;
 const rateLimit=createRateLimiter({limit:2,windowMs:100,now:()=>time});
 const handle=createFeedbackHandler({save:async()=>{writes++;return 'receipt'},rateLimit});
 assert.equal((await handle(req())).status,201);
 assert.equal((await handle(req())).status,201);
 assert.equal((await handle(req())).status,429);
 assert.equal((await handle({...req(),rateLimitKey:'other-client'})).status,201);
 assert.equal(writes,3);
 time=100;
 assert.equal((await handle(req())).status,201);
 assert.equal(writes,4);
});

test('fails closed if limiter throws, rejects, or returns an invalid decision',async()=>{
 let writes=0;
 for(const rateLimit of [()=>{throw Error('down')},async()=>{throw Error('down')},()=>null,()=>({allowed:'yes'})]){
   const handle=createFeedbackHandler({save:async()=>{writes++;return 'receipt'},rateLimit});
   assert.equal((await handle(req())).status,503);
 }
 assert.equal(writes,0);
});

test('throttled response provides only a safe positive retry delay',async()=>{
 const save=async()=>{throw Error('must not save')};
 const withDelay=createFeedbackHandler({save,rateLimit:()=>({allowed:false,retryAfterMs:2500})});
 assert.deepEqual(await withDelay(req()),{status:429,body:{ok:false,error:'Too many requests',retryAfterMs:2500}});
 for(const retryAfterMs of [-1,Infinity,'1000']){
   const handle=createFeedbackHandler({save,rateLimit:()=>({allowed:false,retryAfterMs})});
   assert.deepEqual(await handle(req()),{status:429,body:{ok:false,error:'Too many requests'}});
 }
});

test('rejects client-provided rate-limit identity inside JSON payload',async()=>{
 let writes=0;
 const handle=createFeedbackHandler({save:async()=>{writes++;return 'receipt'}});
 const body=JSON.stringify({...JSON.parse(valid),rateLimitKey:'spoofed-client'});
 assert.equal((await handle(req(body))).status,400);
 assert.equal(writes,0);
});
