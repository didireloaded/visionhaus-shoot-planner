import {restore,briefText} from '../public/domain.mjs';
import {restoreRental,rentalErrors,rentalBrief} from '../public/rentals.mjs';

const RECIPIENT='didi@visionhausmedia.com.na';
const emailPattern=/^[^\s<>@\r\n]+@[^\s<>@\r\n]+\.[^\s<>@\r\n]+$/;
const safeLine=value=>String(value||'').replace(/[\r\n\u0000-\u001f]/g,' ').trim();
const json=(status,body)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const attempts=new Map();

// A bounded, per-worker abuse guard. Not a globally shared availability or request store.
function allowRequest(key){
 const now=Date.now();
 if(attempts.size>2000)for(const [ip,entry]of attempts)if(now-entry.start>600000)attempts.delete(ip);
 if(attempts.size>4000)attempts.clear();
 const entry=attempts.get(key);
 if(!entry||now-entry.start>600000){attempts.set(key,{start:now,count:1});return true}
 if(entry.count>=6)return false;
 entry.count++;return true;
}
export async function handleSubmission(request,env,send=fetch){
 const origin=new URL(request.url).origin;
 if(request.method!=='POST')return json(405,{error:'Use Submit to send your request.'});
 if(request.headers.get('Origin')!==origin)return json(403,{error:'Please submit from the VisionHaus app.'});
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json(415,{error:'Invalid request format.'});
 const length=Number(request.headers.get('Content-Length')||0);
 if(length>40000)return json(413,{error:'Your request is too long. Please shorten the notes.'});
 let raw;
 try{
  const reader=request.body?.getReader();if(!reader)return json(400,{error:'Your request is empty.'});
  const chunks=[];let size=0;
  for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>40000){await reader.cancel();return json(413,{error:'Your request is too long.'})}chunks.push(value)}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}
  raw=JSON.parse(new TextDecoder().decode(bytes));
 }catch{return json(400,{error:'Please check the request and try again.'})}
 if(!raw||!['production','rental'].includes(raw.type)||!raw.state||typeof raw.state!=='object')return json(400,{error:'Your request is incomplete.'});
 if(raw.website)return json(400,{error:'Please try again.'});
 if(typeof raw.requestId!=='string'||!/^vh-[a-f0-9]{64}$/.test(raw.requestId))return json(400,{error:'Please refresh the page and try submitting again.'});
 const name=safeLine(raw.state.name),email=safeLine(raw.state.email),phone=safeLine(raw.state.phone);
 if(name.length<2||name.length>100||email.length>150||!emailPattern.test(email)||phone.length>150)return json(400,{error:'Add your name and a valid email address.'});
 if(typeof raw.state.notes==='string'&&raw.state.notes.length>6000)return json(400,{error:'Please limit your notes to 6,000 characters.'});
 let state,brief;
 if(raw.type==='rental'){
  state=restoreRental(raw.state);
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Windhoek',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const errors=rentalErrors(state,today);
  if(errors.length)return json(400,{error:errors.join(' ')});
  if(raw.state.ack!==true)return json(400,{error:'Confirm that you understand this is a rental request.'});
  Object.assign(state,{name,email,phone});brief=rentalBrief(state);
 }else{
  state=restore(raw.state);
  if(!state.project)return json(400,{error:'Choose a service before submitting.'});
  Object.assign(state,{name,email,phone});brief=briefText(state);
 }
 // Server owns the recipient, sender, rate calculations and email body.
 if(!env.RESEND_API_KEY||!env.EMAIL_FROM)return json(503,{error:'Online submission is temporarily unavailable. Your draft is saved on this device. Please try again later.'});
 if(!allowRequest(request.headers.get('CF-Connecting-IP')||'anonymous'))return json(429,{error:'Too many attempts. Please wait a few minutes before trying again.'});
 const reference=`VH-${raw.requestId.slice(3,15).toUpperCase()}`;
 try{
  const response=await send('https://api.resend.com/emails',{
   method:'POST',headers:{'Authorization':`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':raw.requestId},
   body:JSON.stringify({from:env.EMAIL_FROM,to:[RECIPIENT],reply_to:email,subject:`${raw.type==='rental'?'Rental':'Production'} request · ${reference} · ${name}`,text:`New client request\nReference: ${reference}\nReply to this email to contact ${name}.\n\n${brief}`}),
   signal:AbortSignal.timeout(15000),
  });
  const result=await response.json().catch(()=>null);
  if(!response.ok||!result||typeof result.id!=='string')return json(502,{error:'The request could not be confirmed. Your draft is saved. Please try Submit again.'});
  return json(200,{ok:true,reference});
 }catch{return json(502,{error:'We could not confirm submission. Your draft is saved. Please try Submit again.'})}
}
