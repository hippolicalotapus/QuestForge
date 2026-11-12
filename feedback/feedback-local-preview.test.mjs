import test from 'node:test';
import assert from 'node:assert/strict';
import {createLocalPreviewRouter} from './feedback-local-preview.mjs';
async function request(route,method,url){const req={method,url};const res={status:0,headers:{},writeHead(code,headers){this.status=code;this.headers=headers;},end(body){this.body=body;}};await route(req,res);return res;}
test('local preview serves wired form without changing offline source',async()=>{
 const route=createLocalPreviewRouter({submit:()=>{throw Error('unexpected POST')}});
 const res=await request(route,'GET','/');
 assert.equal(res.status,200);assert.match(res.body,/Submit local test feedback/);assert.match(res.body,/createFeedbackFormController/);assert.match(res.body,/Saved locally/);
});
test('local preview serves required modules but rejects unknown paths',async()=>{
 const route=createLocalPreviewRouter({submit:()=>{}});
 assert.equal((await request(route,'GET','/feedback-form-data.mjs')).status,200);
 assert.equal((await request(route,'GET','/../../etc/passwd')).status,404);
});
test('local preview routes POST only to feedback endpoint',async()=>{
 let called=0;const route=createLocalPreviewRouter({submit:(_req,res)=>{called++;res.writeHead(201,{});res.end('ok');}});
 assert.equal((await request(route,'POST','/api/feedback')).status,201);assert.equal(called,1);
 assert.equal((await request(route,'POST','/')).status,404);
});
