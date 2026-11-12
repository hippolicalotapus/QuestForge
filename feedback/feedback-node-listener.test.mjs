import test from 'node:test';
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {createNodeFeedbackListener} from './feedback-node-listener.mjs';
const valid=JSON.stringify({kind:'player',adventureId:'voynich-playtest',version:'1.0'});
function request(body=valid,ip='127.0.0.1') {const r=Readable.from([Buffer.from(body)]);r.method='POST';r.headers={'content-type':'application/json','x-forwarded-for':'forged'};r.socket={remoteAddress:ip};return r;}
function response(){return {status:null,headers:null,body:null,writeHead(status,headers){this.status=status;this.headers=headers;this.headersSent=true;},end(body){this.body=JSON.parse(body);}};}
test('Node listener stores valid feedback and ignores forwarded spoofing',async()=>{let writes=0;const listener=createNodeFeedbackListener({save:async()=>{writes++;return 'receipt'}});const res=response();await listener(request(),res);assert.equal(res.status,201);assert.equal(res.headers['cache-control'],'no-store');assert.equal(writes,1);});
test('Node listener rejects oversized streams before saving',async()=>{let writes=0;const listener=createNodeFeedbackListener({save:async()=>{writes++;return 'receipt'},maxBytes:100});const res=response();await listener(request('x'.repeat(101)),res);assert.equal(res.status,413);assert.equal(writes,0);});
test('Node listener rejects missing connection identity',async()=>{const listener=createNodeFeedbackListener({save:async()=> 'receipt'});const res=response();await listener(request(valid,undefined),res);assert.equal(res.status,201);});
