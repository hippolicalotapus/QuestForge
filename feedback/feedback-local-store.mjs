// Local, single-process prototype storage. NOT a production database or backup system.
// Never commit generated records, expose the file through a static web root, or log contact data.
import {open,realpath,stat as pathStat} from 'node:fs/promises';
import {constants} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {resolve,relative,dirname} from 'node:path';
function createLocalFeedbackStore({filePath,privateDirectory}={}) {
  if(typeof filePath!=='string'||!filePath.trim()) throw new TypeError('A private feedback file path is required');
  if(typeof privateDirectory!=='string'||!privateDirectory.trim()) throw new TypeError('A private storage directory is required');
  const root=resolve(privateDirectory), target=resolve(filePath), subpath=relative(root,target);
  if(!subpath||subpath==='..'||subpath.startsWith('../')||subpath.startsWith('..\\\\')||subpath.startsWith('/') ) throw new Error('Feedback file must be inside private directory');
  return async function save({feedback,contact}) {
    // Resolve the directory chain at write time to prevent symlink escapes.
    const actualRoot=await realpath(root);
    const actualParent=await realpath(dirname(target));
    const actualRelative=relative(actualRoot,actualParent);
    if(actualRelative==='..'||actualRelative.startsWith('../')||actualRelative.startsWith('..\\\\')||actualRelative.startsWith('/')) throw new Error('Feedback directory escapes private root');
    const rootInfo=await pathStat(actualRoot);
    if(!rootInfo.isDirectory()||(rootInfo.mode&0o077)!==0) throw new Error('Feedback directory must be private');
    const receipt=randomUUID();
    const line=JSON.stringify({receipt,receivedAt:new Date().toISOString(),feedback,contact})+'\n';
    const flags=constants.O_WRONLY|constants.O_APPEND|constants.O_CREAT|(constants.O_NOFOLLOW||0);
    const file=await open(target,flags,0o600);
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
