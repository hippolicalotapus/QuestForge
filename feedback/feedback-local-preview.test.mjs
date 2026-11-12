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

test('local form prevents repeat submission while awaiting receipt',async()=>{
 const route=createLocalPreviewRouter({submit:()=>{}});
 const page=await request(route,'GET','/');
 assert.match(page.body,/if\(button\.disabled\)return/);
 assert.match(page.body,/button\.disabled=true/);
 assert.match(page.body,/finally \{button\.disabled=false;\}/);
});

test('local preview refuses to silently serve a broken form transformation',async()=>{
 const route=createLocalPreviewRouter({submit:()=>{}});
 const page=await request(route,'GET','/');
 assert.doesNotMatch(page.body,/Offline preview only/);
 assert.doesNotMatch(page.body,/Validate preview \(does not send\)/);
 assert.match(page.body,/async event=>/);
});

test('local form has async submit handler and no offline success message',async()=>{
 const route=createLocalPreviewRouter({submit:()=>{}});
 const page=await request(route,'GET','/');
 assert.match(page.body,/form\.addEventListener\('submit',async event=>/);
 assert.doesNotMatch(page.body,/Valid preview\. No information was saved or sent/);
 assert.match(page.body,/submitLocal\(data\)/);
});

test('local feedback endpoint rejects cross-origin browser requests',async()=>{
 let called=0;
 const route=createLocalPreviewRouter({submit:(_req,res)=>{called++;res.writeHead(201,{});res.end('ok');}});
 const req={method:'POST',url:'/api/feedback',headers:{host:'127.0.0.1:3000',origin:'https://example.test'}};
 const res={writeHead(code){this.status=code;},end(body){this.body=body;}};
 await route(req,res);
 assert.equal(res.status,403);assert.equal(called,0);
 req.headers.origin='http://127.0.0.1:3000';
 await route(req,res);
 assert.equal(res.status,201);assert.equal(called,1);
});

test('local preview rejects non-loopback Host headers',async()=>{
 let called=0;
 const route=createLocalPreviewRouter({submit:()=>{called++;}});
 const res={writeHead(code){this.status=code;},end(body){this.body=body;}};
 await route({method:'GET',url:'/',headers:{host:'attacker.example:3000'}},res);
 assert.equal(res.status,403);
 await route({method:'POST',url:'/api/feedback',headers:{host:'attacker.example:3000'}},res);
 assert.equal(res.status,403);assert.equal(called,0);
});

test('real HTTP-shaped requests without Host are rejected',async()=>{
 let called=0;
 const route=createLocalPreviewRouter({submit:()=>{called++;}});
 const res={writeHead(code){this.status=code;},end(body){this.body=body;}};
 await route({method:'POST',url:'/api/feedback',headers:{}},res);
 assert.equal(res.status,403);assert.equal(called,0);
});
