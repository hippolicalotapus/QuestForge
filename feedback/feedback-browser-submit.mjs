// Browser-side transport helper. No endpoint is configured by default.
// An explicit, same-origin endpoint is required before a form may submit.
function createFeedbackSubmitter({endpoint,fetchImpl=globalThis.fetch}={}) {
 if(typeof endpoint!=='string'||!endpoint.startsWith('/')||endpoint.startsWith('//')||endpoint.includes('#')||endpoint.includes('?')) throw new TypeError('An explicit same-origin path is required');
 if(typeof fetchImpl!=='function') throw new TypeError('fetch is required');
 return async function submitFeedback(payload){
  let response;
  try {response=await fetchImpl(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload),credentials:'same-origin'});}
  catch {return {ok:false,error:'Unable to reach the feedback service. Your feedback was not confirmed saved.'};}
  let body;
  try {body=await response.json();}
  catch {return {ok:false,error:'The feedback service returned an invalid response. Submission was not confirmed.'};}
  if(response.status===201 && body?.ok===true && typeof body.receipt==='string' && body.receipt.trim()) return {ok:true,receipt:body.receipt};
  return {ok:false,error:typeof body?.error==='string'?body.error:'Feedback was not confirmed saved.'};
 };
}
export {createFeedbackSubmitter};
