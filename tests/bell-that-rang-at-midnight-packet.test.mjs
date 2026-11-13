import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const p=readFileSync(new URL('../adventures/the-bell-that-rang-at-midnight-dm-packet.md',import.meta.url),'utf8');
test('packet defines four timed scenes and fallback pacing',()=>{for(const x of ['0–12 min','12–25 min','25–45 min','45–60 min','Slow group','Fast group'])assert.ok(p.includes(x),x)});
test('original maps require player and DM variants',()=>{for(const x of ['Player map','Dungeon Master map','VTT-friendly','not yet drawn','usage rights'])assert.ok(p.includes(x),x)});
test('paid continuity avoids repeated crisis',()=>{for(const x of ['skip the paid adventure\'s initial Darkened Square crisis','Starward Steps','without this free episode','second brass star'])assert.ok(p.includes(x),x)});
test('release and feedback gates remain closed',()=>{for(const x of ['not implemented or verified','No deployment, publication, spending or live transactions','owner approval'])assert.ok(p.includes(x),x)});
