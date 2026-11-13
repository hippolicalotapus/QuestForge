// Explicitly local-only feedback test server. Never expose to a public interface.
// Run with: QUESTFORGE_FEEDBACK_DIR=/absolute/private/path node feedback/local-server.mjs
import {createServer} from 'node:http';
import {mkdir,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createLocalFeedbackService} from './feedback-local-service.mjs';
import {createLocalPreviewRouter} from './feedback-local-preview.mjs';
const configured=process.env.QUESTFORGE_FEEDBACK_DIR;
if (!configured || !configured.startsWith('/')) throw new Error('Set QUESTFORGE_FEEDBACK_DIR to an absolute private directory');
const directory=resolve(configured);
await mkdir(directory,{recursive:true,mode:0o700});
const info=await stat(directory);
if (!info.isDirectory() || (info.mode & 0o077)!==0) throw new Error('Feedback directory must have private permissions');
const listener=createLocalFeedbackService({privateDirectory:directory,filePath:join(directory,'feedback.jsonl')});
const server=createServer(createLocalPreviewRouter({submit:listener}));
server.listen(0,'127.0.0.1',()=>{
 const address=server.address();
 console.log('QuestForge local feedback test server on http://127.0.0.1:'+address.port+' (local HTML preview and POST JSON; no public access)');
});
