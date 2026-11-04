import assert from 'node:assert/strict';
import {planFromBrief} from '../public/brief.mjs';
import {startPackage,availableExtras,priceTotals,restore,change,initial} from '../public/domain.mjs';
let s=planFromBrief('An outdoor reel in Swakopmund, same-day edit please.','Video','',{name:'Example Client'});
assert.equal(s.project,'Social reel');assert.equal(s.variantId,'outdoor');assert.equal(s.name,'Example Client');assert.equal(s.location,'Swakopmund');assert.deepEqual(s.extras,['sameDay']);assert.equal(s.section,'shoot');assert.equal(priceTotals(s).gross,2490);
assert.equal(planFromBrief('Something interesting for our company','Video',''),null,'Ambiguous briefs require project selection');
s=planFromBrief('Something interesting for our company','Video','Interview');assert.equal(s.project,'Interview');
s=planFromBrief('Podcast with 3 cameras, 4 episodes, 6 hours','Video','');assert.equal(s.cameras,3);assert.equal(s.episodes,4);assert.equal(s.hours,6);
for(const [variant,price]of[['outdoor',600],['indoor',1000],['both',1500]])assert.equal(availableExtras(startPackage('reels',variant)).find(e=>e.id==='sameDay').price,price);
s=restore({...startPackage('reels','indoor'),extras:['rush','sameDay']});assert.deepEqual(s.extras,['sameDay'],'Expedited delivery fees never stack');
s=change(change(initial(),'service','Video'),'project','Interview');assert.equal(availableExtras(s).find(e=>e.id==='sameDay').price,1200);
console.log('Brief suggestions, ambiguous fallback, contact preservation, package selection, same-day prices, VAT and expedited-fee exclusivity passed.');
const {packages,projects,availableExtras:extrasFor,priceTotals:totals}=await import('../public/domain.mjs');
const {zohoEstimate}=await import('../worker/zoho.mjs');
const scenarios=packages.flatMap(p=>p.variants.map(v=>({...startPackage(p.id,v.id),episodes:3,extras:['sameDay','captions','graphics'],clipCount:4})));
for(const [service,list]of Object.entries(projects))for(const project of list)scenarios.push(restore({...change(change(initial(),'service',service),'project',project),extras:['sameDay','captions','retouch'],retouchCount:5}));
for(const state of scenarios){
 const quote=zohoEstimate('production',state,'internal brief','VH-Test-001','customer','vat');
 const amount=quote.line_items.reduce((n,l)=>n+l.rate*l.quantity,0);
 const gross=Math.round(amount*(quote.is_inclusive_tax?1:1.15)*100)/100;
 assert.equal(gross,totals(state).gross,state.project+' matches the client-facing total');
 for(const line of quote.line_items)assert.equal(Math.round(line.rate*100),line.rate*100,'Rates have no fractional cents');
}
console.log('All catalogue services and package variants preserve displayed gross totals in Zoho with two-decimal rates.');
