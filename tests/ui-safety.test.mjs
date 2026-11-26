import assert from 'node:assert/strict';
import { change, initial } from '../public/domain.mjs';
import { app } from '../public/ui/state.mjs';
import { esc } from '../public/ui/shared.mjs';
import { reviewFlags, custom } from '../public/ui/plan.mjs';
import { clearBrief } from '../public/ui/brief.mjs';
const payload = '<img src=x onerror="alert(1)"> & scope';
app.state = {
  ...change(change(initial(), 'service', 'Video'), 'project', 'Interview'),
  briefQuestions: [payload],
};
const result = reviewFlags();
assert.ok(!result.includes('<img'));
assert.ok(result.includes('&lt;img'));
assert.ok(result.includes('&amp; scope'));
assert.equal(esc(`'"<>`), '&#39;&quot;&lt;&gt;');
app.state = {
  ...initial(),
  name: 'Retained Client',
  notes: 'Old request',
  sourceBrief: 'Old source',
  briefQuoteRequired: true,
  briefQuestions: ['Old question'],
};
app.navigate = () => {};
custom('Video', 'Interview');
assert.equal(app.state.sourceBrief, '');
assert.equal(app.state.notes, '');
assert.equal(app.state.briefQuoteRequired, false);
assert.equal(app.state.name, 'Retained Client');
assert.match(app.state.requestToken, /^[a-f0-9]{32}$/);
Object.assign(app, {
  briefTextInput: 'Old summary',
  briefOriginal: 'Old PDF',
  briefAnalyzedText: 'Old summary',
  briefFile: 'old.pdf',
  briefAnalysis: {},
  briefError: '',
  briefChoice: 'Interview',
  briefProject: 'Video',
});
const storage = new Map();
globalThis.localStorage = { setItem: (k, v) => storage.set(k, v) };
clearBrief();
assert.equal(app.briefOriginal, '');
assert.equal(app.briefTextInput, '');
assert.equal(app.state.name, 'Retained Client');
assert.equal(JSON.parse(storage.get('vh-brief')).text, '');
delete globalThis.localStorage;
console.log(
  'Imported UI functions escape hostile scope, clear briefs and preserve contacts on a new plan.',
);
