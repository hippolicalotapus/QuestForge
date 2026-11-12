import test from 'node:test';
import assert from 'node:assert/strict';
import {createFeedbackHandler} from './feedback-handler.mjs';
const valid=JSON.stringify({kind:'player',adventureId:'voynich-playtest',version:'1.0'});
const req=(body=valid)=>({method:'POST',contentType:'application/json',body});
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
