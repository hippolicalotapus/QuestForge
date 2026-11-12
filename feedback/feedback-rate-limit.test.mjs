import test from 'node:test';
import assert from 'node:assert/strict';
import {createRateLimiter} from './feedback-rate-limit.mjs';
test('allows requests up to threshold and blocks excess',()=>{let time=0;const check=createRateLimiter({limit:2,windowMs:100,now:()=>time});assert.equal(check('a').allowed,true);assert.equal(check('a').allowed,true);assert.deepEqual(check('a'),{allowed:false,retryAfterMs:100});time=100;assert.equal(check('a').allowed,true)});
test('independent keys and malformed keys',()=>{const check=createRateLimiter({limit:1});assert.equal(check('a').allowed,true);assert.equal(check('b').allowed,true);assert.equal(check('a').allowed,false);assert.equal(check('').allowed,false)});
test('rejects unsafe configuration',()=>{assert.throws(()=>createRateLimiter({limit:0}),RangeError);assert.throws(()=>createRateLimiter({windowMs:0}),RangeError)});

test('stale buckets are pruned without changing active limits',()=>{
 let time=0;const check=createRateLimiter({limit:1,windowMs:100,now:()=>time});
 assert.equal(check('old').allowed,true);
 time=200;
 for(let i=0;i<99;i++)assert.equal(check('client-'+i).allowed,true);
 assert.equal(check('old').allowed,true);
 assert.equal(check('old').allowed,false);
});
