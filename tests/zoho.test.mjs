import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFile} from 'node:fs/promises';
import {handleZoho,zohoConnection,zohoEstimate,zohoCustomer,createZohoQuote} from '../worker/zoho.mjs';
import {startPackage,briefText,change,initial} from '../public/domain.mjs';
import {rentalInitial,setRentalQty} from '../public/rentals.mjs';
import {sendRequest} from '../public/submission.mjs';

// Exercise real SQLite migration/constraints and SQL, with D1's async call shape.
const db=new DatabaseSync(':memory:');db.exec(await readFile(new URL('../drizzle/0000_zoho_quotes.sql',import.meta.url),'utf8'));
db.exec(await readFile(new URL('../drizzle/0001_quote_sequences.sql',import.meta.url),'utf8'));
const DB={prepare(sql){let values=[];const stmt=db.prepare(sql);return {bind(...v){values=v;return this},async first(){return stmt.get(...values)||null},async run(){return stmt.run(...values)}}}};
const env={DB,ZOHO_SETUP_KEY:'test-owner-key',ZOHO_CLIENT_ID:'test-client',ZOHO_CLIENT_SECRET:'test-secret',ZOHO_TOKEN_KEY:'a'.repeat(64),ZOHO_ORGANIZATION_ID:'904412165',ZOHO_SALES_VAT_ID:'sales-vat-15'};
const base='https://visionhaus.example';
let calls=[],estimates=[],contactCreated=0,failAfterCreate=false;
const mock=async(url,options={})=>{
 calls.push({url,options});
 if(url.includes('/oauth/v2/token'))return Response.json({access_token:'access',refresh_token:'private-refresh-token'});
 const u=new URL(url);assert.equal(u.origin,'https://www.zohoapis.com');assert.equal(u.searchParams.get('organization_id'),env.ZOHO_ORGANIZATION_ID);
 assert.equal(options.headers.Authorization,'Zoho-oauthtoken access');
 const resource=u.pathname.split('/').at(-1);
 if(resource==='organizations')return Response.json({code:0,organizations:[{organization_id:env.ZOHO_ORGANIZATION_ID,name:'VisionHaus',currency_code:'NAD',currency_id:'currency-nad'}]});
 if(resource==='taxes')return Response.json({code:0,taxes:[{tax_id:'sales-vat-15',tax_percentage:15}]});
 if(resource==='contacts'&&options.method==='POST'){contactCreated++;return Response.json({code:0,contact:{contact_id:'customer-1'}})}
 if(resource==='contacts')return Response.json({code:0,contacts:contactCreated?[{contact_id:'customer-1',contact_type:'customer',email:'client@example.com',currency_id:'currency-nad'}]:[]});
 if(resource==='estimates'&&options.method==='POST'){
  const quote=JSON.parse(options.body);assert.equal(quote.customer_id,'customer-1');assert.doesNotMatch(quote.notes,/REVIEW REQUIRED|VISIONHAUS PRODUCTION REQUEST/);assert.equal(quote.send,undefined);
  const created={...quote,estimate_id:'estimate-'+(estimates.length+1)};estimates.push(created);
  if(failAfterCreate){failAfterCreate=false;throw new Error('Lost response')}
  return Response.json({code:0,estimate:created});
 }
 if(resource==='estimates')return Response.json({code:0,estimates:estimates.filter(e=>e.reference_number===u.searchParams.get('reference_number'))});
 throw new Error('Unexpected Zoho call');
};
assert.equal(await zohoConnection(env),null);
assert.equal((await handleZoho(new Request(base+'/api/zoho/status'),env,mock)).status,403);
const begin=(key=env.ZOHO_SETUP_KEY,origin=base)=>new Request(base+'/api/zoho/connect',{method:'POST',headers:{Origin:origin},body:new URLSearchParams({key})});
assert.equal((await handleZoho(begin('wrong'),env,mock)).status,403);
assert.equal((await handleZoho(begin(env.ZOHO_SETUP_KEY,'https://evil.example'),env,mock)).status,403);
let response=await handleZoho(begin(),env,mock);assert.equal(response.status,303);
assert.equal((await handleZoho(begin(env.ZOHO_SETUP_KEY,'null'),env,mock)).status,303,'Privacy-preserving owner forms still require the setup key');
const auth=new URL(response.headers.get('Location')),nonce=auth.searchParams.get('state');
assert.equal(auth.origin,'https://accounts.zoho.com');assert.match(auth.searchParams.get('scope'),/estimates.CREATE/);assert.doesNotMatch(auth.href,/invoices|bank|payments|.ALL/);
const callback=()=>new Request(base+'/api/zoho/callback?code=auth-code&state='+nonce,{headers:{Cookie:'__Host-vh-zoho-state='+nonce}});
assert.equal((await handleZoho(new Request(callback().url),env,mock)).status,403,'Callback requires matching browser session');
response=await handleZoho(callback(),env,mock);assert.equal(response.status,303);assert.equal(response.headers.get('Location'),'/zoho-connected');
const connection=await zohoConnection(env);assert.ok(connection);assert.doesNotMatch(connection.refresh_token,/private-refresh-token/,'Refresh token is encrypted at rest');
assert.equal((await handleZoho(callback(),env,mock)).status,403,'Authorization state is single use');
assert.equal((await handleZoho(begin(),env,mock)).status,200,'Existing connection cannot be replaced');

