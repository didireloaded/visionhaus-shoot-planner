// Published photography/crew/equipment rates: VisionHaus_RateCard_2026.pdf.
// Reel, music and podcast starting rates: owner's supplied pricing. Quotes confirm scope.
export const projects={Video:['Social reel','Music video','Event coverage','Podcast','Interview','Testimonial','Conference','Commercial','Corporate video','Wedding film','Property video'],Photo:['Portraits','Headshots','Event photography','Product photography'],'Photo + video':['Event coverage','Brand content','Conference'],Editing:['Social reel edit','Podcast edit','Music video edit','Event edit','Commercial edit']};
export const locations=['Windhoek','Swakopmund','Walvis Bay','The north','Other location / remote'];
export const packages=[
 {id:'reels',title:'Reels',project:'Social reel',service:'Video',image:'camera',icon:'smartphone',label:'Short-form content',price:1800,variants:[{id:'outdoor',label:'Outdoor',price:1800,hours:3,features:['3-hour outdoor shoot','One finished reel','3 revision rounds']},{id:'indoor',label:'Indoor',price:2500,hours:6,features:['6-hour indoor shoot','One finished reel','4 revision rounds']},{id:'both',label:'Both',price:3500,hours:7,features:['Indoor & outdoor','7-hour shoot','One reel · 5 revisions']}]},
 {id:'photo',title:'Photography',project:'Portraits',service:'Photo',image:'portrait',icon:'camera',label:'Portraits & moments',price:6500,variants:[{id:'half',label:'Half day',price:6500,hours:4,features:['4-hour photo session','Up to 80 edited images','Online delivery gallery']},{id:'full',label:'Full day',price:11500,hours:8,features:['8-hour photo session','Up to 200 edited images','90-day RAW backup']}]},
 {id:'music',title:'Music videos',project:'Music video',service:'Video',image:'events',icon:'music-2',label:'For your next release',price:6800,variants:[{id:'outdoor',label:'Outdoor',price:6800,hours:3,features:['3-hour shoot · 2 locations','Finished music video','2 revision rounds']},{id:'indoor',label:'Indoor',price:9500,hours:6,features:['6-hour indoor shoot','Finished music video','3 revision rounds']},{id:'both',label:'Both',price:15000,hours:8,features:['Full-day indoor & outdoor','Finished music video','6 revision rounds · from N$15,000']}]},
 {id:'podcast',title:'Podcasts',project:'Podcast',service:'Video',image:'podcast',icon:'mic',label:'Record your conversation',price:6000,variants:[{id:'one',label:'1 camera',price:6000,cameras:1,features:['One-camera recording','Clear audio & lighting','One fully edited episode']},{id:'two',label:'2 cameras',price:8500,cameras:2,features:['Two-camera recording','Clear audio & lighting','One fully edited episode']},{id:'three',label:'3 cameras',price:11000,cameras:3,features:['Three-camera recording','Clear audio & lighting','One fully edited episode']}]},
 {id:'editing',title:'Editing',project:'Social reel edit',service:'Editing',image:'camera',icon:'scissors',label:'Bring your footage together',price:1900,variants:[{id:'two',label:'2 hours',price:1900,hours:2,features:['2-hour editing allowance','Your supplied footage','Final scope reviewed first']},{id:'day',label:'Day rate',price:5500,hours:8,features:['8-hour editing allowance','Your supplied footage','Final scope reviewed first']}]},
 {id:'event',title:'Event highlights',project:'Event coverage',service:'Video',image:'events',icon:'clapperboard',label:'The moments that matter',price:12500,variants:[{id:'standard',label:'Standard',price:12500,hours:8,features:['Solo videographer','3-minute highlight film','Vertical cut · 7-day delivery']},{id:'premium',label:'Premium',price:24500,hours:8,cameras:2,features:['Two videographers','Hero edit & same-day teaser','3 cutdowns · drone subject to permits']}]},
];
export const extras=[{id:'clips',title:'3 vertical cutdowns',description:'Short edits for social',price:null,icon:'smartphone'},{id:'captions',title:'Captions',description:'Subtitles on your edits',price:null,icon:'captions'},{id:'rush',title:'Fast delivery',description:'Confirm a turnaround',price:null,icon:'timer'},{id:'raw',title:'Source footage',description:'Transfer & drive quoted',price:null,icon:'hard-drive'},{id:'retouch',title:'Extra retouching',description:'For selected images',price:null,icon:'sparkles'},{id:'graphics',title:'Motion graphics',description:'Titles & animation',price:null,icon:'layers'}];
export const initial=()=>({mode:'custom',packageId:'',variantId:'',service:'',project:'',section:'project',subjects:1,people:2,episodes:1,perDay:1,episodeMinutes:45,hours:4,cameras:2,framing:'Conversation',eventOutput:'highlight',editLength:'60 seconds',location:'Windhoek',venue:'',date:'',shootStyle:'Indoor',sound:true,lighting:true,liveEdits:false,gimbal:false,drone:false,teleprompter:false,extras:[],name:'',email:'',phone:'',notes:'',complete:false});
export const isPodcast=s=>s.project==='Podcast';
export const isEditing=s=>s.service==='Editing';
export const isPhoto=s=>s.service==='Photo';
export const isEvent=s=>['Event coverage','Conference','Event photography','Wedding film'].includes(s.project);
export const packageFor=s=>packages.find(p=>p.id===s.packageId);
export const variantFor=s=>packageFor(s)?.variants.find(v=>v.id===s.variantId);
export const hoursValue=s=>s.hours==='Full day'?8:s.hours;
export const shootDays=s=>isPodcast(s)?Math.ceil(s.episodes/s.perDay):1;
export const availableExtras=s=>extras.filter(e=>isPhoto(s)?['rush','retouch','raw'].includes(e.id):!['retouch'].includes(e.id));
export function priceLines(s){
 if(!s.project)return [];
 const variant=variantFor(s);
 if(s.mode==='package'&&variant)return [{label:`${packageFor(s).title} · ${variant.label}${isPodcast(s)?` × ${s.episodes} episode${s.episodes===1?'':'s'}`:''}`,amount:variant.price*(isPodcast(s)?s.episodes:1)}];
 if(isPhoto(s)&&s.project==='Headshots'&&s.mode==='custom')return [{label:`${Math.max(8,s.subjects)} corporate headshots · minimum 8 people`,amount:Math.max(8,s.subjects)*650}];
 if(isPodcast(s))return [{label:`${s.episodes} episode${s.episodes===1?'':'s'} · ${s.cameras} camera${s.cameras===1?'':'s'} · recording & post`,amount:([0,6000,8500,11000][s.cameras])*s.episodes}];
 const hrs=hoursValue(s);
 if(isEditing(s))return [{label:hrs>=8?'Editing day allowance':`${Math.max(2,hrs)}-hour editing allowance`,amount:hrs>=8?5500:Math.max(2,hrs)*950}];
 const video=!isPhoto(s);
 const lines=[{label:video?(hrs>=8?'Lead videographer · day · camera kit included':`Lead videographer · ${Math.max(3,hrs)} hrs · camera kit included`):(hrs>=8?'Photography · 8-hour package':hrs===4?'Photography · half-day package':`Photography · ${Math.max(2,hrs)} hrs`),amount:video?(hrs>=8?11500:Math.max(3,hrs)*3500):(hrs>=8?11500:hrs===4?6500:Math.max(2,hrs)*2500)}];
 return lines;
}
export const total=s=>priceLines(s).reduce((sum,l)=>sum+l.amount,0);
export function equipment(s){
 if(isEditing(s))return ['Editing workstation','Colour & sound finishing'];
 const cameras=isPhoto(s)?1:s.cameras;
 const items=[`${cameras} camera${cameras===1?'':'s'}`,`${cameras} ${isPhoto(s)?'photographer':'camera operator'}${cameras===1?'':'s'}`,`${cameras} tripod${cameras===1?'':'s'}`];
 if(s.lighting)items.push('Lighting setup & modifiers');
 if(s.sound)items.push(isPodcast(s)?`${s.people} microphone${s.people===1?'':'s'} & audio recording`:'Sound recording & operator');
 if(s.gimbal)items.push('Gimbal setup');
 if(s.drone)items.push('Drone & pilot · permit review');
 if(s.teleprompter)items.push('Teleprompter');
 if(s.liveEdits)items.push('On-site editor & edit station');
 if(s.service==='Photo + video')items.push('Dedicated photographer & photo kit');
 return items;
}
export function scopeText(s){
 if(!s.project)return 'Build your production';
 const parts=[isPodcast(s)?`${s.people}-person podcast`:s.project];
 if(isPodcast(s))parts.push(`${s.episodes} ep · ${shootDays(s)} day${shootDays(s)===1?'':'s'}`);
 else if(!isEditing(s))parts.push(s.hours==='Full day'?'Full day':`${s.hours} hrs`);
 return parts.join(' · ');
}
export function narrative(s){
 if(!s.project)return 'Choose a service to get started.';
 if(isPodcast(s))return `${s.people===1?'Solo':`${s.people}-person`} podcast. ${s.episodes} episode${s.episodes===1?'':'s'}, ${s.cameras} camera${s.cameras===1?'':'s'}, recorded over ${shootDays(s)} day${shootDays(s)===1?'':'s'}.`;
 if(isEvent(s)&&!isPhoto(s))return `${s.eventOutput==='full'?'Full event recording':`${s.editLength} event highlight`}. ${s.hours==='Full day'?'Full-day':`${s.hours}-hour`} coverage in ${s.location}.`;
 return `${s.project}. ${isEditing(s)?`${hoursValue(s)}-hour editing allowance`:`${s.hours==='Full day'?'Full-day':`${s.hours}-hour`} shoot in ${s.location}`}.`;
}
export function reviewItems(s){
 if(!s.project)return [];
 const items=[];
 if(s.mode==='custom'&&!isPodcast(s)&&!isEditing(s))items.push('Editing, supporting crew & equipment priced in final quote');
 if(!isEditing(s)&&s.cameras>1)items.push('Additional cameras & crew availability');
 if(isPodcast(s)&&s.people>2)items.push('Additional audio channels');
 if(isPodcast(s)&&s.perDay*s.episodeMinutes>hoursValue(s)*60-60)items.push('Recording schedule needs more time for setup & breaks');
 if(s.location!=='Windhoek'&&!isEditing(s))items.push('Travel & accommodation');
 if(s.hours==='Full day')items.push('Exact day length & overtime');
 if(s.liveEdits)items.push('On-site editing');
 if(s.gimbal)items.push('Gimbal availability & hire');
 if(s.drone)items.push('Drone availability, permits & pilot');
 if(s.teleprompter)items.push('Teleprompter hire');
 if(s.mode==='custom'&&isEditing(s))items.push('Footage volume, runtime & edit complexity');
 for(const e of availableExtras(s))if(s.extras.includes(e.id))items.push(e.title);
 return [...new Set(items)];
}
export function change(s,key,value){
 let n={...s,[key]:value,complete:false};
 if(key==='service')n={...initial(),name:s.name,email:s.email,phone:s.phone,service:value};
 if(key==='project')n={...initial(),name:s.name,email:s.email,phone:s.phone,service:s.service,project:value,section:'shoot',subjects:value==='Headshots'?8:1,cameras:s.service==='Photo'?1:2,sound:s.service!=='Photo'};
 if(key==='framing'){
  n.cameras=value==='Direct to camera'?1:value==='Conversation'?2:3;
  if(value==='Direct to camera')n.people=1;
  else if(n.people===1)n.people=2;
 }
 if(key==='people')n.people=n.framing==='Direct to camera'?1:Math.max(2,Math.min(4,value));
 if(key==='episodes'){n.episodes=Math.max(1,Math.min(17,value));n.perDay=Math.min(n.perDay,n.episodes)}
 if(key==='perDay')n.perDay=Math.max(1,Math.min(n.episodes,value));
 if(key==='cameras')n.cameras=Math.max(1,Math.min(3,value));
 if(key==='eventOutput')n.editLength=value==='full'?'Full recording':'30 seconds';
 return n;
}
export function startPackage(id,variantId){
 const p=packages.find(p=>p.id===id);if(!p)return initial();const v=p.variants.find(v=>v.id===variantId)||p.variants[0];
 return {...initial(),mode:'package',packageId:p.id,variantId:v.id,service:p.service,project:p.project,section:'shoot',hours:v.hours||4,cameras:v.cameras||1,people:p.id==='podcast'&&v.cameras===1?1:2,framing:p.id==='podcast'&&v.cameras===1?'Direct to camera':v.cameras===3?'Full coverage':'Conversation',perDay:1,sound:p.service!=='Photo',liveEdits:p.id==='event'&&v.id==='premium',drone:p.id==='event'&&v.id==='premium',eventOutput:'highlight',editLength:p.id==='event'?'3 minutes':'60 seconds'};
}
export function restore(raw){
 if(!raw||typeof raw!=='object'||!projects[raw.service])return initial();
 let n=raw.mode==='package'&&packages.some(p=>p.id===raw.packageId)?startPackage(raw.packageId,raw.variantId):change(initial(),'service',raw.service);
 if(raw.mode!=='package'&&projects[raw.service].includes(raw.project))n=change(n,'project',raw.project);
 for(const[key,min,max]of[['subjects',1,200],['people',1,4],['episodes',1,17],['perDay',1,17],['episodeMinutes',15,180],['cameras',1,3]])if(Number.isInteger(raw[key])&&raw[key]>=min&&raw[key]<=max)n[key]=raw[key];
 if([2,3,4,6,7,8,'Full day'].includes(raw.hours))n.hours=raw.hours;
 if(['Direct to camera','Conversation','Full coverage'].includes(raw.framing))n.framing=raw.framing;
 if(isPhoto(n)&&n.project==='Headshots')n.subjects=Math.max(8,n.subjects);
 if(isPodcast(n)&&n.framing==='Direct to camera')n.people=1;
 n.perDay=Math.min(n.perDay,n.episodes);
 if(n.mode==='package'){const v=variantFor(n);n.cameras=v.cameras||1;n.hours=v.hours||n.hours}
 if(locations.includes(raw.location))n.location=raw.location;
 for(const key of['sound','lighting','liveEdits','gimbal','drone','teleprompter'])if(typeof raw[key]==='boolean')n[key]=raw[key];
 for(const key of['eventOutput','editLength','shootStyle'])if(typeof raw[key]==='string'&&raw[key].length<60)n[key]=raw[key];
 for(const key of['venue','date','name','email','phone','notes'])if(typeof raw[key]==='string')n[key]=raw[key].slice(0,key==='notes'?1500:150);
 n.extras=availableExtras(n).filter(e=>Array.isArray(raw.extras)&&raw.extras.includes(e.id)).map(e=>e.id);
 if(['project','shoot','equipment','delivery','review'].includes(raw.section))n.section=raw.section;
 return n;
}
export function briefText(s){
 const lines=['VISIONHAUS PRODUCTION REQUEST',`Name: ${s.name}`,`Email: ${s.email}`,`Phone: ${s.phone||'Not supplied'}`,'',s.mode==='package'?`Package: ${packageFor(s)?.title} / ${variantFor(s)?.label}`:'Custom production',narrative(s),`Location: ${s.location}${s.venue?` / ${s.venue}`:''}`,`Preferred date: ${s.date||'Flexible'}`];
 if(isPhoto(s)&&!isEvent(s))lines.push(`Subjects / products: ${s.subjects}`);
 if(isEditing(s))lines.push(`Finished runtime: ${s.editLength}`);
 if(isPodcast(s))lines.push(`Schedule: ${s.episodes} episodes / up to ${s.perDay} per day / ${shootDays(s)} recording days`,`Episode length: ${s.episodeMinutes} minutes`,`Time per day: ${s.hours} ${typeof s.hours==='number'?'hours':''}`);
 if(s.mode==='package')lines.push('','PACKAGE INCLUSIONS',...variantFor(s).features.map(x=>`- ${x}`));
 lines.push('','REQUESTED SETUP',...equipment(s).map(x=>`- ${x}`),'','EXTRAS',...availableExtras(s).filter(e=>s.extras.includes(e.id)).map(e=>`- ${e.title}`),'','PRICED ITEMS',...priceLines(s).map(l=>`${l.label}: N$ ${l.amount.toLocaleString('en-NA')}`),`Starting estimate: N$ ${total(s).toLocaleString('en-NA')} ex VAT`,'','TO QUOTE / CONFIRM',...reviewItems(s).map(x=>`- ${x}`),'',`Notes: ${s.notes||'None'}`,'','This is a quote request. Dates and final cost require confirmation.');
 return lines.join('\n');
}
