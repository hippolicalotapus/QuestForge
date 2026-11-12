import {createRateLimiter} from './feedback-rate-limit.mjs';
// Transport-independent HTTP-style feedback handler. No server or storage is started here.
import {createFeedbackIntake} from './feedback-intake.mjs';
function createFeedbackHandler({save, maxBytes = 16_384, rateLimit = createRateLimiter()} = {}) {
  if (typeof rateLimit !== 'function') throw new TypeError('Rate limiter must be a function');
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1 || maxBytes > 1_048_576) throw new RangeError('Invalid maximum request size');
  const submit = createFeedbackIntake({save});
  return async function handle(request = {}) {
    if (!request || typeof request !== 'object' || Array.isArray(request)) return {status:400,body:{ok:false,error:'Invalid request'}};
    const {method, contentType, body} = request;
    if (method !== 'POST') return {status:405, body:{ok:false,error:'Method not allowed'}};
    if (typeof contentType !== 'string' || !/^application\/json(?:\s*;|$)/i.test(contentType)) return {status:415,body:{ok:false,error:'JSON required'}};
    if (typeof body !== 'string' || Buffer.byteLength(body,'utf8') > maxBytes) return {status:413,body:{ok:false,error:'Request too large'}};
    const key = request.rateLimitKey;
    if (typeof key !== 'string' || !key.trim() || key.length > 256) return {status:400,body:{ok:false,error:'Missing request rate-limit identity'}};
    let quota;
    try { quota = await rateLimit(key); }
    catch { return {status:503,body:{ok:false,error:'Rate limiter unavailable'}}; }
    if (!quota || typeof quota.allowed !== 'boolean') return {status:503,body:{ok:false,error:'Rate limiter unavailable'}};
    if (!quota.allowed) return {status:429,body:{ok:false,error:'Too many requests'}};
    let parsed;
    try { parsed=JSON.parse(body); } catch { return {status:400,body:{ok:false,error:'Malformed JSON'}}; }
    const result=await submit(parsed);
    if (!result.ok) return {status:result.error.startsWith('Submission could not') || result.error.startsWith('Storage did not') ? 503 : 400,body:result};
    return {status:201,body:result};
  };
}
export {createFeedbackHandler};