const state={...startPackage('podcast','two'),episodes:3,extras:['rush'],name:'Test Client',email:'client@example.com',phone:'',notes:'Please review this brief.'};
const request=new Request(base+'/api/requests',{headers:{'CF-Connecting-IP':'test-ip'}});
let result=await createZohoQuote(request,env,connection,'production',state,briefText(state),mock);assert.equal(result.accepted,true);
assert.equal(estimates.length,1);assert.equal(contactCreated,1);
assert.equal(estimates[0].line_items.reduce((sum,l)=>sum+l.rate*l.quantity,0),30000);assert.equal(estimates[0].is_inclusive_tax,true);
assert.doesNotMatch(estimates[0].notes,/Please review this brief/);assert.match(estimates[0].line_items[0].description,/fully edited episodes/);assert.equal(result.reference,'VH-Test-Client-001');
const before=calls.length;
assert.deepEqual(await createZohoQuote(request,env,connection,'production',{...state,section:'review'},briefText(state),mock),result);assert.equal(calls.length,before,'Duplicate submission makes no external writes');

const changed={...state,notes:'Different request'};failAfterCreate=true;
await assert.rejects(createZohoQuote(request,env,connection,'production',changed,briefText(changed),mock),/not confirmed/);
assert.equal(estimates.length,2);
await assert.rejects(createZohoQuote(request,env,connection,'production',changed,briefText(changed),mock),/processing/,'An uncertain remote write keeps its lease');
db.exec('UPDATE quote_requests SET lease_until = 0');
result=await createZohoQuote(request,env,connection,'production',changed,briefText(changed),mock);assert.equal(result.accepted,true);assert.equal(estimates.length,2,'Recover an uncertain write by reference without another quote');
assert.equal(contactCreated,1,'Reuse the existing email-matched NAD customer');

const concurrent={...state,notes:'Concurrent submit'};
const parallel=await Promise.allSettled([createZohoQuote(request,env,connection,'production',concurrent,briefText(concurrent),mock),createZohoQuote(request,env,connection,'production',concurrent,briefText(concurrent),mock)]);
assert.equal(parallel.filter(x=>x.status==='fulfilled').length,1);assert.equal(estimates.length,3,'A database lease prevents concurrent duplicate quotations');

