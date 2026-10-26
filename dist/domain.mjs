export const projects={Video:['Podcast','Social reel','Music video','Event recap','Interview','Commercial'],Photo:['Portraits','Headshots','Event photography','Product photography'],'Photo + video':['Event coverage','Brand content','Conference'],Editing:['Social reel edit','Podcast edit','Music video edit','Commercial edit']};
export const extras=[{id:'clips',title:'3 social cutdowns',description:'Short vertical edits',price:1200},{id:'captions',title:'Captions',description:'Styled subtitles',price:450},{id:'rush',title:'Priority delivery',description:'Schedule needs review',price:1500}];
export const initial=()=>({service:'',project:'',section:'project',people:2,episodes:1,hours:4,cameras:2,framing:'Conversation',location:'Windhoek',date:'',extras:[],name:'',email:'',complete:false});
export const isPodcast=s=>s.project==='Podcast';
export const isEditing=s=>s.service==='Editing';
export const isPhoto=s=>s.service==='Photo';
export function priceLines(s){
 if(!s.project)return [];
 const lines=[{label:isEditing(s)?'Editing base':'Production base',amount:isEditing(s)?2000:4500}];
 if(!isEditing(s)){
  lines.push({label:`${s.hours} hours on location`,amount:s.hours*500});
  if(!isPhoto(s)&&s.cameras>1)lines.push({label:`${s.cameras-1} additional camera kit${s.cameras>2?'s':''}`,amount:(s.cameras-1)*1200});
  if(isPodcast(s))lines.push({label:`Audio for ${s.people} people`,amount:s.people*250});
 }
 lines.push({label:isPhoto(s)?'Photo post-production':'Main edit',amount:1500});
 if(isPodcast(s)&&s.episodes>1)lines.push({label:`${s.episodes-1} additional episode edits`,amount:(s.episodes-1)*1500});
 for(const e of extras)if(s.extras.includes(e.id))lines.push({label:e.title,amount:e.price});
 return lines;
}
export const total=s=>priceLines(s).reduce((sum,l)=>sum+l.amount,0);
export function scopeText(s){
 if(!s.project)return s.service?`${s.service} · choose your project`:'Your production starts here';
 const parts=[isPodcast(s)?`${s.people}-person podcast`:s.project];
 if(isPodcast(s))parts.push(`${s.episodes} episode${s.episodes>1?'s':''}`);
 if(!isEditing(s))parts.push(`${s.hours} hrs`);
 if(isPodcast(s))parts.push(`${s.cameras} views`);
 if(s.extras.length)parts.push(`${s.extras.length} extra${s.extras.length>1?'s':''}`);
 return parts.join(' · ');
}
export function narrative(s){
 if(!s.project)return 'Choose a project to shape your production.';
 if(isPodcast(s))return `A ${s.people}-person podcast with ${s.cameras} camera angle${s.cameras>1?'s':''}, ${s.hours} hours on location and ${s.episodes} edited episode${s.episodes>1?'s':''}${s.extras.includes('clips')?', plus three social cutdowns':''}${s.extras.includes('captions')?' and captions':''}.`;
 return `${s.project}${isEditing(s)?' from your supplied footage':` in ${s.location}, with ${s.hours} hours on location`}${s.extras.length?` and ${s.extras.length} selected extra${s.extras.length>1?'s':''}`:''}.`;
}
export function reviewItems(s){
 if(!s.project)return [];
 const items=[isEditing(s)?'Footage volume & edit length':'Crew, lighting & final scope'];
 if(s.location!=='Windhoek'&&!isEditing(s))items.push('Travel & accommodation');
 if(s.extras.includes('rush'))items.push('Priority delivery availability');
 return items;
}
export function change(s,key,value){
 const n={...s,[key]:value,complete:false};
 if(key==='service')Object.assign(n,{project:'',section:'project',cameras:value==='Photo'?1:2,extras:[],people:2,episodes:1,framing:'Conversation'});
 if(key==='project')Object.assign(n,{people:2,episodes:1,framing:'Conversation',cameras:s.service==='Photo'?1:2,extras:[]});
 if(key==='framing')n.cameras=value==='Direct to camera'?1:value==='Conversation'?2:3;
 return n;
}
export function restore(raw){
 const clean=initial();
 if(!raw||typeof raw!=='object'||!projects[raw.service])return clean;
 clean.service=raw.service;clean.project=projects[raw.service].includes(raw.project)?raw.project:'';
 for(const [key,min,max]of[['people',1,4],['episodes',1,6],['cameras',1,3]])if(Number.isInteger(raw[key])&&raw[key]>=min&&raw[key]<=max)clean[key]=raw[key];
 if([2,4,8].includes(raw.hours))clean.hours=raw.hours;
 if(['project','shoot','delivery','review'].includes(raw.section)&&clean.project)clean.section=raw.section;
 if(['Windhoek','Swakopmund','Walvis Bay','Other / remote'].includes(raw.location))clean.location=raw.location;
 if(['Direct to camera','Conversation','Full coverage'].includes(raw.framing))clean.framing=raw.framing;
 if(typeof raw.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(raw.date))clean.date=raw.date;
 clean.extras=Array.isArray(raw.extras)?extras.filter(x=>raw.extras.includes(x.id)&&(!isPhoto(clean)||x.id==='rush')).map(x=>x.id):[];
 for(const key of['name','email'])if(typeof raw[key]==='string')clean[key]=raw[key].slice(0,150);
 return clean;
}
