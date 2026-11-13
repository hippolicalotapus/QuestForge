import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Readable} from 'node:stream';
import {createLocalFeedbackService} from './feedback-local-service.mjs';
function request(payload){const req=Readable.from([Buffer.from(JSON.stringify(payload))]);req.method='POST';req.headers={'content-type':'application/json'};req.socket={remoteAddress:'127.0.0.1'};return req;}
function response(){return {headersSent:false,writeHead(status){this.status=status;this.headersSent=true;},end(body){this.body=JSON.parse(body);}};}
test('local feedback service validates, saves and returns a receipt without opening a server',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'questforge-service-'));
 try {
  const filePath=join(dir,'feedback.jsonl');
  const listener=createLocalFeedbackService({filePath,privateDirectory:dir});
  const res=response();await listener(request({kind:'player',adventureId:'voynich-playtest',version:'1.0'}),res);
  assert.equal(res.status,201);assert.equal(res.body.ok,true);assert.ok(res.body.receipt);
  const saved=JSON.parse((await readFile(filePath,'utf8')).trim());
  assert.equal(saved.receipt,res.body.receipt);assert.equal(saved.feedback.kind,'player');assert.equal(saved.contact,null);
 } finally {await rm(dir,{recursive:true,force:true});}
});

test('local feedback service rejects invalid data without creating a record',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'questforge-service-'));
 try {
  const filePath=join(dir,'feedback.jsonl');
  const listener=createLocalFeedbackService({filePath,privateDirectory:dir});
  const res=response();await listener(request({kind:'player',adventureId:'voynich-playtest',version:'1.0',partySize:4}),res);
  assert.equal(res.status,400);assert.equal(res.body.ok,false);
  await assert.rejects(readFile(filePath,'utf8'),{code:'ENOENT'});
 } finally {await rm(dir,{recursive:true,force:true});}
});
test('local feedback service saves opted-in DM contact separately from feedback',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'questforge-service-'));
 try {
  const filePath=join(dir,'feedback.jsonl');
  const listener=createLocalFeedbackService({filePath,privateDirectory:dir});
  const res=response();await listener(request({kind:'dm',adventureId:'voynich-playtest',version:'1.0',partySize:4,partyLevel:1,consentToContact:true,contact:'dm@example.com'}),res);
  assert.equal(res.status,201);
  const saved=JSON.parse((await readFile(filePath,'utf8')).trim());
  assert.equal(saved.feedback.kind,'dm');assert.equal(saved.contact,'dm@example.com');
  assert.equal(Object.hasOwn(saved.feedback,'contact'),false);
 } finally {await rm(dir,{recursive:true,force:true});}
});

test('local feedback service returns 429 and preserves one saved record when quota is exceeded',async()=>{
 const {createRateLimiter}=await import('./feedback-rate-limit.mjs');
 const dir=await mkdtemp(join(tmpdir(),'questforge-service-'));
 try {
  const filePath=join(dir,'feedback.jsonl');
  const listener=createLocalFeedbackService({filePath,privateDirectory:dir,rateLimit:createRateLimiter({limit:1,windowMs:60_000,now:()=>100})});
  const payload={kind:'player',adventureId:'voynich-playtest',version:'1.0'};
  const first=response();await listener(request(payload),first);assert.equal(first.status,201);
  const second=response();await listener(request(payload),second);assert.equal(second.status,429);
  assert.equal((await readFile(filePath,'utf8')).trim().split('\n').length,1);
 } finally {await rm(dir,{recursive:true,force:true});}
});

test('local service reports unavailable storage without issuing a false receipt',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'questforge-service-'));
 try {
  const missing=join(dir,'missing');
  const listener=createLocalFeedbackService({filePath:join(missing,'feedback.jsonl'),privateDirectory:missing});
  const res=response();await listener(request({kind:'player',adventureId:'voynich-playtest',version:'1.0'}),res);
  assert.equal(res.status,503);assert.equal(res.body.ok,false);
  assert.equal(Object.hasOwn(res.body,'receipt'),false);
 } finally {await rm(dir,{recursive:true,force:true});}
});

test('local service never persists contact when consent is absent',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'questforge-service-'));
 try {
  const filePath=join(dir,'feedback.jsonl');
  const listener=createLocalFeedbackService({filePath,privateDirectory:dir});
  const res=response();await listener(request({kind:'player',adventureId:'voynich-playtest',version:'1.0',contact:'unconsented@example.com'}),res);
  assert.equal(res.status,400);
  await assert.rejects(readFile(filePath,'utf8'),{code:'ENOENT'});
 } finally {await rm(dir,{recursive:true,force:true});}
});
