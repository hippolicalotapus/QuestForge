// Shared, offline-safe validation for proposed QuestForge feedback submissions.
// Does not send, store, or log submissions.
const kinds = new Set(['player', 'dm']);
const ratings = ['clarity', 'pacing', 'challenge', 'enjoyment', 'encounterBalance', 'mapUsability'];
const notes = ['confusingPassages', 'accessibilityConcerns', 'suggestions', 'rulesAmbiguities', 'safetyConcerns', 'fixes'];
function validateFeedback(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {ok:false, error:'Invalid submission'};
  const {kind, adventureId, version, consentToContact = false, contact = ''} = input;
  if (!kinds.has(kind)) return {ok:false, error:'Invalid form type'};
  if (typeof adventureId !== 'string' || !/^[a-z0-9][a-z0-9_-]{1,79}$/i.test(adventureId)) return {ok:false, error:'Invalid adventure identifier'};
  if (typeof version !== 'string' || !/^[a-z0-9][a-z0-9._-]{0,31}$/i.test(version)) return {ok:false, error:'Invalid version'};
  if (typeof consentToContact !== 'boolean') return {ok:false, error:'Invalid consent'};
  if (typeof contact !== 'string' || contact.length > 254) return {ok:false, error:'Invalid contact'};
  if (contact && (!consentToContact || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact))) return {ok:false, error:'Contact requires consent and a valid email'};
  if (consentToContact && !contact) return {ok:false, error:'Contact email required for opt-in'};
  for (const field of ratings) if (input[field] !== undefined && (!Number.isInteger(input[field]) || input[field] < 1 || input[field] > 5)) return {ok:false, error:`Invalid ${field}`};
  for (const field of notes) if (input[field] !== undefined && (typeof input[field] !== 'string' || input[field].length > 2000)) return {ok:false, error:`Invalid ${field}`};
  if (kind === 'dm') {
    if (!Number.isInteger(input.partySize) || input.partySize < 1 || input.partySize > 30) return {ok:false, error:'Invalid party size'};
    if (!Number.isInteger(input.partyLevel) || input.partyLevel < 1 || input.partyLevel > 20) return {ok:false, error:'Invalid party level'};
  }
  return {ok:true};
}
export {validateFeedback};