const custom=change(change(initial(),'service','Video'),'project','Crew hire');
const unknown=zohoEstimate('production',custom,'Full brief','VH-TEST','customer-1');assert.equal(unknown.line_items[0].rate,0);assert.match(unknown.line_items[0].description,/price to be agreed/);
const extras=zohoEstimate('production',{...startPackage('reels','outdoor'),extras:['captions']},'Brief','VH-TEST','customer-1');assert.equal(extras.line_items[0].rate,1565.217391);assert.equal(extras.line_items[1].rate,1800);assert.equal(extras.is_inclusive_tax,false);assert.ok(!extras.notes.includes('To confirm: Captions'));
const rental={...setRentalQty(rentalInitial(),'fx3',1),start:'2099-01-01',end:'2099-01-02'};
const equipment=zohoEstimate('rental',rental,'Rental brief','VH-TEST','customer-1');assert.equal(equipment.line_items[0].rate,3000);assert.equal(equipment.line_items[0].quantity,2);assert.equal(equipment.is_inclusive_tax,false);

const accepted={accepted:true,reference:'VH-ACCEPTED',form:{access_key:'notification-key'}};
assert.equal(await sendRequest({},async url=>{if(url==='/api/requests')return Response.json(accepted);throw new Error('Notification offline')}),'VH-ACCEPTED','Notification failure cannot undo an accepted quote');
assert.equal(await sendRequest({},async()=>Response.json({accepted:true,reference:'VH-ACCEPTED'})),'VH-ACCEPTED');
await assert.rejects(sendRequest({},async()=>Response.json({reference:'VH-NO',accepted:false})),/preparation failed/);
assert.ok(calls.every(c=>!c.url.includes('/email')&&!c.url.includes('/invoices')&&!c.url.includes('/payments')),'Draft-only flow never sends a quote, invoices, or charges a client');
const person=zohoCustomer({...state,name:'Test Client'},'nad');assert.equal(person.contact_name,'Test Client');assert.equal(person.customer_sub_type,'individual');
const business=zohoCustomer({...state,company:'Example CC',billingAddress:'Windhoek'},'nad');assert.equal(business.contact_name,'Example CC');assert.equal(business.billing_address.attention,'Test Client');assert.equal(business.contact_persons[0].last_name,'Client');
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM quote_sequences').get().n,3,'Retries and concurrent duplicates keep one sequence per request');
assert.equal(new Set(estimates.map(e=>e.reference_number)).size,3);
const nextRequest=new Request(base+'/api/requests',{headers:{'CF-Connecting-IP':'another-test-ip'}});
const unique=await Promise.all([createZohoQuote(nextRequest,env,connection,'production',{...state,name:'Company Alpha',notes:'Unique alpha'},'alpha',mock),createZohoQuote(nextRequest,env,connection,'production',{...state,name:'Company Beta',notes:'Unique beta'},'beta',mock)]);
assert.deepEqual(unique.map(x=>Number(x.reference.split('-').at(-1))).sort(),[4,5],'Concurrent distinct requests receive consecutive global numbers without duplicate retry gaps');
const legacy={...state,notes:'Legacy retry'};const canonical={...legacy};delete canonical.section;delete canonical.complete;delete canonical.company;delete canonical.billingAddress;
const legacyId=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify({type:'production',state:canonical})))).toString('hex');
db.prepare('INSERT INTO quote_requests (id,reference,brief,created_at,estimate_id) VALUES (?,?,?,?,?)').run(legacyId,'VH-OLD-HASH','Legacy brief',0,'legacy-estimate');
assert.equal((await createZohoQuote(nextRequest,env,connection,'production',{...legacy,company:'',billingAddress:''},'Legacy brief',mock)).reference,'VH-OLD-HASH','New empty contact fields preserve historic deduplication');
db.close();
console.log('Zoho: real migration SQL, owner-only setup, scoped OAuth, session/state/replay protection, encrypted refresh token, server prices, rental/custom scope, durable deduplication/concurrency, uncertain-write recovery, and provider failures passed.');
