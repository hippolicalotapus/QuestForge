import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,stat,chmod,rm,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createLocalFeedbackStore} from './feedback-local-store.mjs';
test('local store appends separate private JSONL records and returns receipts',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'questforge-feedback-'));
 try {
  const path=join(dir,'private.jsonl');const save=createLocalFeedbackStore({filePath:path});
  const a=await save({feedback:{kind:'player'},contact:null});
  const b=await save({feedback:{kind:'dm'},contact:'opt-in@example.com'});
  assert.notEqual(a,b);
  const rows=(await readFile(path,'utf8')).trimEnd().split('\n').map(JSON.parse);
  assert.equal(rows.length,2);assert.equal(rows[0].receipt,a);assert.equal(rows[1].receipt,b);
  assert.equal(rows[1].contact,'opt-in@example.com');
  assert.equal((await stat(path)).mode&0o077,0);
 } finally {await rm(dir,{recursive:true,force:true});}
});
test('local store rejects files with permissions accessible to others',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'questforge-feedback-'));
 try {const path=join(dir,'private.jsonl');const save=createLocalFeedbackStore({filePath:path});await save({feedback:{kind:'player'},contact:null});await chmod(path,0o644);await assert.rejects(save({feedback:{kind:'player'},contact:null}),/private/);}
 finally {await rm(dir,{recursive:true,force:true});}
});
