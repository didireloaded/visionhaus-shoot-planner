import {windhoekToday} from '../public/dates.mjs';
import {restore,briefText,productionErrors} from '../public/domain.mjs';
import {restoreRental,rentalErrors,rentalBrief} from '../public/rentals.mjs';
import {zohoConnection,createZohoQuote} from './zoho.mjs';

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
export async function handleSubmission(request,env){
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
 if(!raw||!['production','rental'].includes(raw.type)||!raw.state||typeof raw.state!=='object'||Array.isArray(raw.state))return json(400,{error:'Your request is incomplete.'});
 if(raw.website)return json(400,{error:'Please try again.'});
 if(typeof raw.requestId!=='string'||!/^vh-[a-f0-9]{64}$/.test(raw.requestId))return json(400,{error:'Please refresh the page and try submitting again.'});
 if(typeof raw.state.name!=='string'||typeof raw.state.email!=='string')return json(400,{error:'Add your name and a valid email address.'});
 const name=safeLine(raw.state.name),email=safeLine(raw.state.email),phone=safeLine(raw.state.phone),company=safeLine(raw.state.company),billingAddress=safeLine(raw.state.billingAddress);
 if(company.length>100||billingAddress.length>150)return json(400,{error:'Please shorten the company name or billing address.'});
 if(name.length<2||name.length>100||email.length>150||!emailPattern.test(email)||phone.length>150)return json(400,{error:'Add your name and a valid email address.'});
 if(typeof raw.state.notes==='string'&&raw.state.notes.length>6000)return json(400,{error:'Please limit your notes to 6,000 characters.'});
 let state,brief;
 if(raw.type==='rental'){
  state=restoreRental(raw.state);
  const today=windhoekToday();
  const errors=rentalErrors(state,today);
  if(errors.length)return json(400,{error:errors.join(' ')});
  if(raw.state.ack!==true)return json(400,{error:'Confirm that you understand this is a rental request.'});
  Object.assign(state,{name,email,phone,company,billingAddress});brief=rentalBrief(state);
 }else{
  state=restore(raw.state);
  const errors=productionErrors(state);
  if(errors.length)return json(400,{error:errors.join(' ')});
  Object.assign(state,{name,email,phone,company,billingAddress});brief=briefText(state);
 }
 // Prepare validated fields. Web3Forms free-plan sends must originate in the browser.
 // The public form access key routes to its configured inbox.
 if(!allowRequest(request.headers.get('CF-Connecting-IP')||'anonymous'))return json(429,{error:'Too many attempts. Please wait a few minutes before trying again.'});
 let reference=`VH-${raw.requestId.slice(3,15).toUpperCase()}`,accepted=false;
 try{
  const connection=await zohoConnection(env);
  if(connection){const quote=await createZohoQuote(request,env,connection,raw.type,state,brief);reference=quote.reference;accepted=quote.accepted}
 }catch{return json(503,{error:'We could not confirm your quotation request yet. Your draft is saved. Please wait two minutes and try Submit again.'})}
 if(!accepted&&!env.WEB3FORM_ACCESS_KEY)return json(503,{error:'Online submission is temporarily unavailable. Your draft is saved on this device. Please try again later.'});
 return json(200,{reference,...(accepted?{accepted:true}:{}),...(env.WEB3FORM_ACCESS_KEY?{form:{access_key:env.WEB3FORM_ACCESS_KEY,name,email,phone,subject:`${raw.type==='rental'?'Rental':'Production'} request · ${reference} · ${name}`,message:`New client request\nReference: ${reference}\n${accepted?'Draft quotation is ready in Zoho Books. Review scope, tax and pricing before sending.\n':''}Reply to this email to contact ${name}.\n\n${brief}`,botcheck:false}}:{})});
}
