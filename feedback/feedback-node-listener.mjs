// Node HTTP adapter for local testing. Does not start a server or open a port.
// Do not trust X-Forwarded-For unless a separately verified proxy layer supplies identity.
import {createFeedbackHandler} from './feedback-handler.mjs';
function createNodeFeedbackListener({save, rateLimit, maxBytes=16_384}={}) {
  const handle=createFeedbackHandler({save,rateLimit,maxBytes});
  return async function listener(req,res) {
    const send=(status,body)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(body));};
    try {
      // Reject unsupported requests before reading their bodies.
      if(req.method!=='POST'){send(405,{ok:false,error:'Method not allowed'});return;}
      if(typeof req.headers?.['content-type']!=='string'||!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'])){send(415,{ok:false,error:'JSON required'});return;}
      if(typeof req.socket?.remoteAddress!=='string'||!req.socket.remoteAddress.trim()){send(400,{ok:false,error:'Missing request rate-limit identity'});return;}
      // Reject a declared oversized body before buffering any bytes. Stream limit remains authoritative.
      const declaredLength=req.headers?.['content-length'];
      if(declaredLength!==undefined){
        if(typeof declaredLength!=='string'||!/^(0|[1-9][0-9]*)$/.test(declaredLength)) {send(400,{ok:false,error:'Invalid Content-Length'});return;}
        if(BigInt(declaredLength)>BigInt(maxBytes)){send(413,{ok:false,error:'Request too large'});return;}
      }
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
