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
  const result=await fetch(address+'/api/feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({kind:'player',adventureId:'voynich-playtest',version:'1.0'})});
  assert.equal(result.status,201);
  const body=await result.json();assert.equal(body.ok,true);assert.ok(body.receipt);
  const saved=JSON.parse((await readFile(join(dir,'feedback.jsonl'),'utf8')).trim());
  assert.equal(saved.receipt,body.receipt);
 } finally {child.kill();await rm(dir,{recursive:true,force:true});}
});
