import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
const root=resolve(process.env.SITE_ROOT||'dist');
const routes={'/trust':'trust.html','/data-notice':'data-notice.html','/':'index.html','/services':'anthroprime_services.html','/practices':'practices.html','/growth-advisor':'strategic-growth-advisor.html','/contact':'contact.html','/data':'data.html','/cybersecurity':'cybersecurity.html','/cloud':'cloud.html','/infrastructure':'infrastructure.html','/artificial-intelligence':'artificial-intelligence.html'};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.ico':'image/x-icon','.woff2':'font/woff2','.json':'application/json','.xml':'application/xml','.txt':'text/plain'};
const responseHeaders=process.env.SITE_ROOT?{}:Object.fromEntries([...readFileSync('netlify.toml','utf8').split('[headers.values]')[1].matchAll(/^\s+([A-Za-z-]+) = "([^"]+)"/gm)].map(match=>[match[1],match[2]]));
http.createServer(async(req,res)=>{
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end('Forms require the Netlify deployment.');return;}
 try {const url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=resolve(root,routes[url]||url.replace(/^\//,''));if(!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}const body=await readFile(file);res.writeHead(200,{...responseHeaders,'Content-Type':mime[extname(file)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:body);}catch{try{const body=await readFile(resolve(root,'404.html'));res.writeHead(404,{...responseHeaders,'Content-Type':mime['.html']});res.end(req.method==='HEAD'?undefined:body);}catch{res.writeHead(404);res.end('Page not found');}}
}).listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${process.env.PORT||4173} (${root})`));
