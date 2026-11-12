// Reusable form submission controller. Offline preview remains separate.
import {validateFeedback} from './feedback-validation.mjs';
import {createFeedbackSubmitter} from './feedback-browser-submit.mjs';
function createFeedbackFormController({endpoint,fetchImpl}={}) {
 const submit=createFeedbackSubmitter({endpoint,fetchImpl});
 return async function processFeedback(payload){
  const validation=validateFeedback(payload);
  if(!validation.ok) return {ok:false,error:validation.error,submitted:false};
  const result=await submit(payload);
  return {...result,submitted:result.ok};
 };
}
export {createFeedbackFormController};
