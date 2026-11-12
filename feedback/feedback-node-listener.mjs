// Node HTTP adapter for local testing. Does not start a server or open a port.
// Do not trust X-Forwarded-For unless a separately verified proxy layer supplies identity.
import {createFeedbackHandler} from './feedback-handler.mjs';
function createNodeFeedbackListener({save, rateLimit, maxBytes=16_384}={}) {
  const handle=createFeedbackHandler({save,rateLimit,maxBytes});
  return async function listener(req,res) {
    const send=(status,body)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(body));};
    try {
      const chunks=[];let size=0;
      for await (const chunk of req) {
        size+=Buffer.byteLength(chunk);
        if(size>maxBytes){send(413,{ok:false,error:'Request too large'});return;}
        chunks.push(chunk);
      }
      const identity=req.socket?.remoteAddress;
      const result=await handle({method:req.method,contentType:req.headers?.['content-type'],body:Buffer.concat(chunks).toString('utf8'),rateLimitKey:identity});
      send(result.status,result.body);
    } catch {
      if(!res.headersSent)send(500,{ok:false,error:'Request handling failed'});
    }
  };
}
export {createNodeFeedbackListener};
