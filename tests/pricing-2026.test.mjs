import assert from 'node:assert/strict';
import {initial,change,restore,startPackage,priceLines,total,priceTotals,taxLabel,quoteOnly,retainers,reviewItems,briefText} from '../public/domain.mjs';
import {zohoEstimate} from '../worker/zoho.mjs';
const plan=(service,project,fields={})=>restore({...change(change(initial(),'service',service),'project',project),...fields});
for(const [project,indoor,outdoor] of [['Birthday reel',2500,1800],['Product video',3500,2000]]){
 for(const [shootStyle,amount] of [['Indoor',indoor],['Outdoor',outdoor]]){const s=plan('Video',project,{shootStyle});assert.equal(total(s),amount);assert.equal(priceTotals(s).gross,Math.round(amount*115)/100);assert.equal(taxLabel(s),'Ex VAT')}
 assert.equal(quoteOnly(plan('Video',project,{shootStyle:'Both'})),true,'No invented indoor/outdoor combination rate');
}
for(const [project,amount] of [['Documentary',20000],['Tourism & hospitality film',9000],['Livestreaming',25000],['Interview',4500],['Testimonial',3500],['Conference',15000],['Wedding film',25000],['Property video',5500]])assert.equal(total(plan('Video',project)),amount,project);
for(const project of ['Property photography','Fashion photography'])assert.equal(total(plan('Photo',project,{hours:6})),12000);
for(const [project,amount]of[['Event coverage',30000],['Brand content',10000],['Conference',30000]]){const s=plan('Photo + video',project);assert.equal(total(s),amount);assert.equal(priceLines(s).length,2,'Separate photo and video components')}
for(const [project,once]of[['Colour grading',12000],['Sound cleanup & mixing',5000]]){assert.equal(total(plan('Editing',project)),once);assert.equal(total(plan('Editing',project,{finishingFormat:'series',episodes:4})),28000)}
assert.equal(total(plan('Editing','Photo editing & retouching')),1800);
assert.equal(total(plan('Editing','Photo editing & retouching',{extras:['retouch'],retouchCount:3})),2550);
let s=plan('Video','Conference',{extras:['clips','captions','rush','graphics'],clipCount:4});
assert.equal(total(s),15000+8000+1800+2000+1800);assert.ok(!reviewItems(s).includes('Captions'));
assert.equal(total(plan('Photo','Fashion photography',{hours:2,extras:['retouch'],retouchCount:5})),5250);
for(const key of ['extraLighting','extraSound','extraPhotographer','liveEdits','gimbal','drone','teleprompter']){
 const s=plan('Video','Interview',{[key]:true});assert.equal(total(s),4500+1800,key);
}
assert.equal(total(plan('Video','Interview',{cameras:3})),4500+3600);
s=plan('Video','Podcast',{people:4});assert.equal(total(s),12640);
for(const r of retainers){s=plan('Video','Monthly content',{retainerTier:r.id});assert.equal(total(s),r.price);assert.equal(priceTotals(s).gross,Math.round(r.price*115)/100);assert.match(briefText(s),new RegExp(`${r.hours} production hours per month`));assert.ok(reviewItems(s).some(t=>t.includes('not cumulative')))}
s=plan('Video','Monthly content',{retainerTier:'bad',extras:['captions'],drone:true});assert.equal(total(s),10000);assert.deepEqual(s.extras,[]);assert.equal(s.drone,false);
s=restore({...plan('Video','Conference'),clipCount:1000000,retouchCount:-1,finishingFormat:'<script>'});assert.equal(s.clipCount,3);assert.equal(s.retouchCount,1);assert.equal(s.finishingFormat,'once');
s={...startPackage('reels','outdoor'),extras:['captions']};assert.equal(total(s),3870);assert.deepEqual(priceTotals(s),{net:3365.22,vat:504.78,gross:3870});
let quote=zohoEstimate('production',s,'Brief','VH-TEST','customer','vat15');assert.equal(quote.is_inclusive_tax,false);assert.ok(quote.line_items.every(l=>l.tax_id==='vat15'));assert.equal(quote.line_items[0].rate,1565.217391);assert.equal(quote.line_items[1].rate,1800);
s=startPackage('reels','outdoor');quote=zohoEstimate('production',s,'Brief','VH-TEST','customer','vat15');assert.equal(quote.is_inclusive_tax,true);assert.equal(quote.line_items[0].rate,1800);assert.equal(total(s),1800,'Previously approved tax-inclusive base is unchanged');
s=plan('Video','Event coverage',{eventOutput:'full',extras:['captions']});assert.equal(quoteOnly(s),true);quote=zohoEstimate('production',s,'Brief','VH-TEST','customer','vat15');assert.match(quote.line_items[0].description,/price to be agreed/);assert.equal(quote.line_items[1].rate,1800,'Known extras do not hide an unpriced core service');
assert.equal(total(startPackage('event','standard')),12500);assert.equal(total(startPackage('event','premium')),24500,'Included live editing and drone are not charged twice');
console.log('29 October owner pricing: service/style/hour/episode calculations, combined services, setup extras, quantities, retainers, VAT/mixed tax, input restoration, package preservation and unresolved scopes passed.');
