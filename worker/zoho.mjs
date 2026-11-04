import {priceLines,quoteOnly,packageInclusions,narrative,packageFor,variantFor,pendingExtras,equipment,isRetainer,retainerFor} from '../public/domain.mjs';
import {rentalLines,rentalItems} from '../public/rentals.mjs';
import {windhoekToday} from '../public/dates.mjs';

const zohoScopes='ZohoBooks.contacts.READ,ZohoBooks.contacts.CREATE,ZohoBooks.estimates.READ,ZohoBooks.estimates.CREATE,ZohoBooks.settings.READ';
const zohoHeaders={'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'};
const zohoJson=(status,body)=>Response.json(body,{status,headers:zohoHeaders});
const zohoHex=bytes=>Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');
async function zohoHash(value){return zohoHex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))}
async function zohoEqual(a,b){return !!a&&!!b&&(await zohoHash(a))===(await zohoHash(b))}
async function zohoKey(env){
 if(!/^[a-f0-9]{64}$/.test(env.ZOHO_TOKEN_KEY||''))throw new Error('Zoho encryption unavailable');
 return crypto.subtle.importKey('raw',Uint8Array.from(env.ZOHO_TOKEN_KEY.match(/../g),x=>parseInt(x,16)),{name:'AES-GCM'},false,['encrypt','decrypt']);
}
async function zohoSeal(value,env){
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},await zohoKey(env),new TextEncoder().encode(value));
 return zohoHex(iv)+':'+zohoHex(encrypted);
}
async function zohoUnseal(value,env){
 const [iv,cipher]=value.split(':').map(v=>Uint8Array.from(v.match(/../g),x=>parseInt(x,16)));
 return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv},await zohoKey(env),cipher));
}
async function zohoToken(env,fields,send){
 const response=await send('https://accounts.zoho.com/oauth/v2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:env.ZOHO_CLIENT_ID,client_secret:env.ZOHO_CLIENT_SECRET,...fields}),signal:AbortSignal.timeout(10000)});
 const data=await response.json();
 if(!response.ok||!data.access_token)throw new Error('Zoho authorization failed');
 return data;
}
async function zohoApi(env,token,path,options={},send=fetch){
 const url=new URL('https://www.zohoapis.com/books/v3/'+path);
 url.searchParams.set('organization_id',env.ZOHO_ORGANIZATION_ID);
 const response=await send(url.href,{...options,headers:{Authorization:`Zoho-oauthtoken ${token}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(10000)});
 const data=await response.json();
 // Never log Zoho responses: they can contain contacts, briefs, or credentials.
 if(!response.ok||data.code!==0)throw new Error('Zoho Books request failed');
 return data;
}
export async function zohoConnection(env){
 if(!env.DB||!env.ZOHO_CLIENT_ID||!env.ZOHO_CLIENT_SECRET||!env.ZOHO_TOKEN_KEY)return null;
 return env.DB.prepare('SELECT * FROM zoho_connection WHERE id = 1').first();
}
const zohoPage=(title,content)=>new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · VisionHaus</title><style>body{font:16px system-ui;background:#f5f6f8;color:#171717;max-width:560px;margin:12vh auto;padding:24px}input,button{font:inherit;padding:12px;border-radius:10px;border:1px solid #bbb;box-sizing:border-box;width:100%;margin:8px 0}button{background:#d9fa77;cursor:pointer}p{line-height:1.5}</style><h1>${title}</h1>${content}</html>`,{headers:{...zohoHeaders,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self' https://accounts.zoho.com; frame-ancestors 'none'; base-uri 'none'"}});

export async function handleZoho(request,env,send=fetch){
 const url=new URL(request.url);
 if(url.pathname==='/zoho-connect'&&request.method==='GET')return zohoPage('Connect Zoho Books','<p>Owner setup only. Connect VisionHaus Books to prepare draft quotations from client briefs. Customer contacts and quotations only; no bank, payment or invoice access.</p><form method="post" action="/api/zoho/connect"><label>Owner setup key<input type="password" name="key" required autocomplete="off"></label><button>Continue to Zoho</button></form>');
 if(url.pathname==='/api/zoho/status'){
  if(!await zohoEqual(request.headers.get('Authorization'),`Bearer ${env.ZOHO_SETUP_KEY||''}`)||!env.ZOHO_SETUP_KEY)return zohoJson(403,{error:'Owner access required.'});
  const connection=await zohoConnection(env);
  return zohoJson(200,{connected:!!connection,organization:connection?.organization_name||null});
 }
 if(url.pathname==='/api/zoho/connect'){
  if(request.method!=='POST')return zohoJson(405,{error:'Use the owner connection form.'});
  // Privacy-preserving form navigations can send Origin: null. The high-entropy
  // owner key is the authorization boundary; no existing cookie grants setup.
  const origin=request.headers.get('Origin');
  if(origin&&origin!=='null'&&origin!==url.origin)return zohoJson(403,{error:'Open the owner connection form.'});
  if(Number(request.headers.get('Content-Length')||0)>512)return zohoJson(413,{error:'Invalid setup key.'});
  const body=await request.text();if(body.length>512)return zohoJson(413,{error:'Invalid setup key.'});
  if(!env.DB||!env.ZOHO_SETUP_KEY||!await zohoEqual(new URLSearchParams(body).get('key'),env.ZOHO_SETUP_KEY))return zohoJson(403,{error:'Owner access required.'});
  if(await zohoConnection(env))return zohoPage('Zoho Books is connected','<p>Client submissions prepare draft quotations in your existing Books organisation. Review and send them from Zoho Books.</p>');
  const nonce=zohoHex(crypto.getRandomValues(new Uint8Array(32)));
  await env.DB.prepare('DELETE FROM zoho_oauth_states WHERE expires_at < ?').bind(Date.now()).run();
  await env.DB.prepare('INSERT INTO zoho_oauth_states (nonce,expires_at) VALUES (?,?)').bind(nonce,Date.now()+600000).run();
  const auth=new URL('https://accounts.zoho.com/oauth/v2/auth');
  auth.search=new URLSearchParams({scope:zohoScopes,client_id:env.ZOHO_CLIENT_ID,response_type:'code',access_type:'offline',prompt:'consent',redirect_uri:url.origin+'/api/zoho/callback',state:nonce}).toString();
  return new Response(null,{status:303,headers:{...zohoHeaders,Location:auth.href,'Set-Cookie':`__Host-vh-zoho-state=${nonce}; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=600`}});
 }
 if(url.pathname==='/api/zoho/callback'&&request.method==='GET'){
  const state=url.searchParams.get('state');
  const cookie=request.headers.get('Cookie')?.match(/(?:^|;\s*)__Host-vh-zoho-state=([a-f0-9]{64})(?:;|$)/)?.[1];
  if(!env.DB||!state||!await zohoEqual(state,cookie))return zohoJson(403,{error:'Connection expired. Use the owner setup form again.'});
  const valid=await env.DB.prepare('DELETE FROM zoho_oauth_states WHERE nonce = ? AND expires_at > ? RETURNING nonce').bind(state,Date.now()).first();
  if(!valid)return zohoJson(403,{error:'Connection expired. Use the owner setup form again.'});
  if(url.searchParams.has('error')||!url.searchParams.get('code'))return zohoPage('Connection cancelled','<p>No access was granted. You can start again from the owner setup form.</p>');
  try{
   const token=await zohoToken(env,{grant_type:'authorization_code',code:url.searchParams.get('code'),redirect_uri:url.origin+'/api/zoho/callback'},send);
   if(!token.refresh_token)throw new Error('Offline access unavailable');
   const data=await zohoApi(env,token.access_token,'organizations',{},send);
   const organization=data.organizations?.find(o=>o.organization_id===env.ZOHO_ORGANIZATION_ID);
   if(!organization||organization.currency_code!=='NAD'||!organization.currency_id)throw new Error('VisionHaus NAD organisation required');
   await env.DB.prepare('INSERT INTO zoho_connection (id,refresh_token,organization_name,currency_id,connected_at) VALUES (1,?,?,?,?)').bind(await zohoSeal(token.refresh_token,env),organization.name,organization.currency_id,Date.now()).run();
   return new Response(null,{status:303,headers:{...zohoHeaders,Location:'/zoho-connected','Set-Cookie':'__Host-vh-zoho-state=; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'}});
  }catch{return zohoPage('Connection needs attention','<p>Zoho could not confirm the existing VisionHaus organisation and NAD currency. No live submission flow has changed. Please restart owner setup or check the Books organisation settings.</p>')}
 }
 if(url.pathname==='/zoho-connected'&&request.method==='GET')return zohoPage('Zoho Books connected','<p>The quotation connection is ready. Client briefs will prepare draft quotations in Books for VisionHaus to review and send. No invoices or payments are created.</p><a href="/">Return to VisionHaus</a>');
 return zohoJson(404,{error:'Not found.'});
}

export function zohoCustomer(state,currencyId){
 const name=state.name.trim(),company=(state.company||'').trim();
 const parts=name.split(/\s+/),first=parts.shift(),last=parts.join(' ');
 return {contact_name:company||name,company_name:company,contact_type:'customer',customer_sub_type:company?'business':'individual',currency_id:currencyId,
  billing_address:{attention:name,address:state.billingAddress||'',phone:state.phone||''},
  contact_persons:[{first_name:first,last_name:last,email:state.email,phone:state.phone||'',is_primary_contact:true}]};
}
export function zohoEstimate(type,state,brief,reference,customerId,taxId){
 const sourceLines=type==='production'?priceLines(state):[];
 const inclusive=type==='production'&&sourceLines.length>0&&sourceLines.every(l=>l.taxInclusive);
 const scope=type==='production'?[narrative(state),state.mode==='package'?`${packageFor(state)?.title} / ${variantFor(state)?.label}`:'',...packageInclusions(state),...(isRetainer(state)?[`${retainerFor(state).title} monthly retainer · up to ${retainerFor(state).hours} production hours per month. Minimum 3 months; monthly payment in advance.`,`Monthly deliverables agreed within capacity; video and photo maxima are not cumulative entitlements. Events use monthly production hours.`,`Up to 20% of unused hours rolls over for one month. Organic social and website use. Travel within 25 km of central Windhoek included; third-party costs and other usage rights quoted separately.`]:[]),`Requested setup: ${equipment(state).join('; ')}. Subject to agreed scope and availability.`,`Location: ${state.location}${state.venue?' / '+state.venue:''}`,`Preferred date: ${state.date||'Flexible'}`].filter(Boolean).join('\n'):'';
 const lines=type==='rental'?rentalLines(state).map(l=>({name:l.title,description:`${rentalItems.find(i=>i.id===l.id)?.description||''}\n${l.qty} item(s) × ${l.units} ${state.period==='week'?'week(s)':state.period==='half'?'half-day period(s)':'day(s)'}\nHire: ${state.start} to ${state.end} · ${state.fulfilment}`,quantity:l.qty*l.units,rate:l.rate})):sourceLines.map((l,i)=>({name:l.label,description:i===0&&!quoteOnly(state)?scope:l.label,quantity:l.quantity||1,rate:(!inclusive&&l.taxInclusive?Math.round(l.amount/1.15*1000000)/1000000:l.amount)/(l.quantity||1)}));
 if(type==='production'&&quoteOnly(state))lines.unshift({name:state.project,description:scope+'\nService scope and price to be agreed.',quantity:1,rate:0});
 for(const line of lines)if(taxId)line.tax_id=taxId;
 const exclusions=type==='production'?pendingExtras(state).map(e=>e.title):[];
 const notes=type==='rental'?'Equipment hire. Delivery, insurance and security deposit are quoted separately.':exclusions.length?`Requested separately: ${exclusions.join(', ')}. These services are excluded from the total; scope and price will be agreed separately.`:'Thank you for considering VisionHaus.';
 return {customer_id:customerId,reference_number:reference,date:windhoekToday(),is_inclusive_tax:inclusive,line_items:lines.length?lines:[{name:state.project||'Requested service',description:scope+'\nScope and price to be agreed.',quantity:1,rate:0}],notes,terms:'Quotation subject to agreed scope and availability. Booking requires VisionHaus approval and the agreed deposit. Please use the quotation number as your payment reference.'};
}

// D1 owns deduplication and a lease across Worker instances. A stale lease is
// reconciled against the full external reference before attempting another write.
export async function createZohoQuote(request,env,connection,type,state,brief,send=fetch){
 const canonical={...state};delete canonical.section;delete canonical.step;delete canonical.complete;
 for(const key of ['company','billingAddress'])if(!canonical[key])delete canonical[key];
 const id=await zohoHash(JSON.stringify({type,state:canonical}));
 let reference;
 const now=Date.now();
 const existing=await env.DB.prepare('SELECT * FROM quote_requests WHERE id = ?').bind(id).first();
 if(existing?.estimate_id)return {reference:existing.reference,accepted:true};
 const bucket=await zohoHash(`${env.ZOHO_TOKEN_KEY}:${request.headers.get('CF-Connecting-IP')||'anonymous'}:${Math.floor(now/600000)}`);
 const limit=await env.DB.prepare('INSERT INTO quote_rate_limits (bucket,attempts,expires_at) VALUES (?,1,?) ON CONFLICT(bucket) DO UPDATE SET attempts = attempts + 1 RETURNING attempts').bind(bucket,now+600000).first();
 if(limit.attempts>6)throw new Error('Quote rate limit');
 await env.DB.prepare('DELETE FROM quote_rate_limits WHERE expires_at < ?').bind(now).run();
 if(existing)reference=existing.reference;
 else{
  await env.DB.prepare('INSERT INTO quote_sequences (request_id) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM quote_sequences WHERE request_id = ?)').bind(id,id).run();
  const row=await env.DB.prepare('SELECT sequence FROM quote_sequences WHERE request_id = ?').bind(id).first();
  const label=(state.company||state.name).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,24)||'Client';
  reference=`VH-${label}-${String(row.sequence).padStart(3,'0')}`;
 }
 await env.DB.prepare('INSERT OR IGNORE INTO quote_requests (id,reference,brief,created_at) VALUES (?,?,?,?)').bind(id,reference,brief,now).run();
 const lease=await env.DB.prepare("UPDATE quote_requests SET lease_until = ?, status = 'processing' WHERE id = ? AND estimate_id IS NULL AND lease_until < ? RETURNING *").bind(now+120000,id,now).first();
 if(!lease)throw new Error('Quote processing; retry shortly');
 try{
  const token=await zohoToken(env,{grant_type:'refresh_token',refresh_token:await zohoUnseal(connection.refresh_token,env)},send);
  const api=(path,options)=>zohoApi(env,token.access_token,path,options,send);
  // Always reconcile first, including an API success followed by a lost response.
  const lookup=await api('estimates?reference_number='+encodeURIComponent(reference));
  const match=lookup.estimates?.find(e=>e.reference_number===reference);
  let estimateId=match?.estimate_id;
  if(!estimateId){
   let customerId=lease.customer_id;
   if(!customerId){
    const contacts=await api('contacts?email='+encodeURIComponent(state.email));
    const contact=contacts.contacts?.find(c=>((c.company_name||'').toLowerCase()===(state.company||'').toLowerCase())&&c.contact_type==='customer'&&c.status!=='inactive'&&c.email?.toLowerCase()===state.email.toLowerCase()&&(!c.currency_id||c.currency_id===connection.currency_id));
    customerId=contact?.contact_id;
    if(!customerId){
     const created=await api('contacts',{method:'POST',body:JSON.stringify(zohoCustomer(state,connection.currency_id))});
     customerId=created.contact?.contact_id;
    }
    if(!customerId)throw new Error('Zoho customer unavailable');
    await env.DB.prepare('UPDATE quote_requests SET customer_id = ? WHERE id = ?').bind(customerId,id).run();
   }
   // Use the organisation's existing Sales VAT, verified by ID and percentage.
   const taxes=await api('settings/taxes');
   const vat=taxes.taxes?.find(t=>t.tax_id===env.ZOHO_SALES_VAT_ID&&Number(t.tax_percentage)===15);
   if(!vat)throw new Error('Configured Sales VAT unavailable');
   const quote=zohoEstimate(type,state,brief,reference,customerId,vat.tax_id);
   const result=await api('estimates',{method:'POST',body:JSON.stringify(quote)});
   estimateId=result.estimate?.estimate_id;
   if(!estimateId)throw new Error('Zoho draft unavailable');
  }
  await env.DB.prepare("UPDATE quote_requests SET estimate_id = ?, status = 'draft', lease_until = 0 WHERE id = ?").bind(estimateId,id).run();
  return {reference,accepted:true};
 }catch{
  // Keep the lease after uncertain remote writes, so retries cannot immediately
  // create another quote while Zoho is finishing the original API request.
  await env.DB.prepare("UPDATE quote_requests SET status = 'retry' WHERE id = ?").bind(id).run();
  throw new Error('Zoho draft not confirmed');
 }
}
