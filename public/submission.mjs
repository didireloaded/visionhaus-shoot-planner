// Preparation validates the brief; only provider acceptance completes submission.
export async function sendRequest(payload,send=fetch){
 const prepared=await send('/api/requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(10000)});
 const result=await prepared.json().catch(()=>null);
 if(!prepared.ok||!result?.reference||!result?.form?.access_key){
  const error=new Error('Request preparation failed');
  error.userMessage=typeof result?.error==='string'?result.error:'We could not prepare your request. Your draft is saved. Please try again.';
  throw error;
 }
 const response=await send('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(result.form),signal:AbortSignal.timeout(15000)});
 const acceptance=await response.json().catch(()=>null);
 if(!response.ok||acceptance?.success!==true){
  const error=new Error('Submission not confirmed');
  error.userMessage=response.status===429?'Too many attempts. Your draft is saved. Please wait a few minutes before trying again.':'We could not confirm submission. Your draft is saved. Please try Submit again.';
  throw error;
 }
 return result.reference;
}
