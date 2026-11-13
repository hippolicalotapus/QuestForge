import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

// Exercises a real loopback HTTP request, not just mocked request/response streams.
test('local server accepts feedback over loopback HTTP and writes a receipt',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'questforge-http-'));
 const serverPath=fileURLToPath(new URL('./local-server.mjs',import.meta.url));
 const child=spawn(process.execPath,[serverPath],{env:{...process.env,QUESTFORGE_FEEDBACK_DIR:dir},stdio:['ignore','pipe','pipe']});
 let output='';
 try {
  const address=await new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(new Error('Local server startup timed out: '+output)),5000);
   child.stdout.on('data',chunk=>{
    output+=chunk.toString();
    const match=output.match(/http:\/\/127\.0\.0\.1:(\d+)/);
    if(match){clearTimeout(timeout);resolve('http://127.0.0.1:'+match[1]);}
   });
   child.once('error',err=>{clearTimeout(timeout);reject(err);});
   child.once('exit',code=>{clearTimeout(timeout);reject(new Error('Local server exited: '+code));});
  });
  const page=await fetch(address+'/');
  assert.equal(page.status,200);
  assert.match(page.headers.get('content-type'),/text\/html/);
  const html=await page.text();
  assert.match(html,/Submit local test feedback/);
  assert.match(html,/createFeedbackFormController/);
  for(const asset of ['/feedback-validation.mjs','/feedback-form-data.mjs','/feedback-form-controller.mjs','/feedback-browser-submit.mjs']) {
   const moduleResponse=await fetch(address+asset);
   assert.equal(moduleResponse.status,200,'module unavailable: '+asset);
   assert.match(moduleResponse.headers.get('content-type'),/javascript/);
  }
  assert.equal((await fetch(address+'/nonexistent')).status,404);
  const result=await fetch(address+'/api/feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({kind:'player',adventureId:'voynich-playtest',version:'1.0'})});
  assert.equal(result.status,201);
  const body=await result.json();assert.equal(body.ok,true);assert.ok(body.receipt);
  const saved=JSON.parse((await readFile(join(dir,'feedback.jsonl'),'utf8')).trim());
  assert.equal(saved.receipt,body.receipt);
  const dmPayload={kind:'dm',adventureId:'voynich-playtest',version:'1.0',partySize:4,partyLevel:1,consentToContact:true,contact:'synthetic@example.test'};
  const dmResponse=await fetch(address+'/api/feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(dmPayload)});
  assert.equal(dmResponse.status,201);
  const dmBody=await dmResponse.json();assert.equal(dmBody.ok,true);assert.ok(dmBody.receipt);
  const lines=(await readFile(join(dir,'feedback.jsonl'),'utf8')).trim().split('\n').map(JSON.parse);
  assert.equal(lines.length,2);
  assert.equal(lines[1].receipt,dmBody.receipt);
  assert.equal(lines[1].feedback.kind,'dm');
  assert.equal(lines[1].contact,'synthetic@example.test');
  const invalid=await fetch(address+'/api/feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...dmPayload,consentToContact:false})});
  assert.equal(invalid.status,400);
  assert.equal((await readFile(join(dir,'feedback.jsonl'),'utf8')).trim().split('\n').length,2);
 } finally {child.kill();await rm(dir,{recursive:true,force:true});}
});
