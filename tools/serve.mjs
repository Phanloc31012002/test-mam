import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.md':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{
  const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; frame-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"};
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,headers);res.end();return;}
  let name;try{name=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);}catch(_){res.writeHead(400,headers);res.end();return;}
  if(name==='/' )name='/index.html';
  const target=path.resolve(root,'.'+name);
  if(!target.startsWith(root+path.sep)||name.split('/').some(s=>s.startsWith('.'))){res.writeHead(403,headers);res.end();return;}
  fs.readFile(target,(error,bytes)=>{if(error){res.writeHead(404,headers);res.end('Not found');return;}res.writeHead(200,{...headers,'Content-Type':types[path.extname(target)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:bytes);});
});
const port=Number(process.env.TA_MAM_PORT||4173);
server.listen(port,'127.0.0.1',()=>console.log('Mầm local preview: http://127.0.0.1:'+port+' (localhost only; Ctrl+C to stop)'));
