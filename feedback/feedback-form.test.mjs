import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
test('preview declares offline-only behavior and no submission endpoint',()=>{
  assert.match(html,/Offline preview only/);
  assert.match(html,/does not send/i);
  assert.doesNotMatch(html,/<form[^>]*action=/i);
  assert.doesNotMatch(html,/\bfetch\s*\(/);
});
test('player and DM controls have labels and mobile viewport',()=>{
  assert.match(html,/<meta name="viewport"/);
  for(const id of ['kind','adventureId','version','clarity','suggestions','partySize','partyLevel','consentToContact','contact']){
    assert.ok(html.includes('for="'+id+'"'),'missing label '+id);
    assert.ok(html.includes('id="'+id+'"'),'missing control '+id);
  }
  assert.match(html,/id="dmFields" hidden/);
  assert.match(html,/role="status" aria-live="polite"/);
});
test('form imports shared validation and does not claim receipt',()=>{
  assert.match(html,/import \{validateFeedback\} from '\.\/feedback-validation\.mjs'/);
  assert.match(html,/validateFeedback\(data\)/);
  assert.match(html,/No information was saved or sent/);
});

test('accessibility and DM review fields remain present',()=>{
  for(const id of ['accessibilityConcerns','encounterBalance','rulesAmbiguities']) {
    assert.ok(html.includes('for="'+id+'"'),'missing label '+id);
    assert.ok(html.includes('id="'+id+'"'),'missing field '+id);
  }
  assert.match(html,/if\(role\.value==='dm'\)/);
  assert.match(html,/data\.accessibilityConcerns/);
  assert.match(html,/data\.encounterBalance/);
  assert.match(html,/data\.rulesAmbiguities/);
});
