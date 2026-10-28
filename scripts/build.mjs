import {readFile,writeFile,mkdir,readdir,rm,copyFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const publicDir=path.join(root,'public');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const assets={};
async function scan(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await scan(file);else{const url='/'+path.relative(publicDir,file).split(path.sep).join('/');assets[url]={body:(await readFile(file)).toString('base64'),type:mime[path.extname(file)]||'application/octet-stream'}}}}
await scan(publicDir);
const dates=(await readFile('public/dates.mjs','utf8')).replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
const domain=(await readFile('public/domain.mjs','utf8')).replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
const rentals=(await readFile('public/rentals.mjs','utf8')).replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
const handler=(await readFile('worker/requests.mjs','utf8')).replace(/^import .*;\n/gm,'').replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
const zoho=(await readFile('worker/zoho.mjs','utf8')).replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
const source=`${dates}\n${domain}\n${rentals}\n${zoho}\n${handler}\nconst assets=${JSON.stringify(assets)};\nexport default {async fetch(request,env){const url=new URL(request.url);if(url.pathname==='/api/requests')return handleSubmission(request,env);if(url.pathname.startsWith('/api/zoho/')||['/zoho-connect','/zoho-connected'].includes(url.pathname))return handleZoho(request,env);if(url.pathname.startsWith('/api/'))return new Response('Not found',{status:404});if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});const asset=assets[url.pathname==='/'?'/index.html':url.pathname];if(!asset)return new Response('Not found',{status:404});const bytes=Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0));return new Response(request.method==='HEAD'?null:bytes,{headers:{'Content-Type':asset.type,'X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'}})}};\n`;
await rm('dist',{recursive:true,force:true});
await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});
await writeFile('dist/server/index.js',source);await copyFile('.openai/hosting.json','dist/.openai/hosting.json');
console.log(`Built Worker with ${Object.keys(assets).length} embedded assets.`);
