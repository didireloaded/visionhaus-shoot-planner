import {validDate} from './dates.mjs';
// VisionHaus_RateCard_2026.pdf, pages 3–4. All amounts NAD, ex VAT.
export const rentalItems=[
 ['fx3','Cameras','Sony FX3 camera',2100,3000,9000,1,'Cage, 1 battery & 1 card','camera'],
 ['bundle','Cameras','Ready-to-shoot FX3 bundle',3400,4800,14500,1,'FX3, 24–70mm, matte box, ND, tripod & 2 batteries','package'],
 ['sirui','Lenses','Sirui 35mm T2.9 anamorphic',400,550,1650,1,'Anamorphic lens','focus'],
 ['sigma24','Lenses','Sigma 24–70mm f/2.8',600,850,2550,1,'DG DN zoom lens','focus'],
 ['sigma85','Lenses','Sigma 85mm f/1.4',525,750,2250,1,'DG DN prime lens','focus'],
 ['rode','Audio','RØDE Wireless Pro kit',150,200,600,1,'2-channel wireless kit','mic'],
 ['zoom','Audio','Zoom H5 Studio recorder',175,250,750,1,'Audio recorder','audio-lines'],
 ['lantern','Modifiers','Aputure Lantern',110,150,450,1,'Softbox only · no fixture','lightbulb'],
 ['dome','Modifiers','Aputure Light Dome III',140,200,600,2,'Softbox only · no fixture','lightbulb'],
 ['octa','Modifiers','SmallRig 35-inch Octa',75,100,300,2,'Softbox only · no fixture','lightbulb'],
 ['rectangle','Modifiers','Aputure Rectangle',60,80,240,2,'Softbox only · no fixture','lightbulb'],
 ['modifiers','Modifiers','Complete modifier bundle',460,650,1950,1,'All listed modifiers · fixtures excluded','package'],
 ['gopro','GoPros','GoPro HERO13 Creator Edition',400,550,1650,5,'Single action camera','video'],
 ['gopros','GoPros','GoPro HERO13 five-pack',1550,2200,6500,1,'Five action cameras','package'],
 ['matte','Accessories','Tilta Mirage Pro matte box',245,350,1050,1,'Matte box kit','frame'],
 ['tripod','Accessories','SmallRig AD-01S tripod',110,150,450,1,'Heavy tripod','triangle'],
 ['nd','Accessories','K&F 4×5.65 ND kit',140,200,600,1,'Matte-box ND filter kit','square'],
 ['mist','Accessories','Tiffen 82mm Black Pro-Mist',85,120,360,1,'Diffusion filter','circle'],
 ['vnd','Accessories','Tiffen 82mm Variable ND',85,120,360,1,'Variable ND filter','circle'],
 ['cpl','Accessories','Tiffen 82mm Circular Polarizer',55,75,225,1,'Polarizing filter','circle'],
].map(([id,category,title,half,day,week,qty,description,icon])=>({id,category,title,half,day,week,qty,description,icon}));
export const rentalInitial=()=>({items:{},period:'day',start:'',end:'',fulfilment:'Collection',address:'',name:'',email:'',phone:'',notes:'',step:'kit',ack:false});
const bundles={bundle:['fx3','sigma24','matte','nd','tripod'],modifiers:['lantern','dome','octa','rectangle'],gopros:['gopro']};
export function includedBy(s,id){return Object.entries(bundles).find(([parent,parts])=>s.items[parent]>0&&parts.includes(id))?.[0]||''}
export function setRentalQty(s,id,value){const item=rentalItems.find(i=>i.id===id);if(!item||includedBy(s,id))return s;const n={...s,items:{...s.items}};const count=Math.max(0,Math.min(item.qty,Number.isFinite(value)?Math.floor(value):0));if(count)n.items[id]=count;else delete n.items[id];if(count&&bundles[id])for(const part of bundles[id])delete n.items[part];return n}
export function rentalDays(s){if(!validDate(s.start)||!validDate(s.end))return 0;const a=Date.parse(s.start),b=Date.parse(s.end);if(!Number.isFinite(a)||!Number.isFinite(b)||b<a)return 0;return Math.round((b-a)/86400000)+1}
export function rentalUnits(s){const days=rentalDays(s);return !days?0:s.period==='week'?Math.ceil(days/7):s.period==='half'?1:days}
export function rentalErrors(s,today){const e=[];if(!Object.keys(s.items).length)e.push('Choose at least one item.');if(!rentalDays(s))e.push('Choose valid start and return dates.');if(today&&s.start<today)e.push('Choose today or a later start date.');const d=rentalDays(s);if(s.period==='half'&&d>1)e.push('Half-day hire must start and return on the same date.');if(s.period==='week'&&d>0&&d<5)e.push('Weekly hire is for 5–7 days. Choose daily hire for a shorter rental.');if(s.fulfilment==='Delivery'&&!s.address.trim())e.push('Add the delivery town or address.');return e}
export function rentalLines(s){const units=rentalUnits(s);return rentalItems.filter(i=>s.items[i.id]>0&&!includedBy(s,i.id)).map(i=>({id:i.id,title:i.title,qty:s.items[i.id],rate:i[s.period],units,amount:i[s.period]*s.items[i.id]*units}))}
export const rentalTotal=s=>rentalLines(s).reduce((sum,i)=>sum+i.amount,0);
export function restoreRental(raw){let s=rentalInitial();if(!raw||typeof raw!=='object')return s;if(['half','day','week'].includes(raw.period))s.period=raw.period;for(const key of ['start','end','address','name','email','phone','notes'])if(typeof raw[key]==='string')s[key]=raw[key].slice(0,key==='notes'?1500:200);if(raw.fulfilment==='Delivery')s.fulfilment='Delivery';for(const i of rentalItems)if(raw.items&&Number.isInteger(raw.items[i.id]))s=setRentalQty(s,i.id,raw.items[i.id]);if(['kit','dates','review'].includes(raw.step))s.step=raw.step;return s}
export function rentalBrief(s){return ['VISIONHAUS EQUIPMENT RENTAL REQUEST',`Name: ${s.name}`,`Email: ${s.email}`,`Phone: ${s.phone||'Not supplied'}`,'',`Dates: ${s.start} to ${s.end} (${rentalDays(s)} calendar days)`,`Rate: ${s.period==='half'?'Half day, up to 4 hours':s.period==='week'?'Weekly, 5–7 days per block':'Daily'}`,`${s.fulfilment}${s.fulfilment==='Delivery'&&s.address?`: ${s.address}`:''}`,'',...rentalLines(s).map(l=>`${l.title} × ${l.qty} × ${l.units} rate unit(s): N$ ${l.amount.toLocaleString('en-NA')}`),'',`Equipment estimate: N$ ${rentalTotal(s).toLocaleString('en-NA')} ex VAT`,'Delivery, deposit and insurance excluded. Availability and eligibility require approval.',`Notes: ${s.notes||'None'}`,'This is a rental request, not a confirmed reservation.'].join('\n')}
