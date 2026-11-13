import {comparePlaytestBatches} from './feedback-comparison.mjs';

/** Offline review actions; ratings alone cannot approve an adventure for publication. */
export function playtestReviewActions(before,after,adventureId){
 const comparison=comparePlaytestBatches(before,after,adventureId);
 const actions=[];
 for(const [criterion,values] of Object.entries(comparison.ratings)){
  if(values.currentResponses===0)actions.push({criterion,action:'collect-feedback',requiresHumanReview:true});
  else if(values.previousResponses===0)actions.push({criterion,action:'establish-baseline',requiresHumanReview:true});
  else if(values.previousMean!==null&&values.currentMean<values.previousMean)actions.push({criterion,action:'review-decline',requiresHumanReview:true});
 }
 if(comparison.currentResponses===0)actions.push({criterion:'overall',action:'collect-feedback',requiresHumanReview:true});
 return {adventureId,actions,approvedForPublication:false,containsContactDetails:false};
}
