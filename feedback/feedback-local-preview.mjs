// Loopback-only preview adapter. Never mount on a public server.
import {readFile} from 'node:fs/promises';
const assets=new Map([
 ['/feedback-validation.mjs','feedback-validation.mjs'],
 ['/feedback-form-data.mjs','feedback-form-data.mjs'],
 ['/feedback-form-controller.mjs','feedback-form-controller.mjs'],
 ['/feedback-browser-submit.mjs','feedback-browser-submit.mjs']
]);
function replaceRequired(source,original,replacement){
 if(!source.includes(original))throw new Error('Local preview template changed; refusing to serve an unverified form');
 return source.replace(original,replacement);
}
function createLocalPreviewRouter({submit}) {
 if(typeof submit!=='function')throw new TypeError('POST handler required');
 return async function route(req,res){
  const path=req.url?.split('?')[0];
  if(req.method==='POST' && path==='/api/feedback')return submit(req,res);
  if(req.method==='GET' && (path==='/' || assets.has(path))){
   const file=path==='/'?'index.html':assets.get(path);
   let body=await readFile(new URL('./'+file,import.meta.url),'utf8');
   if(path==='/'){
    body=replaceRequired(body,'Offline preview only.','Local-only submission preview.');
    body=replaceRequired(body,'No feedback is transmitted or saved. Do not print QR codes pointing here.','Feedback is saved only to your configured private local test directory. Use synthetic data; do not print QR codes pointing here.');
    body=replaceRequired(body,'Validate preview (does not send)','Submit local test feedback');
    body=replaceRequired(body,"import {validateFeedback} from './feedback-validation.mjs';","import {validateFeedback} from './feedback-validation.mjs';\nimport {createFeedbackFormController} from './feedback-form-controller.mjs';\nconst submitLocal=createFeedbackFormController({endpoint:'/api/feedback'});");
    body=body.replace("form.addEventListener('submit',event=>{","form.addEventListener('submit',async event=>{");
    body=body.replace("document.getElementById('result').textContent=result.ok?'Valid preview. No information was saved or sent.':result.error;","if(!result.ok){document.getElementById('result').textContent=result.error;return;}\n const status=document.getElementById('result');const button=form.querySelector('button[type=submit]');\n if(button.disabled)return;button.disabled=true;status.textContent='Submitting local test feedback...';\n try {const saved=await submitLocal(data);status.textContent=saved.ok?'Saved locally. Receipt: '+saved.receipt:saved.error;}\n finally {button.disabled=false;}");
   }
   res.writeHead(200,{'content-type':path==='/'?'text/html; charset=utf-8':'text/javascript; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(body);return;
  }
  res.writeHead(404,{'content-type':'text/plain; charset=utf-8','cache-control':'no-store'});res.end('Not found');
 };
}
export {createLocalPreviewRouter};
