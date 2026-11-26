import {restoreRequestToken} from './request-id.mjs';
import {validDate,windhoekToday} from './dates.mjs';
// Published photography/crew/equipment rates: VisionHaus_RateCard_2026.pdf.
// Reel, music and podcast starting rates: owner's supplied pricing. Quotes confirm scope.
export const projects={Video:['Social reel','Music video','Event coverage','Podcast','Interview','Testimonial','Conference','Commercial','Corporate video','Wedding film','Property video','Product video','Tourism & hospitality film','Documentary','Birthday reel','Club-night video','Monthly content','Livestreaming','Brand commercial','Crew hire'],Photo:['Portraits','Headshots','Event photography','Product photography','Nightlife photography','Property photography','Fashion photography'],'Photo + video':['Event coverage','Brand content','Conference'],Editing:['Social reel edit','Podcast edit','Music video edit','Event edit','Commercial edit','Colour grading','Sound cleanup & mixing','Photo editing & retouching']};
export const locations=['Windhoek','Swakopmund','Walvis Bay','The north','Other location / remote'];
export const packages=[
 {id:'reels',taxInclusive:true,title:'Reels',project:'Social reel',service:'Video',image:'camera',icon:'smartphone',label:'Short-form video for social',price:1800,variants:[{id:'outdoor',label:'Outdoor',price:1800,hours:3,features:['3-hour outdoor shoot','One finished reel','3 revision rounds']},{id:'indoor',label:'Indoor',price:2500,hours:6,features:['6-hour indoor shoot','One finished reel','4 revision rounds']},{id:'both',label:'Both',price:3500,hours:7,features:['Indoor & outdoor','7-hour shoot','One reel · 5 revisions']}]},
 {id:'photo',title:'Photography',project:'Portraits',service:'Photo',image:'portrait',icon:'camera',label:'Portrait and lifestyle sessions',price:6500,variants:[{id:'half',label:'Half day',price:6500,hours:4,features:['4-hour photo session','Up to 80 edited images','Online delivery gallery']},{id:'full',label:'Full day',price:11500,hours:8,features:['8-hour photo session','Up to 200 edited images','90-day RAW backup']}]},
 {id:'music',taxInclusive:true,title:'Music videos',project:'Music video',service:'Video',image:'events',icon:'music-2',label:'Performance video for a release',price:6800,variants:[{id:'outdoor',label:'Outdoor',price:6800,hours:3,features:['3-hour shoot · 2 locations','Finished music video','2 revision rounds']},{id:'indoor',label:'Indoor',price:9500,hours:6,features:['6-hour indoor shoot','Finished music video','3 revision rounds']},{id:'both',label:'Both',price:15000,hours:8,features:['Full-day indoor & outdoor','Finished music video','6 revision rounds · from N$15,000']}]},
 {id:'podcast',taxInclusive:true,title:'Podcasts',project:'Podcast',service:'Video',image:'podcast',icon:'mic',label:'Filmed and edited episodes',price:6000,variants:[{id:'one',label:'1 camera',price:6000,cameras:1,features:['One-camera recording','Clear audio & lighting','One fully edited episode']},{id:'two',label:'2 cameras',price:8500,cameras:2,features:['Two-camera recording','Clear audio & lighting','One fully edited episode']},{id:'three',label:'3 cameras',price:11000,cameras:3,features:['Three-camera recording','Clear audio & lighting','One fully edited episode']}]},
 {id:'editing',title:'Editing',project:'Social reel edit',service:'Editing',image:'camera',icon:'scissors',label:'Your footage, cut and finished',price:1900,variants:[{id:'two',label:'2 hours',price:1900,hours:2,features:['2-hour editing allowance','Your supplied footage','Final scope reviewed first']},{id:'day',label:'Day rate',price:5500,hours:8,features:['8-hour editing allowance','Your supplied footage','Final scope reviewed first']}]},
 {id:'event',title:'Event highlights',project:'Event coverage',service:'Video',image:'events',icon:'clapperboard',label:'A highlight film of your event',price:12500,variants:[{id:'standard',label:'Standard',price:12500,hours:8,features:['Solo videographer','3-minute highlight film','Vertical cut · 7-day delivery']},{id:'premium',label:'Premium',price:24500,hours:8,cameras:2,features:['Two videographers','Hero edit & same-day teaser','3 cutdowns · drone subject to permits']}]},
];
// Owner-approved monthly capacity, not cumulative promises of every maximum.
export const retainers=[
 {id:'essential',title:'Essential',price:10000,hours:6,videos:3,photos:20,events:0,revisions:2},
 {id:'growth',title:'Growth',price:25000,hours:16,videos:6,photos:50,events:1,revisions:3},
 {id:'professional',title:'Professional',price:40000,hours:28,videos:10,photos:100,events:2,revisions:3},
 {id:'partner',title:'Media Partner',price:65000,hours:45,videos:15,photos:150,events:3,revisions:4},
];
export const isRetainer=s=>s.project==='Monthly content';
export const retainerFor=s=>retainers.find(r=>r.id===s.retainerTier)||retainers[0];
export const isFinishing=s=>['Colour grading','Sound cleanup & mixing'].includes(s.project);
export const extras=[{id:'sameDay',title:'Same-day edit',description:'Selected edit delivered on the shoot day · availability confirmed',price:null,icon:'clock-3'},{id:'clips',title:'3 vertical cutdowns',description:'Short edits for social · priced for your project',quoteNote:'Requested. VisionHaus will discuss the edit scope and confirm a separate price. Not included in this estimate.',price:null,icon:'smartphone'},{id:'captions',title:'Captions',description:'Subtitles on your edits · per request',price:1800,icon:'captions'},{id:'rush',title:'Fast delivery',description:'Deadline confirmed before approval · per request',price:2000,icon:'timer'},{id:'raw',title:'Source footage',description:'Price depends on footage, transfer and storage',quoteNote:'Requested. VisionHaus will discuss your footage and confirm a separate price. Drives or other storage cost extra. Not included in this estimate.',price:null,icon:'hard-drive'},{id:'retouch',title:'Extra retouching',description:'N$250 per image',price:250,icon:'image-plus'},{id:'graphics',title:'Motion graphics',description:'Beyond included graphics · per shoot',price:1800,icon:'layers'}];
export const initial=()=>({requestToken:'',mode:'custom',packageId:'',variantId:'',service:'',project:'',section:'project',crewRole:'Camera operator',crewCount:1,subjects:1,people:2,episodes:1,perDay:1,episodeMinutes:30,hours:4,cameras:2,framing:'Conversation',eventOutput:'highlight',editLength:'60 seconds',location:'Windhoek',venue:'',date:'',shootStyle:'Indoor',sound:true,lighting:true,liveEdits:false,gimbal:false,drone:false,teleprompter:false,extras:[],retainerTier:'essential',finishingFormat:'once',clipCount:3,retouchCount:1,extraLighting:false,extraSound:false,extraPhotographer:false,name:'',company:'',billingAddress:'',email:'',phone:'',notes:'',sourceBrief:'',briefQuestions:[],briefUnpriced:[],briefQuoteRequired:false,complete:false});
export const isPodcast=s=>s.project==='Podcast';
export const isEditing=s=>s.service==='Editing';
export const isPhoto=s=>s.service==='Photo';
export const isEvent=s=>['Event coverage','Conference','Event photography','Wedding film'].includes(s.project);
export const packageFor=s=>packages.find(p=>p.id===s.packageId);
export const variantFor=s=>packageFor(s)?.variants.find(v=>v.id===s.variantId);
export const packageInclusions=s=>(variantFor(s)?.features||[]).map(text=>isPodcast(s)&&text==='One fully edited episode'?`${s.episodes} fully edited episode${s.episodes===1?'':'s'}`:text);
export const hoursValue=s=>s.hours==='Full day'?8:s.hours;
export const shootDays=s=>isPodcast(s)?Math.ceil(s.episodes/s.perDay):1;
export const availableExtras=s=>(s.project==='Crew hire'||isRetainer(s)?[]:extras.filter(e=>(isPhoto(s)||s.project==='Photo editing & retouching')?['sameDay','rush','retouch','raw'].includes(e.id):!['retouch'].includes(e.id))).map(e=>e.id==='sameDay'?sameDayExtra(s,e):isPodcast(s)&&e.id==='rush'?{...e,title:'Priority / next-day edit',description:'N$1,500 per episode · availability confirmed',price:1500}:isPodcast(s)&&e.id==='graphics'?{...e,description:'Beyond included titles & basic animation'}:e.id==='clips'&&s.project==='Conference'?{...e,title:'Vertical cutdowns',description:'N$2,000 per cutdown',price:2000}:e);
function sameDayExtra(s,e){
 const reel=['Social reel','Birthday reel','Social reel edit'].includes(s.project);
 const style=s.mode==='package'?variantFor(s)?.id:s.shootStyle.toLowerCase();
 const base=basePriceLines(s).reduce((sum,l)=>sum+(baseInclusive(s)?l.amount/1.15:l.amount),0);
 const price=reel?({outdoor:600,indoor:1000,both:1500}[style]||1000):base>0?Math.max(600,Math.ceil(base*.25/100)*100):null;
 return {...e,price,description:reel?'Same-day reel edit · subject to availability':s.packageId==='event'&&s.variantId==='premium'?'Upgrade the main edit · your same-day teaser is already included':'One agreed edit or delivery set on the same day · scope and availability confirmed',quoteNote:'Requested. Same-day delivery scope, availability and price must be agreed separately. Not included in this estimate.'};
}
export const pendingExtras=s=>availableExtras(s).filter(e=>s.extras.includes(e.id)&&e.price===null);
export const quoteOnly=s=>s.briefQuoteRequired===true||s.project==='Crew hire'||(['Birthday reel','Product video'].includes(s.project)&&s.shootStyle==='Both')||(s.mode==='custom'&&s.service==='Video'&&s.project==='Event coverage'&&s.eventOutput==='full');
function basePriceLines(s){
 if(!s.project||quoteOnly(s))return [];
 const variant=variantFor(s);
 if(s.mode==='package'&&variant)return [{label:`${packageFor(s).title} · ${variant.label}${isPodcast(s)?` × ${s.episodes} episode${s.episodes===1?'':'s'}`:''}`,amount:variant.price*(isPodcast(s)?s.episodes:1)}];
 if(isPhoto(s)&&s.project==='Headshots'&&s.mode==='custom')return [{label:`${Math.max(8,s.subjects)} corporate headshots · minimum 8 people`,amount:Math.max(8,s.subjects)*650}];
 if(isPodcast(s))return [{label:`${s.episodes} episode${s.episodes===1?'':'s'} · ${s.cameras} camera${s.cameras===1?'':'s'} · recording & post`,amount:([0,6000,8500,11000][s.cameras])*s.episodes}];
 const hrs=hoursValue(s);
 if(isRetainer(s)){const r=retainerFor(s);return [{label:`${r.title} monthly retainer · up to ${r.hours} production hours`,amount:r.price}]}
 if(s.service==='Photo + video'){
  const rate=s.project==='Brand content'?5000:15000;
  return [{label:`${s.project} · videography starting price`,amount:rate},{label:`${s.project} · photography starting price`,amount:rate}];
 }
 if(s.project==='Birthday reel')return [{label:`Birthday reel · ${s.shootStyle.toLowerCase()}`,amount:s.shootStyle==='Indoor'?2500:1800}];
 if(s.project==='Product video')return [{label:`Product video · ${s.shootStyle.toLowerCase()} · starting price`,amount:s.shootStyle==='Indoor'?3500:2000}];
 if(['Property photography','Fashion photography'].includes(s.project))return [{label:`${s.project} · ${hrs} hours at N$2,000/hour`,amount:hrs*2000}];
 if(isFinishing(s)){
  const series=s.finishingFormat==='series',grading=s.project==='Colour grading';
  return [{label:`${s.project} · ${series?`${s.episodes} episodes at N$7,000/episode`:'once-off starting price'}`,amount:series?7000*s.episodes:grading?12000:5000}];
 }
 const starting={'Documentary':20000,'Tourism & hospitality film':9000,'Livestreaming':25000,'Photo editing & retouching':1800,'Interview':4500,'Testimonial':3500,'Conference':15000,'Wedding film':25000,'Property video':5500};
 if(Object.hasOwn(starting,s.project))return [{label:`${s.project} · starting price`,amount:starting[s.project]}];
 if(s.project==='Club-night video')return [{label:'Club-night video package · 3–4 hours',amount:5500}];
 if(s.project==='Nightlife photography')return [{label:'Nightlife photography · 3–4 hours',amount:3500}];
 if(s.project==='Corporate video')return [{label:hrs>=8?'Corporate video · premium':'Corporate video · standard',amount:hrs>=8?32500:16500}];
 if(s.project==='Commercial')return [{label:'Commercial / online ad · starting price',amount:65000}];
 if(s.project==='Brand commercial')return [{label:'Brand commercial · starting price',amount:180000}];
 if(isPhoto(s)&&s.project==='Event photography')return [{label:'Event & conference photography · day package',amount:9500}];
 if(isEditing(s))return [{label:hrs>=8?'Editing day allowance':`${Math.max(2,hrs)}-hour editing allowance`,amount:hrs>=8?5500:Math.max(2,hrs)*950}];
 const video=!isPhoto(s);
 const lines=[{label:video?(hrs>=8?'Lead videographer · day · camera kit included':`Lead videographer · ${Math.max(3,hrs)} hrs · camera kit included`):(hrs>=8?'Photography · 8-hour package':hrs===4?'Photography · half-day package':`Photography · ${Math.max(2,hrs)} hrs`),amount:video?(hrs>=8?11500:Math.max(3,hrs)*3500):(hrs>=8?11500:hrs===4?6500:Math.max(2,hrs)*2500)}];
 return lines;
}
const baseInclusive=s=>isPodcast(s)||(s.mode==='package'&&packageFor(s)?.taxInclusive===true);
export function priceLines(s){
 const inclusive=baseInclusive(s),lines=basePriceLines(s).map(l=>({...l,taxInclusive:inclusive}));
 for(const e of availableExtras(s))if(s.extras.includes(e.id)&&e.price!==null){
  if(s.mode==='package'&&s.packageId==='event'&&s.variantId==='premium'&&e.id==='clips')continue;
  const qty=e.id==='clips'?s.clipCount:e.id==='retouch'?s.retouchCount:isPodcast(s)&&e.id==='rush'?s.episodes:1;
  lines.push({label:`${e.title} × ${qty}${e.id==='retouch'?' images':isPodcast(s)&&e.id==='rush'?' episodes':''}`,amount:e.price*qty,quantity:qty,description:e.description,taxInclusive:isPodcast(s)&&e.id==='rush'});
 }
 const includedCameras=isPodcast(s)?s.cameras:s.mode==='package'?(variantFor(s)?.cameras||1):isRetainer(s)?s.cameras:1;
 if(!isPhoto(s)&&!isEditing(s)&&!isRetainer(s)&&s.project!=='Crew hire'&&s.cameras>includedCameras)lines.push({label:`Additional camera, operator & tripod × ${s.cameras-includedCameras} · per shoot`,amount:1800*(s.cameras-includedCameras),taxInclusive:false});
 for(const[key,label]of[['extraLighting','Additional lighting beyond inclusions'],['extraSound','Additional sound support beyond inclusions'],['extraPhotographer','Additional photographer'],['liveEdits','On-site editor'],['gimbal','Gimbal & operator'],['drone','Drone & pilot'],['teleprompter','Teleprompter']]){
  const included=s.mode==='package'&&s.packageId==='event'&&s.variantId==='premium'&&['drone','liveEdits'].includes(key);
  if(s[key]&&!included)lines.push({label:`${label} · per shoot`,amount:1800,taxInclusive:false});
 }
 if(isPodcast(s)&&s.people>2)lines.push({label:`Additional podcast audio channels × ${s.people-2} · per shoot`,amount:1800*(s.people-2),taxInclusive:false});
 return lines;
}
const roundMoney=n=>Math.round((n+Number.EPSILON)*100)/100;
export function priceTotals(s){const lines=priceLines(s);const net=roundMoney(lines.reduce((n,l)=>n+(l.taxInclusive?l.amount/1.15:l.amount),0));const gross=roundMoney(lines.reduce((n,l)=>n+(l.taxInclusive?l.amount:l.amount*1.15),0));return {net,vat:roundMoney(gross-net),gross}}
export const taxLabel=s=>baseInclusive(s)?'Tax inclusive':'Ex VAT';
export const packageOvertime=s=>s.mode==='package'&&s.packageId==='reels'?'Additional filming beyond package time: N$250 per hour.':s.mode==='package'&&s.packageId==='music'?'Additional filming beyond package time: N$550 per hour.':'';
export const total=s=>baseInclusive(s)?priceTotals(s).gross:priceTotals(s).net;
export function equipment(s){
 if(s.project==='Crew hire')return [`${s.crewCount} ${s.crewRole}${s.crewCount>1?'s':''}`];
 if(isEditing(s))return ['Editing workstation','Colour & sound finishing'];
 if(isRetainer(s))return ['Camera and standard lens kit','Lighting and professional audio within tier scope','Monthly production plan agreed before booking'];
 const cameras=isPhoto(s)?1:s.cameras;
 const items=[`${cameras} camera${cameras===1?'':'s'}`,`${cameras} ${isPhoto(s)?'photographer':'camera operator'}${cameras===1?'':'s'}`,`${cameras} tripod${cameras===1?'':'s'}`];
 if(s.lighting)items.push('Lighting setup & modifiers');
 if(s.sound)items.push(isPodcast(s)?`${s.people} microphone${s.people===1?'':'s'} & audio recording`:'Sound recording & operator');
 if(s.extraLighting)items.push('Additional lighting beyond inclusions');
 if(s.extraSound)items.push('Additional sound support beyond inclusions');
 if(s.extraPhotographer)items.push('Additional photographer');
 if(s.gimbal)items.push('Gimbal setup');
 if(s.drone)items.push('Drone & pilot · permit review');
 if(s.teleprompter)items.push('Teleprompter');
 if(s.liveEdits)items.push('On-site editor & edit station');
 if(s.service==='Photo + video')items.push('Dedicated photographer & photo kit');
 return items;
}
export function scopeText(s){
 if(!s.project)return 'Build your production';
 if(isRetainer(s))return `${retainerFor(s).title} · ${retainerFor(s).hours} hours/month`;
 const parts=[isPodcast(s)?`${s.people}-person podcast`:s.project];
 if(isPodcast(s))parts.push(`${s.episodes} ep · ${shootDays(s)} day${shootDays(s)===1?'':'s'}`);
 else if(!isEditing(s))parts.push(s.hours==='Full day'?'Full day':`${s.hours} hrs`);
 return parts.join(' · ');
}
export function narrative(s){
 if(!s.project)return 'Choose a service to get started.';
 if(isRetainer(s)){const r=retainerFor(s);return `${r.title} retainer. Up to ${r.hours} production hours per month. Minimum 3 months; monthly mix agreed in advance.`}
 if(isFinishing(s))return `${s.project}. ${s.finishingFormat==='series'?`${s.episodes} episodes`:'Once-off project'}.`;
 if(isPodcast(s))return `${s.people===1?'Solo':`${s.people}-person`} podcast. ${s.episodes} episode${s.episodes===1?'':'s'}, ${s.cameras} camera${s.cameras===1?'':'s'}, recorded over ${shootDays(s)} day${shootDays(s)===1?'':'s'}.`;
 if(isEvent(s)&&!isPhoto(s))return `${s.eventOutput==='full'?'Full event recording':`${s.editLength} event highlight`}. ${s.hours==='Full day'?'Full-day':`${s.hours}-hour`} coverage in ${s.location}.`;
 return `${s.project}. ${isEditing(s)?`${hoursValue(s)}-hour editing allowance`:`${s.hours==='Full day'?'Full-day':`${s.hours}-hour`} shoot in ${s.location}`}.`;
}
export function reviewItems(s){
 if(!s.project)return [];
 const items=[...(s.briefQuestions||[]),...(s.briefUnpriced||[]).map(x=>'Separate pricing: '+x)];
 if(quoteOnly(s))items.push('Service price & full scope');
 if(['Product video','Documentary','Tourism & hospitality film','Livestreaming','Interview','Testimonial','Wedding film','Property video','Conference','Photo editing & retouching'].includes(s.project)||s.service==='Photo + video')items.push('Starting price only · final scope and deliverables confirmed');
 if(s.project==='Product video')items.push('Complex lighting or set design quoted separately');
 if(s.project==='Documentary')items.push('Camera gear included · production scope confirmed');
 if(isFinishing(s))items.push('Footage volume, runtime and revision allowance confirmed');
 if(s.project==='Photo editing & retouching')items.push('Base retouching scope and number of images confirmed');
 if(isRetainer(s))items.push('Minimum 3 months · payable monthly in advance','Video and photo maximums are capacity guides, not cumulative entitlements','Events use monthly production hours; third-party costs excluded','Up to 20% of unused hours rolls to the next month only','Organic social and website use; paid-media rights quoted separately','Travel included within 25 km of central Windhoek; longer travel quoted');
 if(s.mode==='custom'&&!isPodcast(s)&&!isEditing(s)&&!isRetainer(s)&&s.project!=='Documentary')items.push('Editing, supporting crew & equipment priced in final quote');
 if(!isEditing(s)&&s.cameras>1)items.push('Additional cameras & crew availability');
 if(isPodcast(s)&&s.episodeMinutes>30)items.push('Episodes over 30 minutes · extended runtime quoted separately');
 if(isPodcast(s)&&s.extras.includes('rush'))items.push('Priority delivery availability');
 if(isPodcast(s)&&s.people>2)items.push('Additional audio channels');
 if(isPodcast(s)&&s.perDay*s.episodeMinutes>hoursValue(s)*60-60)items.push('Recording schedule needs more time for setup & breaks');
 if(s.location!=='Windhoek'&&!isEditing(s))items.push('Travel & accommodation');
 if(s.hours==='Full day')items.push('Exact day length & overtime');
 if(s.liveEdits)items.push('On-site editing');
 if(s.gimbal)items.push('Gimbal availability & hire');
 if(s.drone)items.push('Drone availability, permits & pilot');
 if(s.teleprompter)items.push('Teleprompter hire');
 if(s.mode==='custom'&&isEditing(s))items.push('Footage volume, runtime & edit complexity');
 for(const e of availableExtras(s))if(s.extras.includes(e.id)){if(e.price===null)items.push(e.title,`${e.title}: separate price to be agreed with VisionHaus; excluded from this estimate`);else if(e.id==='rush')items.push('Requested delivery deadline and availability')}
 if(s.extras.includes('sameDay'))items.push('Same-day delivery scope, shoot finish time and editor availability');
 if(s.project==='Conference'&&s.extras.includes('clips'))items.push('Cutdown duration and edit scope confirmed');
 return [...new Set(items)];
}
export function change(s,key,value){
 let n={...s,[key]:value,complete:false};
 if(key==='service')n={...initial(),requestToken:s.requestToken,name:s.name,company:s.company,billingAddress:s.billingAddress,email:s.email,phone:s.phone,notes:s.notes,sourceBrief:s.sourceBrief,briefQuestions:s.briefQuestions,briefUnpriced:s.briefUnpriced,briefQuoteRequired:s.briefQuoteRequired,service:value};
 if(key==='project')n={...initial(),requestToken:s.requestToken,name:s.name,company:s.company,billingAddress:s.billingAddress,email:s.email,phone:s.phone,notes:s.notes,sourceBrief:s.sourceBrief,briefQuestions:s.briefQuestions,briefUnpriced:s.briefUnpriced,briefQuoteRequired:s.briefQuoteRequired,service:s.service,project:value,section:'shoot',subjects:value==='Headshots'?8:1,cameras:value==='Podcast'?2:1,sound:s.service!=='Photo'};
 if(key==='framing'){
  n.cameras=value==='Direct to camera'?1:value==='Conversation'?2:3;
  if(value==='Direct to camera')n.people=1;
  else if(n.people===1)n.people=2;
 }
 if(key==='people')n.people=n.framing==='Direct to camera'?1:Math.max(2,Math.min(4,value));
 if(key==='episodes'){n.episodes=Math.max(1,Math.min(17,value));n.perDay=Math.min(n.perDay,n.episodes)}
 if(key==='perDay')n.perDay=Math.max(1,Math.min(n.episodes,value));
 if(key==='cameras')n.cameras=Math.max(1,Math.min(3,value));
 if(key==='clipCount')n.clipCount=Math.max(1,Math.min(30,value));
 if(key==='retouchCount')n.retouchCount=Math.max(1,Math.min(200,value));
 if(key==='eventOutput')n.editLength=value==='full'?'Full recording':'30 seconds';
 return n;
}
export function startPackage(id,variantId){
 const p=packages.find(p=>p.id===id);if(!p)return initial();const v=p.variants.find(v=>v.id===variantId)||p.variants[0];
 return {...initial(),mode:'package',packageId:p.id,variantId:v.id,service:p.service,project:p.project,section:'shoot',hours:v.hours||4,shootStyle:({outdoor:'Outdoor',indoor:'Indoor',both:'Both'})[v.id]||'Indoor',cameras:v.cameras||1,people:p.id==='podcast'&&v.cameras===1?1:2,framing:p.id==='podcast'&&v.cameras===1?'Direct to camera':v.cameras===3?'Full coverage':'Conversation',perDay:1,sound:p.service!=='Photo',liveEdits:p.id==='event'&&v.id==='premium',drone:p.id==='event'&&v.id==='premium',eventOutput:'highlight',editLength:p.id==='event'?'3 minutes':'60 seconds'};
}
export function restore(raw){
 if(!raw||typeof raw!=='object'||!Object.hasOwn(projects,raw.service))return initial();
 let n=raw.mode==='package'&&packages.some(p=>p.id===raw.packageId)?startPackage(raw.packageId,raw.variantId):change(initial(),'service',raw.service);
 if(raw.mode!=='package'&&projects[raw.service].includes(raw.project))n=change(n,'project',raw.project);
 for(const[key,min,max]of[['clipCount',1,30],['retouchCount',1,200],['crewCount',1,10],['subjects',1,200],['people',1,4],['episodes',1,17],['perDay',1,17],['episodeMinutes',15,180],['cameras',1,3]])if(Number.isInteger(raw[key])&&raw[key]>=min&&raw[key]<=max)n[key]=raw[key];
 if([2,3,4,6,7,8,'Full day'].includes(raw.hours))n.hours=raw.hours;
 if(['Direct to camera','Conversation','Full coverage'].includes(raw.framing))n.framing=raw.framing;
 if(isPhoto(n)&&n.project==='Headshots')n.subjects=Math.max(8,n.subjects);
 if(isPodcast(n)&&n.framing==='Direct to camera')n.people=1;
 n.perDay=Math.min(n.perDay,n.episodes);
 if(n.mode==='package'){const v=variantFor(n);n.cameras=v.cameras||1;n.hours=v.hours||n.hours}
 if(retainers.some(r=>r.id===raw.retainerTier))n.retainerTier=raw.retainerTier;
 if(['once','series'].includes(raw.finishingFormat))n.finishingFormat=raw.finishingFormat;
 if(locations.includes(raw.location))n.location=raw.location;
 for(const key of['sound','lighting','liveEdits','gimbal','drone','teleprompter','extraLighting','extraSound','extraPhotographer'])if(typeof raw[key]==='boolean')n[key]=raw[key];
 if(['Camera operator','Photographer','Editor','Sound operator','Production assistant'].includes(raw.crewRole))n.crewRole=raw.crewRole;
 for(const [key,values]of Object.entries({eventOutput:['highlight','full'],editLength:['30 seconds','60 seconds','3 minutes','Long-form','Full recording'],shootStyle:['Indoor','Outdoor','Both']}))if(values.includes(raw[key]))n[key]=raw[key];
 n.requestToken=restoreRequestToken(raw.requestToken);
 n.briefQuoteRequired=raw.briefQuoteRequired===true;
 n.sourceBrief=typeof raw.sourceBrief==='string'?raw.sourceBrief.slice(0,50000):'';
 for(const key of ['briefQuestions','briefUnpriced'])n[key]=Array.isArray(raw[key])?raw[key].filter(x=>typeof x==='string').slice(0,12).map(x=>x.slice(0,350)):[];
 for(const key of['venue','date','name','company','billingAddress','email','phone','notes'])if(typeof raw[key]==='string')n[key]=raw[key].slice(0,key==='notes'?6000:150);
 if(isRetainer(n))for(const key of ['extraLighting','extraSound','extraPhotographer','liveEdits','gimbal','drone','teleprompter'])n[key]=false;
 if(Array.isArray(raw.extras)&&raw.extras.includes('sameDay'))raw={...raw,extras:raw.extras.filter(id=>id!=='rush')};
 n.extras=availableExtras(n).filter(e=>Array.isArray(raw.extras)&&raw.extras.includes(e.id)).map(e=>e.id);
 if(['project','shoot','equipment','delivery','review'].includes(raw.section))n.section=raw.section;
 return n;
}
export function productionErrors(s,today=windhoekToday()){
 if(!Object.hasOwn(projects,s.service)||!projects[s.service].includes(s.project))return ['Choose a service before submitting.'];
 if(s.date&&(!validDate(s.date)||s.date<today))return ['Choose today or a later valid date, or leave the date open.'];
 return [];
}
export function briefText(s){
 const lines=['VISIONHAUS PRODUCTION REQUEST',`Name: ${s.name}`,`Company: ${s.company||'Individual'}`,`Billing address: ${s.billingAddress||'Not supplied'}`, `Email: ${s.email}`,`Phone: ${s.phone||'Not supplied'}`,'',s.mode==='package'?`Package: ${packageFor(s)?.title} / ${variantFor(s)?.label}`:'Custom production',narrative(s),`Location: ${s.location}${s.venue?` / ${s.venue}`:''}`,`Preferred date: ${s.date||'Flexible'}`];
 if(isPhoto(s)&&!isEvent(s))lines.push(`Subjects / products: ${s.subjects}`);
 if(isEditing(s))lines.push(`Finished runtime: ${s.editLength}`);
 if(!isEditing(s)&&!isPodcast(s)&&!isRetainer(s))lines.push(`Time on location: ${s.hours}${typeof s.hours==='number'?' hours':''}`);
 if(!isPhoto(s)&&!isEvent(s)&&!isPodcast(s)&&!isEditing(s)&&!isRetainer(s)&&s.project!=='Crew hire'){lines.push(`Setting: ${s.shootStyle}`);if(s.mode==='custom')lines.push(`Finished runtime: ${s.editLength}`);}
 if(isRetainer(s)){const r=retainerFor(s);lines.push(`Monthly capacity: ${r.hours} production hours; up to ${r.videos} short videos / ${r.photos} photos as an agreed non-cumulative mix`,`Minimum commitment: 3 months; N$${r.price.toLocaleString('en-NA')} per month ex VAT`,`Revision allowance: up to ${r.revisions} rounds; events within monthly hour allocation`)}
 if(isPodcast(s))lines.push(`Schedule: ${s.episodes} episodes / up to ${s.perDay} per day / ${shootDays(s)} recording days`,`Episode length: ${s.episodeMinutes} minutes`,`Time per day: ${s.hours} ${typeof s.hours==='number'?'hours':''}`);
 if(s.mode==='package')lines.push('','PACKAGE INCLUSIONS',...packageInclusions(s).map(x=>`- ${x}`));
 if(packageOvertime(s))lines.push(packageOvertime(s));
 lines.push('','REQUESTED SETUP',...equipment(s).map(x=>`- ${x}`),'','EXTRAS',...availableExtras(s).filter(e=>s.extras.includes(e.id)).map(e=>`- ${e.title}${e.price===null?' · price to be agreed separately; excluded from estimate':''}`),'','PRICED ITEMS',...priceLines(s).map(l=>`${l.label}: N$ ${l.amount.toLocaleString('en-NA')} ${l.taxInclusive?'tax inclusive':'ex VAT'}`),`Starting estimate: ${quoteOnly(s)?'Quote required':`N$ ${total(s).toLocaleString('en-NA')} · ${taxLabel(s)}`}`,`VAT at 15%: N$ ${priceTotals(s).vat.toLocaleString('en-NA')}; total including VAT: N$ ${priceTotals(s).gross.toLocaleString('en-NA')}`,'','TO QUOTE / CONFIRM',...reviewItems(s).map(x=>`- ${x}`),'',`Notes: ${s.notes||'None'}`,'','This is a quote request. Dates and final cost require confirmation.');
 if(s.sourceBrief)lines.push('','ORIGINAL PROJECT BRIEF (INTERNAL)',s.sourceBrief);
 return lines.join('\n');
}
