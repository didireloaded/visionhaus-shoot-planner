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

const clear=source.match(/^function clearBrief\(.*$/m)[0];const savedBrief={briefTextInput:'Old summary',briefOriginal:'Old PDF',briefAnalyzedText:'Old summary',briefFile:'old.pdf',briefAnalysis:{},briefError:'',briefChoice:'Interview',briefProject:'Video',persistBrief:()=>{},state:{name:'Keep Contact'}};vm.createContext(savedBrief);vm.runInContext(clear+';clearBrief();',savedBrief);assert.equal(savedBrief.briefOriginal,'');assert.equal(savedBrief.briefTextInput,'');assert.equal(savedBrief.state.name,'Keep Contact');

// Receipt metadata belongs to device storage, never trusted quote/pricing state.
const storage=new Map();
const receiptContext={DRAFT:'draft',persistedValues:new Map(),localStorage:{setItem:(k,v)=>storage.set(k,v)},state:{...initial(),complete:true},rental:{},rentalPrepared:true,productionReference:'VH-Client-001',rentalReference:'VH-Rental-002',saved:[]};
vm.createContext(receiptContext);
const persist=source.slice(source.indexOf('function persist(){'),source.indexOf('const reducedMotion='));
vm.runInContext(persist+';persist();',receiptContext);
assert.equal(JSON.parse(storage.get('draft')).submitted,true);
assert.equal(JSON.parse(storage.get('draft')).reference,'VH-Client-001');
assert.equal(JSON.parse(storage.get('vh-rental-draft')).reference,'VH-Rental-002');
receiptContext.localStorage={getItem:k=>k==='vh-configurator-v3'?storage.get('draft'):null};receiptContext.restore=raw=>({...initial(),name:raw.name});
vm.runInContext(source.match(/^try\{const d=JSON.parse\(localStorage.getItem\(DRAFT\)\).*$/m)[0].replace('DRAFT',"'vh-configurator-v3'"),receiptContext);
assert.equal(receiptContext.state.complete,true);
assert.equal(receiptContext.productionReference,'VH-Client-001');
const newRequestHandler=source.match(/^ if\(\$\('#edit-plan'\)\).*$/m)[0];
let startAction;
const restart={...fresh,$:()=>({set onclick(fn){startAction=fn}}),productionReference:'VH-Client-001',submissionError:'',clearBrief:()=>{restart.briefCleared=true}};
vm.createContext(restart);vm.runInContext(custom+'\n'+newRequestHandler,restart);startAction();
assert.equal(restart.state.name,'Retained Client');assert.equal(restart.state.project,'');assert.deepEqual(Array.from(restart.state.extras),[]);assert.equal(restart.state.sourceBrief,'');assert.equal(restart.productionReference,'');assert.equal(restart.briefCleared,true);
console.log('Completed requests retain receipts on reload; a new request clears scope and keeps contact details.');
