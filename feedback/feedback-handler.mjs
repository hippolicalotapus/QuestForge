// Transport-independent HTTP-style feedback handler. No server or storage is started here.
import {createFeedbackIntake} from './feedback-intake.mjs';
function createFeedbackHandler({save, maxBytes = 16_384} = {}) {
  const submit = createFeedbackIntake({save});
  return async function handle({method, contentType, body} = {}) {
    if (method !== 'POST') return {status:405, body:{ok:false,error:'Method not allowed'}};
    if (typeof contentType !== 'string' || !/^application\/json(?:\s*;|$)/i.test(contentType)) return {status:415,body:{ok:false,error:'JSON required'}};
    if (typeof body !== 'string' || Buffer.byteLength(body,'utf8') > maxBytes) return {status:413,body:{ok:false,error:'Request too large'}};
    let parsed;
    try { parsed=JSON.parse(body); } catch { return {status:400,body:{ok:false,error:'Malformed JSON'}}; }
    const result=await submit(parsed);
    if (!result.ok) return {status:result.error.startsWith('Submission could not') || result.error.startsWith('Storage did not') ? 503 : 400,body:result};
    return {status:201,body:result};
  };
}
export {createFeedbackHandler};
