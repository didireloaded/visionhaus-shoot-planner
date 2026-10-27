import assert from 'node:assert/strict';
import {rentalItems,rentalInitial,setRentalQty,includedBy,rentalDays,rentalUnits,rentalErrors,rentalLines,rentalTotal,restoreRental,rentalBrief} from '../dist/rentals.mjs';
import {initial,change,priceLines,quoteOnly} from '../dist/domain.mjs';
assert.equal(rentalItems.length,20);
let s=rentalInitial();s=setRentalQty(s,'fx3',9);assert.equal(s.items.fx3,1);
s=setRentalQty(s,'sigma24',1);s=setRentalQty(s,'tripod',1);s=setRentalQty(s,'bundle',1);assert.deepEqual(s.items,{bundle:1});assert.equal(includedBy(s,'fx3'),'bundle');s=setRentalQty(s,'fx3',1);assert.deepEqual(s.items,{bundle:1});
s={...s,start:'2026-11-01',end:'2026-11-02'};assert.equal(rentalDays(s),2);assert.equal(rentalTotal(s),9600);assert.equal(rentalErrors(s,'2026-10-27').length,0);
s.period='half';assert.ok(rentalErrors(s).some(x=>x.includes('same date')));s.end=s.start;assert.equal(rentalTotal(s),3400);
s.period='week';assert.ok(rentalErrors(s).some(x=>x.includes('5–7')));s.end='2026-11-07';assert.equal(rentalTotal(s),14500);s.end='2026-11-08';assert.equal(rentalUnits(s),2);assert.equal(rentalTotal(s),29000);
s=setRentalQty(s,'bundle',0);assert.equal(includedBy(s,'fx3'),'');s=setRentalQty(s,'gopro',5);s=setRentalQty(s,'gopros',1);assert.deepEqual(s.items,{gopros:1});s=setRentalQty(s,'dome',2);s=setRentalQty(s,'modifiers',1);assert.equal(s.items.dome,undefined);assert.equal(includedBy(s,'dome'),'modifiers');
s.fulfilment='Delivery';assert.ok(rentalErrors(s).some(x=>x.includes('address')));s.address='Swakopmund';assert.ok(!rentalErrors(s).some(x=>x.includes('address')));
const restored=restoreRental({...s,items:{fx3:999,bundle:1,gopro:999,gopros:1,unknown:3},period:'garbage'});assert.equal(restored.period,'day');assert.deepEqual(restored.items,{bundle:1,gopros:1});assert.ok(!rentalLines(restored).some(x=>x.id==='fx3'));
assert.match(rentalBrief({...s,name:'Test',email:'test@example.com'}),/not a confirmed reservation/);assert.match(rentalBrief(s),/deposit and insurance excluded/);
assert.ok(rentalErrors({...s,start:'2026-01-01'},'2026-10-27').some(x=>x.includes('later start')));assert.equal(rentalDays({...s,start:'2026-11-10',end:'2026-11-01'}),0);
for(const project of ['Colour grading','Sound cleanup & mixing']){const p=change(change(initial(),'service','Editing'),'project',project);assert.ok(quoteOnly(p));assert.deepEqual(priceLines(p),[])}
console.log('All 20 rate entries, bundle exclusions, quantity caps, date validation, day/week/half-day totals, delivery requirements, draft restoration and quote-only services passed.');
