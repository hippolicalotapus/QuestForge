// Local-only composition of the feedback HTTP listener and private storage.
// Does not start a server, expose a public endpoint, or deploy anything.
import {createNodeFeedbackListener} from './feedback-node-listener.mjs';
import {createLocalFeedbackStore} from './feedback-local-store.mjs';
function createLocalFeedbackService({filePath,privateDirectory,rateLimit,maxBytes}={}) {
  const save=createLocalFeedbackStore({filePath,privateDirectory});
  return createNodeFeedbackListener({save,rateLimit,maxBytes});
}
export {createLocalFeedbackService};
