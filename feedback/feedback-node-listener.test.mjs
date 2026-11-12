import test from 'node:test';
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {createNodeFeedbackListener} from './feedback-node-listener.mjs';
const valid=JSON.stringify({kind:'player',adventureId:'voynich-playtest',version:'1.0'});
function request(body=valid,ip='127.0.0.1') {const r=Readable.from([Buffer.from(body)]);r.method='POST';r.headers={'content-type':'application/json','x-forwarded-for':'forged'};r.socket={remoteAddress:ip};return r;}
function response(){return {status:null,headers:null,body:null,writeHead(status,headers){this.status=status;this.headers=headers;this.headersSent=true;},end(body){this.body=JSON.parse(body);}};}
test('Node listener stores valid feedback and ignores forwarded spoofing',async()=>{let writes=0;const listener=createNodeFeedbackListener({save:async()=>{writes++;return 'receipt'}});const res=response();await listener(request(),res);assert.equal(res.status,201);assert.equal(res.headers['cache-control'],'no-store');assert.equal(writes,1);});
test('Node listener rejects oversized streams before saving',async()=>{let writes=0;const listener=createNodeFeedbackListener({save:async()=>{writes++;return 'receipt'},maxBytes:100});const res=response();await listener(request('x'.repeat(101)),res);assert.equal(res.status,413);assert.equal(writes,0);});
test('Node listener rejects missing connection identity',async()=>{const listener=createNodeFeedbackListener({save:async()=> 'receipt'});const req=request();req.socket={};const res=response();await listener(req,res);assert.equal(res.status,400);});

test('rejects unsupported requests without consuming request stream',async()=>{
 let reads=0;
 const request={method:'GET',headers:{'content-type':'application/json'},socket:{remoteAddress:'127.0.0.1'},async *[Symbol.asyncIterator](){reads++;yield Buffer.from(valid);}};
 const listener=createNodeFeedbackListener({save:async()=> 'receipt'});
 const res=response();await listener(request,res);
 assert.equal(res.status,405);assert.equal(reads,0);
 request.method='POST';request.headers={'content-type':'text/plain'};
 const res2=response();await listener(request,res2);
 assert.equal(res2.status,415);assert.equal(reads,0);
});

test('rejects oversized or malformed Content-Length without reading body',async()=>{
 let reads=0;const req={method:'POST',headers:{'content-type':'application/json','content-length':'9999999999999999999999999'},socket:{remoteAddress:'127.0.0.1'},async *[Symbol.asyncIterator](){reads++;yield Buffer.from(valid);}};
 const listener=createNodeFeedbackListener({save:async()=> 'receipt',maxBytes:128});
 const tooLarge=response();await listener(req,tooLarge);assert.equal(tooLarge.status,413);assert.equal(reads,0);
 for(const length of ['-1','1e3','01','garbage']){
   req.headers['content-length']=length;const res=response();await listener(req,res);assert.equal(res.status,400);assert.equal(reads,0);
 }
});
