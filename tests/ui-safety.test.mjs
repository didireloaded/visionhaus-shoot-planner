import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
// Exercise the production renderer with hostile brief-derived question text.
const source=readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const escape=source.match(/^const esc=.*$/m)[0];
const render=source.match(/^function reviewFlags\(\).*$/m)[0];
const payload='<img src=x onerror="alert(1)"> & scope';
const context={state:{},reviewItems:()=>[payload],icon:()=>''};vm.createContext(context);
vm.runInContext(escape+'\n'+render+'\nresult=reviewFlags();',context);
assert.ok(!context.result.includes('<img'),'Brief text must not become executable HTML');
assert.ok(context.result.includes('&lt;img'));
assert.ok(context.result.includes('&amp; scope'));
console.log('Brief-derived review questions and unpriced scope render as text, not HTML.');
