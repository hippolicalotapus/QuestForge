import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const s=readFileSync(new URL('../adventures/the-bell-that-rang-at-midnight.md',import.meta.url),'utf8');
test('one-hour free hook has four timed scenes and level one scope',()=>{for(const x of ['45–60 minutes','Level 1','Scene 1','Scene 2','Scene 3','Scene 4'])assert.ok(s.includes(x),x)});
test('free episode resolves its own problem and preserves paid continuity',()=>{for(const x of ['free episode\'s problem is solved','paid *Lantern Vault*','star token','No single failed check'])assert.ok(s.includes(x),x)});
test('unlaunched safety gates remain explicit',()=>{for(const x of ['not published','QR links must not be printed','owner approval','No live feedback, publication, transactions, or spending'])assert.ok(s.includes(x),x)});
