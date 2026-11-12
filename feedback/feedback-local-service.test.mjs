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
