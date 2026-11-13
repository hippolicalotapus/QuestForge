import {summarizePlaytestFeedback} from './feedback-summary.mjs';

/** Compare two private fictional playtest batches without exposing raw notes or contacts. */
export function comparePlaytestBatches(before,after,adventureId){
 const previous=summarizePlaytestFeedback(before,adventureId);
 const current=summarizePlaytestFeedback(after,adventureId);
 const ratings={};
 for(const key of new Set([...Object.keys(previous.ratings),...Object.keys(current.ratings)])){
  const old=previous.ratings[key],next=current.ratings[key];
  ratings[key]={previousResponses:old?.responses??0,currentResponses:next?.responses??0,previousMean:old?.mean??null,currentMean:next?.mean??null};
 }
 return {adventureId,previousResponses:previous.totalResponses,currentResponses:current.totalResponses,ratings,containsContactDetails:false};
}
