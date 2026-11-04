import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {parseEnv} from 'node:util';
let localEnv={};try{localEnv=parseEnv(await readFile('.env.local','utf8'))}catch{}
import worker from '../dist/server/index.js';
const port=Number(process.env.PORT||4173);
http.createServer(async(req,res)=>{
 try{
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  const body=Buffer.concat(chunks);
  const request=new Request(`http://${req.headers.host}${req.url}`,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body})});
  const response=await worker.fetch(request,localEnv);
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500);res.end('Preview request failed.')}
}).listen(port,'0.0.0.0',()=>console.log(`VisionHaus preview on ${port}`));
