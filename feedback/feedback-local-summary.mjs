// Private local review utility. Never sends feedback or prints contact fields.
import {readFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {summarizePlaytestFeedback} from './feedback-summary.mjs';

export async function summarizeLocalFeedback({filePath,adventureId}) {
 if(typeof filePath!=='string'||!filePath.startsWith('/')) throw new Error('Absolute private feedback file required');
 const info=await stat(filePath);
 if(!info.isFile()||(info.mode&0o077)!==0) throw new Error('Feedback file must have private permissions');
 const raw=await readFile(filePath,'utf8');
 if(raw.length>5_000_000) throw new Error('Feedback file too large for local summary');
 const records=raw.split('\n').filter(Boolean).map(line=>{
  const row=JSON.parse(line);
  if(!row||typeof row!=='object'||!row.feedback)throw new Error('Invalid stored feedback');
  return row.feedback;
 });
 return summarizePlaytestFeedback(records,adventureId);
}
if(process.argv[1]&&import.meta.url===new URL('file://'+resolve(process.argv[1])).href){
 const [filePath,adventureId]=process.argv.slice(2);
 try{console.log(JSON.stringify(await summarizeLocalFeedback({filePath,adventureId}),null,2));}
 catch(error){console.error('Local feedback summary failed: '+error.message);process.exitCode=1;}
}
