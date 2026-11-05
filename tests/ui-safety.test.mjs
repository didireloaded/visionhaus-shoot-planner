import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {initial,change} from '../public/domain.mjs';
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

const custom=source.match(/^function custom\(.*$/m)[0];
const fresh={initial,change,newRequestToken:()=> 'f'.repeat(32),navigate:()=>{},state:{...initial(),name:'Retained Client',notes:'Old request',sourceBrief:'Old source',briefQuoteRequired:true,briefQuestions:['Old question']}};vm.createContext(fresh);vm.runInContext(custom+";custom('Video','Interview');",fresh);
assert.equal(fresh.state.sourceBrief,'');assert.equal(fresh.state.notes,'');assert.equal(fresh.state.briefQuoteRequired,false);assert.equal(fresh.state.name,'Retained Client');assert.equal(fresh.state.requestToken,'f'.repeat(32));
