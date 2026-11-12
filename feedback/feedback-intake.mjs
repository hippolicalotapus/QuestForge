// Offline-only QuestForge feedback intake adapter. No network, disk or logging.
import {validateFeedback} from './feedback-validation.mjs';
function createFeedbackIntake({save} = {}) {
  if (typeof save !== 'function') throw new TypeError('A private storage adapter is required');
  return async function submitFeedback(input) {
    const validation = validateFeedback(input);
    if (!validation.ok) return {ok:false, error:validation.error};
    const record = Object.fromEntries(Object.entries(input).filter(([key]) => key !== 'contact' && key !== 'consentToContact'));
    const contact = input.consentToContact === true ? input.contact : null;
    try {
      const receipt = await save({feedback:record, contact});
      if (typeof receipt !== 'string' || !receipt.trim()) return {ok:false, error:'Storage did not confirm receipt'};
      return {ok:true, receipt};
    } catch {
      return {ok:false, error:'Submission could not be saved; please retry'};
    }
  };
}
export {createFeedbackIntake};
