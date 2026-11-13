// Shared payload extraction for the offline preview and future opt-in submission UI.
function collectFeedback(form) {
 const e=form.elements;
 const data={kind:e.kind.value,adventureId:e.adventureId.value,version:e.version.value,consentToContact:e.consentToContact.checked};
 if(e.consentToContact.checked && e.contact.value)data.contact=e.contact.value;
 if(e.clarity.value)data.clarity=Number(e.clarity.value);
 if(e.suggestions.value)data.suggestions=e.suggestions.value;
 if(e.accessibilityConcerns.value)data.accessibilityConcerns=e.accessibilityConcerns.value;
 if(data.kind==='dm'){
  data.partySize=Number(e.partySize.value);
  data.partyLevel=Number(e.partyLevel.value);
  if(e.encounterBalance.value)data.encounterBalance=Number(e.encounterBalance.value);
  if(e.rulesAmbiguities.value)data.rulesAmbiguities=e.rulesAmbiguities.value;
 }
 return data;
}
export {collectFeedback};
