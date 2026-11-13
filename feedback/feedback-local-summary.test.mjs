import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,chmod,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {summarizeLocalFeedback} from './feedback-local-summary.mjs';

test('local private JSONL feedback produces redacted summary',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'questforge-summary-'));
 try{
  const file=join(dir,'feedback.jsonl');
  await writeFile(file,JSON.stringify({receipt:'fictional',contact:'secret@example.org',feedback:{kind:'player',adventureId:'voynich-playtest',version:'v1',clarity:5}})+'\n',{mode:0o600});
  const result=await summarizeLocalFeedback({filePath:file,adventureId:'voynich-playtest'});
  assert.equal(result.totalResponses,1);
  assert.doesNotMatch(JSON.stringify(result),/secret@example.org/);
  await chmod(file,0o644);
  await assert.rejects(summarizeLocalFeedback({filePath:file,adventureId:'voynich-playtest'}),/private permissions/);
 }finally{await rm(dir,{recursive:true,force:true});}
});
