import {validateFeedback} from './feedback-validation.mjs';

/** Offline, privacy-minimal playtest summary. Never exports contact or free-text notes. */
export function summarizePlaytestFeedback(records, adventureId) {
 if(!Array.isArray(records) || records.length>10000) throw new TypeError('Invalid feedback batch');
 if(typeof adventureId!=='string'||!adventureId.trim()) throw new TypeError('Adventure ID required');
 const totals={player:0,dm:0};
 const ratings={};
 for(const record of records){
  const check=validateFeedback(record);
  if(!check.ok) throw new Error('Invalid feedback record: '+check.error);
  if(record.adventureId!==adventureId) continue;
  totals[record.kind]++;
  for(const key of ['clarity','pacing','challenge','enjoyment','encounterBalance','mapUsability']){
   if(record[key]===undefined) continue;
   const slot=ratings[key]??={count:0,sum:0};
   slot.count++;slot.sum+=record[key];
  }
 }
 const averages=Object.fromEntries(Object.entries(ratings).map(([key,{count,sum}])=>[key,{responses:count,mean:Math.round(sum/count*100)/100}]));
 return {adventureId,totalResponses:totals.player+totals.dm,byRole:totals,ratings:averages,containsContactDetails:false};
}
