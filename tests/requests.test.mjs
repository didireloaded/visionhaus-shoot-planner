import assert from 'node:assert/strict';
import {handleSubmission} from '../worker/requests.mjs';
import {sendRequest} from '../public/submission.mjs';
import {initial,change} from '../public/domain.mjs';
import {rentalInitial,setRentalQty} from '../public/rentals.mjs';
let seq=0;
const key='vh-'+'a'.repeat(64);
const env={WEB3FORM_ACCESS_KEY:'test-public-form-key'};
let production=change(change(initial(),'service','Video'),'project','Podcast');production={...production,name:'Test Client',email:'client@example.com',notes:'A podcast brief',total:1};
function request(state=production,type='production',headers={}){return new Request('https://visionhaus.example/api/requests',{method:'POST',headers:{Origin:'https://visionhaus.example','Content-Type':'application/json','CF-Connecting-IP':`test-${seq++}`,...headers},body:JSON.stringify({type,state,requestId:key})})}
let r=await handleSubmission(request(),{});assert.equal(r.status,503,'Missing configuration must not claim success');
r=await handleSubmission(request(),env);assert.equal(r.status,200);let prepared=await r.json();assert.equal(prepared.ok,undefined,'Preparation is not submission');assert.equal(prepared.form.access_key,env.WEB3FORM_ACCESS_KEY);assert.equal(prepared.form.email,'client@example.com');assert.match(prepared.form.message,/8,500/,'Server must calculate prices, ignoring client total');assert.match(prepared.form.message,/A podcast brief/);assert.equal(prepared.form.botcheck,false);assert.ok(prepared.reference);assert.equal(prepared.form.to,undefined);
const payload={type:'production',state:production,requestId:key};
let calls=0,captured;
const provider=async(url,options)=>{calls++;if(url==='/api/requests')return handleSubmission(request(),env);captured={url,body:JSON.parse(options.body)};return Response.json({success:true})};
assert.equal(await sendRequest(payload,provider),prepared.reference);assert.equal(calls,2);assert.equal(captured.url,'https://api.web3forms.com/submit');assert.deepEqual(captured.body,prepared.form);
for(const response of [Response.json({success:false}),Response.json({success:'true'}),Response.json({success:true},{status:400}),new Response('invalid json'),Response.json({success:false},{status:429})]){
 await assert.rejects(sendRequest(payload,async url=>url==='/api/requests'?Response.json(prepared):response),/Submission not confirmed/);
}
await assert.rejects(sendRequest(payload,async url=>{if(url==='/api/requests')return Response.json(prepared);throw new Error('network failure')}),/network failure/);
let providerCalled=false;
await assert.rejects(sendRequest(payload,async url=>{if(url==='/api/requests')return Response.json({error:'Unavailable'},{status:503});providerCalled=true}),/preparation failed/);assert.equal(providerCalled,false);
r=await handleSubmission(request({...production,email:'invalid'}),env);assert.equal(r.status,400);
r=await handleSubmission(request(production,'production',{Origin:'https://evil.example'}),env);assert.equal(r.status,403);
r=await handleSubmission(new Request('https://visionhaus.example/api/requests'),env);assert.equal(r.status,405);
let rental=setRentalQty(rentalInitial(),'fx3',1);rental={...rental,start:'2099-11-01',end:'2099-11-02',name:'Rental Client',email:'rental@example.com',ack:true};
r=await handleSubmission(request(rental,'rental'),env);assert.equal(r.status,200);prepared=await r.json();assert.match(prepared.form.message,/6,000/);assert.equal(prepared.form.email,'rental@example.com');
r=await handleSubmission(request({...rental,ack:false},'rental'),env);assert.equal(r.status,400);
r=await handleSubmission(request({...rental,end:'2099-10-01'},'rental'),env);assert.equal(r.status,400);
for(let i=0;i<6;i++){r=await handleSubmission(request(production,'production',{'CF-Connecting-IP':'limited-test'}),env);assert.equal(r.status,200)}r=await handleSubmission(request(production,'production',{'CF-Connecting-IP':'limited-test'}),env);assert.equal(r.status,429);
console.log('Web3Forms preparation validates origin/contact/dates and server pricing; browser submission requires provider acceptance, preserves errors, and never succeeds without configuration.');
