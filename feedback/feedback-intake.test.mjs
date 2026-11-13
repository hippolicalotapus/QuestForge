import test from 'node:test';
import assert from 'node:assert/strict';
import {createFeedbackIntake} from './feedback-intake.mjs';
const player={kind:'player',adventureId:'voynich-playtest',version:'1.0'};
test('requires explicit storage adapter',()=>assert.throws(()=>createFeedbackIntake(),TypeError));
test('rejects invalid submission without writing',async()=>{let writes=0;const submit=createFeedbackIntake({save:async()=>{writes++;return 'saved'}});assert.equal((await submit({...player,clarity:9})).ok,false);assert.equal(writes,0)});
test('anonymous feedback saves without contact',async()=>{let stored;const submit=createFeedbackIntake({save:async value=>{stored=value;return 'receipt-1'}});assert.deepEqual(await submit(player),{ok:true,receipt:'receipt-1'});assert.equal(stored.contact,null);assert.equal(stored.feedback.kind,'player')});
test('opt-in contact kept separate from feedback',async()=>{let stored;const submit=createFeedbackIntake({save:async value=>{stored=value;return 'receipt-2'}});assert.equal((await submit({...player,consentToContact:true,contact:'test@example.org'})).ok,true);assert.equal(stored.contact,'test@example.org');assert.equal('contact' in stored.feedback,false);assert.equal('consentToContact' in stored.feedback,false)});
test('failed and unconfirmed writes do not claim success',async()=>{const failed=createFeedbackIntake({save:async()=>{throw Error('offline')}});const unconfirmed=createFeedbackIntake({save:async()=>null});assert.equal((await failed(player)).ok,false);assert.equal((await unconfirmed(player)).ok,false)});
