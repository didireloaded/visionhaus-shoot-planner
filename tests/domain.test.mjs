import assert from 'node:assert/strict';
import {initial,change,total,priceLines,restore,reviewItems,equipment,shootDays,startPackage,briefText,availableExtras,packages} from '../public/domain.mjs';
let s=change(change(initial(),'service','Video'),'project','Podcast');
s=change(s,'framing','Direct to camera');assert.equal(s.people,1);assert.equal(s.cameras,1);
s=change(s,'people',4);assert.equal(s.people,1,'Solo cannot add speakers');
s=change(s,'episodes',17);assert.equal(s.episodes,17);
s=change(s,'perDay',3);assert.equal(shootDays(s),6,'17 episodes across three per day uses six days');
s=change(s,'framing','Full coverage');assert.equal(s.people,2);assert.equal(s.cameras,3);
assert.ok(equipment(s).includes('3 camera operators'));assert.ok(equipment(s).includes('3 tripods'));
assert.equal(total(s),17*11000);
s=change(s,'episodes',1);assert.equal(s.perDay,1);
s=change(s,'episodes',99);assert.equal(s.episodes,17);
s=change(s,'perDay',17);assert.ok(reviewItems(s).some(x=>x.startsWith('Recording schedule')));
const before=total(s);s=change(s,'extras',['clips']);assert.equal(total(s),before,'Unpriced extras must not silently fabricate rates');assert.ok(reviewItems(s).includes('3 vertical cutdowns'));
s=change(s,'extras',[]);assert.ok(!reviewItems(s).includes('3 vertical cutdowns'));
s=change(s,'location','The north');assert.ok(reviewItems(s).includes('Travel & accommodation'));
s=change(s,'service','Photo');assert.equal(s.project,'');assert.deepEqual(s.extras,[]);assert.equal(s.cameras,2); // Project selection normalises the photo setup.
s=change(s,'project','Portraits');assert.equal(s.cameras,1);assert.ok(!equipment(s).some(x=>/operator|microphone/i.test(x)));
assert.ok(availableExtras(s).every(e=>['sameDay','raw','rush','retouch'].includes(e.id)));
s=change(s,'service','Editing');s=change(s,'project','Podcast edit');assert.ok(!equipment(s).some(x=>/camera|lighting|tripod/i.test(x)));assert.equal(total(s),3800);
s=change(change(initial(),'service','Video'),'project','Event coverage');s=change(s,'eventOutput','full');assert.match(briefText(s),/Full event recording/);s=change(s,'liveEdits',true);assert.ok(equipment(s).some(x=>x.includes('On-site editor')));assert.ok(reviewItems(s).includes('On-site editing'));
for(const p of packages){for(const v of p.variants){const x=startPackage(p.id,v.id);assert.equal(total(x),v.price);assert.equal(priceLines(x).length,1,'Package inclusions must not be double billed')}}
s=startPackage('podcast','three');s=change(s,'episodes',17);assert.equal(total(s),187000);assert.equal(s.people,2);assert.equal(s.cameras,3);
const restored=restore({...s,perDay:999,people:999});assert.equal(restored.cameras,3);assert.ok(restored.perDay<=restored.episodes);assert.ok(restored.people<=4);
assert.equal(restore({service:'Video',project:'Fake',people:999}).project,'');assert.equal(restore(null).project,'');
s=change(change(initial(),'service','Video'),'project','Podcast');s=change(s,'framing','Direct to camera');s=change(s,'episodes',17);s=change(s,'perDay',2);const text=briefText({...s,name:'Test client',email:'test@example.com',notes:'Bring references'});assert.match(text,/17 episodes.*2 per day.*9 recording days/);assert.match(text,/1 microphone/);assert.match(text,/Bring references/);assert.match(text,/quote request/);
console.log('Solo constraints, 17-episode scheduling, derived crew/kit, package totals, review-only costs, service filtering, event deliverables and full request export passed.');

let briefState={...initial(),notes:'Client supplied brief'};briefState=change(briefState,'service','Video');briefState=change(briefState,'project','Podcast');assert.equal(briefState.notes,'Client supplied brief');assert.equal(restore(briefState).notes,'Client supplied brief');

// The request brief must preserve the scope shown to the client.
const music={...change(change(initial(),'service','Video'),'project','Music video'),hours:6,shootStyle:'Both',editLength:'3 minutes'};
assert.match(briefText(music),/Setting: Both/);
assert.match(briefText(music),/Finished runtime: 3 minutes/);
assert.match(briefText(music),/Time on location: 6 hours/);
assert.equal(restore({service:'__proto__',project:'Podcast'}).project,'');
assert.equal(restore({service:'toString',project:'Podcast'}).project,'');
const injected=restore({...music,eventOutput:'unexpected',shootStyle:'unexpected',editLength:'<script>bad</script>'});
assert.equal(injected.eventOutput,'highlight');assert.equal(injected.shootStyle,'Indoor');assert.equal(injected.editLength,'60 seconds');
for(const v of ['one','two','three']){const podcast=change(startPackage('podcast',v),'hours',8);assert.equal(restore(podcast).hours,8,'Podcast daily hours survive draft restoration');}

assert.match(briefText(change(startPackage('podcast','three'),'episodes',3)),/3 fully edited episodes/);

assert.equal(startPackage('music','outdoor').shootStyle,'Outdoor');assert.equal(startPackage('reels','both').shootStyle,'Both');assert.match(briefText(startPackage('music','both')),/Setting: Both/);

// Source: owner's Rate card creation assistance chat, July–October 2026.
const priority=change(change(startPackage('podcast','two'),'episodes',3),'extras',['rush']);
assert.equal(total(priority),3*(8500+1500),'Priority editing is priced per episode');
assert.equal(total({...priority,extras:[]}),3*8500,'Removing priority restores the base price');
assert.match(briefText(startPackage('reels','outdoor')),/tax inclusive/i);
assert.match(briefText(startPackage('music','outdoor')),/550.*hour/i);
assert.match(briefText(startPackage('reels','outdoor')),/250.*hour/i);
assert.match(briefText(startPackage('photo','half')),/ex VAT/i);
assert.ok(reviewItems({...priority,episodeMinutes:45}).some(x=>x.includes('30 minutes')),'Longer episodes need a separate scope review');
assert.ok(!reviewItems(priority).includes('Priority / next-day edit'),'A priced add-on must not also be described as unpriced');

// Selecting a quote-only extra records a request, never a zero-price inclusion.
const pendingPlan={...startPackage('reels','outdoor'),extras:['clips','raw']};
assert.deepEqual(restore(pendingPlan).extras,['clips','raw']);
assert.equal(total(pendingPlan),1800);
assert.match(briefText(pendingPlan),/Source footage.*price to be agreed separately; excluded from estimate/);
assert.ok(reviewItems(pendingPlan).some(t=>t.includes('excluded from this estimate')));
assert.equal(total({...pendingPlan,extras:[]}),1800);
