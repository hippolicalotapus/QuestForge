// Local, single-process prototype storage. NOT a production database or backup system.
// Never commit generated records, expose the file through a static web root, or log contact data.
import {open} from 'node:fs/promises';
import {constants} from 'node:fs';
import {randomUUID} from 'node:crypto';
function createLocalFeedbackStore({filePath}={}) {
  if(typeof filePath!=='string'||!filePath.trim()) throw new TypeError('A private feedback file path is required');
  return async function save({feedback,contact}) {
    const receipt=randomUUID();
    const line=JSON.stringify({receipt,receivedAt:new Date().toISOString(),feedback,contact})+'\\n';
    const flags=constants.O_WRONLY|constants.O_APPEND|constants.O_CREAT|(constants.O_NOFOLLOW||0);
    const file=await open(filePath,flags,0o600);
    try {
      const stat=await file.stat();
      if(!stat.isFile()||(stat.mode&0o077)!==0) throw new Error('Feedback file must be private');
      await file.writeFile(line,'utf8');
      await file.sync();
      return receipt;
    } finally {await file.close();}
  };
}
export {createLocalFeedbackStore};
