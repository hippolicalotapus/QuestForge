import test from 'node:test';
import assert from 'node:assert/strict';
import {collectFeedback} from './feedback-form-data.mjs';
function form(kind='player',consent=false){const field=value=>({value});return {elements:{kind:field(kind),adventureId:field('voynich-playtest'),version:field('1.0'),consentToContact:{checked:consent},contact:field('player@example.com'),clarity:field('4'),suggestions:field('Fun'),accessibilityConcerns:field(''),partySize:field('4'),partyLevel:field('1'),encounterBalance:field('3'),rulesAmbiguities:field('')}};}
test('player payload excludes DM fields and unconsented contact',()=>{const data=collectFeedback(form());assert.equal(data.kind,'player');assert.equal(data.clarity,4);assert.equal(Object.hasOwn(data,'contact'),false);assert.equal(Object.hasOwn(data,'partySize'),false);});
test('DM payload includes session fields and opted-in contact',()=>{const data=collectFeedback(form('dm',true));assert.equal(data.partySize,4);assert.equal(data.partyLevel,1);assert.equal(data.encounterBalance,3);assert.equal(data.contact,'player@example.com');});
