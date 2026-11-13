"use strict";
// Original, fictional level-one adventure release manifest validator.
// No payments, downloads, personal information or live feedback submissions.
const required=["id","title","level","version","pdfPath","playerFeedbackUrl","dmFeedbackUrl","rightsReviewed","mapsApproved","playtested"];
function validateRelease(m){
 const errors=[];
 if(!m||typeof m!=="object"||Array.isArray(m))return {ready:false,errors:["manifest"]};
 for(const key of required)if(!Object.hasOwn(m,key))errors.push("missing:"+key);
 if(m.level!==1)errors.push("level_one_only");
 if(typeof m.title!=="string"||!m.title.trim())errors.push("title");
 if(typeof m.id!=="string"||!/^[a-z0-9-]{3,60}$/.test(m.id))errors.push("id");
 if(typeof m.version!=="string"||!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(m.version))errors.push("version");
 if(typeof m.pdfPath!=="string"||!/^releases\/[a-z0-9-]+\.pdf$/.test(m.pdfPath))errors.push("pdf_path");
 for(const key of ["playerFeedbackUrl","dmFeedbackUrl"]){
  try{const url=new URL(m[key]);if(url.protocol!=="https:"||!url.hostname.includes("."))throw Error("not public https");}
  catch{errors.push(key);}
 }
 for(const key of ["rightsReviewed","mapsApproved","playtested"])if(m[key]!==true)errors.push(key);
 if(m.feedbackTested!==true)errors.push("feedback_not_tested");
 if(m.downloadVerified!==true)errors.push("download_not_verified");
 if(m.ownerApproved!==true)errors.push("owner_not_approved");
 return {ready:errors.length===0,errors};
}
module.exports={validateRelease};
