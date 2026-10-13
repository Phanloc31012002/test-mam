#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash,randomUUID} from 'node:crypto';
import '../widget/approved-language.js';

const api=globalThis.ThanhAnApprovedLanguage;
const defaultFile=fileURLToPath(new URL('../widget/approved-language.json',import.meta.url));
const help=`Duyệt cách diễn đạt cho Mầm, chỉ trên tệp cục bộ.

  node tools/review-language.mjs list [--file PATH]
  node tools/review-language.mjs propose --phrase TEXT --intent INTENT [--category CATEGORY] --author assistant|owner [--file PATH]
  node tools/review-language.mjs approve --id ID --reviewer owner --ack-owner-review [--file PATH]
  node tools/review-language.mjs disable --id ID --reviewer owner --ack-owner-review [--file PATH]

Propose luôn tạo mục pending. Chỉ approve có xác nhận thao tác chủ nhà in mới bật mục.
--ack-owner-review xác nhận người vận hành đã tự đọc và duyệt ánh xạ; không xác thực danh tính.
Không có endpoint công khai, gửi mạng hoặc tự lưu câu của khách.
Giới hạn: 250 mục, 120 ký tự/cách diễn đạt; không giá, số lượng, quy cách hoặc dữ liệu riêng tư.
`;
function parse(argv){
  if(!argv.length||argv[0]==='--help'||argv[0]==='help')return {command:'help'};
  const command=argv[0];
  if(!['list','propose','approve','disable'].includes(command))throw new Error('Lệnh duyệt không được hỗ trợ.');
  const allowed={list:['file'],propose:['file','phrase','intent','category','author'],approve:['file','id','reviewer','ack-owner-review'],disable:['file','id','reviewer','ack-owner-review']}[command];
  const options={};
  for(let index=1;index<argv.length;index++){
    const argument=argv[index];
    if(!argument.startsWith('--')||argument.includes('='))throw new Error('Tham số không đúng định dạng.');
    const key=argument.slice(2);
    if(!allowed.includes(key)||Object.hasOwn(options,key))throw new Error('Tham số lạ hoặc trùng không được phép.');
    if(key==='ack-owner-review'){options[key]=true;continue;}
    const value=argv[++index];
    if(typeof value!=='string'||!value||value.startsWith('--'))throw new Error('Thiếu giá trị tham số.');
    options[key]=value;
  }
  return {command,options};
}
async function readData(file){
  let stat,text;
  try{stat=await fs.lstat(file);if(!stat.isFile()||stat.isSymbolicLink()||stat.size>131072)throw new Error();text=await fs.readFile(file,'utf8');}catch(_){throw new Error('Không đọc được tệp JSON cục bộ hợp lệ.');}
  let data;
  try{data=JSON.parse(text);}catch(_){throw new Error('Tệp JSON không đúng định dạng.');}
  api.validateData(data);
  return {data,text};
}
function required(options,key){if(!options[key])throw new Error('Thiếu tham số bắt buộc.');return options[key];}
function update(command,options,data){
  if(command==='propose'){
    const phrase=required(options,'phrase'),intent=required(options,'intent'),author=required(options,'author');
    const categoryId=intent==='product'?required(options,'category'):null;
    if(intent!=='product'&&options.category)throw new Error('Ý định ngoài sản phẩm không có category.');
    const id='phrase-'+createHash('sha256').update(api.normalize(phrase)).digest('hex').slice(0,16);
    data.entries.push({id,phrase,intent,categoryId,status:'pending',author,review:null});
    api.validateData(data);return id;
  }
  if(options.reviewer!=='owner'||options['ack-owner-review']!==true)throw new Error('Cần --reviewer owner và --ack-owner-review sau khi chủ nhà in tự duyệt.');
  const id=required(options,'id'),entry=data.entries.find(entry=>entry.id===id);
  if(!entry)throw new Error('Không tìm thấy mục cần duyệt.');
  entry.status=command==='approve'?'approved':'disabled';
  entry.review={decision:entry.status,byRole:'owner',at:new Date().toISOString(),mappingKey:api.mappingKey(entry)};
  api.validateData(data);return id;
}
async function writeAtomic(file,text,expectedText){
  if(Buffer.byteLength(text,'utf8')>131072)throw new Error('Tệp kết quả vượt giới hạn 128 KiB; thao tác chưa được lưu.');
  const temporary=path.join(path.dirname(file),'.'+path.basename(file)+'.'+randomUUID()+'.tmp');
  let created=false;
  try{
    await fs.writeFile(temporary,text,{flag:'wx',mode:0o600});created=true;
    if((await fs.readFile(file,'utf8'))!==expectedText)throw new Error('Tệp đã thay đổi; hãy đọc lại trước khi duyệt.');
    const stat=await fs.lstat(file);if(!stat.isFile()||stat.isSymbolicLink())throw new Error('Đích ghi không còn là tệp thông thường.');
    await fs.rename(temporary,file);created=false;
  }finally{if(created)await fs.unlink(temporary).catch(()=>{});}
}
async function main(){
  const {command,options}=parse(process.argv.slice(2));
  if(command==='help'){process.stdout.write(help);return;}
  const file=path.resolve(options.file||defaultFile);
  if(path.extname(file).toLowerCase()!=='.json')throw new Error('Chỉ nhận tệp JSON cục bộ.');
  if(command==='list'){
    const {data}=await readData(file);
    process.stdout.write(JSON.stringify({counts:api.create(data).getCounts(),entries:data.entries},null,2)+'\n');return;
  }
  const lockPath=file+'.review-lock';
  let lock;
  try{lock=await fs.open(lockPath,'wx',0o600);}catch(_){throw new Error('Không khóa được tệp để duyệt; có thể đang có thao tác khác.');}
  try{
    const {data,text}=await readData(file);
    const id=update(command,options,data);
    await writeAtomic(file,JSON.stringify(data,null,2)+'\n',text);
    process.stdout.write(JSON.stringify({command,id,status:data.entries.find(entry=>entry.id===id).status,counts:api.create(data).getCounts()})+'\n');
  }finally{await lock.close();await fs.unlink(lockPath).catch(()=>{});}
}
main().catch(error=>{process.stderr.write((error instanceof TypeError?error.message:error.message||'Không hoàn tất thao tác duyệt.')+'\n');process.exitCode=1;});
