import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Fictional questions are never sent. All transport tests use local mocks only.
const source=fs.readFileSync(new URL('../widget/source-info.js',import.meta.url),'utf8');
const fields=['size','material','sides','lamination','finishing','leadTime','fileRequirements'];
const productIds=['namecard-c300','namecard-offset-ta','catalogue'];
const information={version:1,kind:'information',productId:'namecard-c300',field:'material',text:'Giấy Couche C300.',sources:[{provider:'thanh-an',url:'https://innhanhtphcm.com/san-pham/in-danh-thiep-chuan-gia-re'}],reference:false,checkedAtUtc:'2026-10-13T08:00:00Z'};
const response=(value,{status=200,raw,body}={})=>({ok:status>=200&&status<300,body,text:async()=>raw===undefined?JSON.stringify(value):raw});
const plain=value=>JSON.parse(JSON.stringify(value));
const microtasks=async()=>{for(let i=0;i<10;i++)await Promise.resolve();};
function fixture(handler){
  let now=0,id=0;
  const timers=new Map(),calls=[];
  const fetchImpl=async(url,init)=>{calls.push({url,init});return handler?handler(url,init,calls.length):response(information);};
  const root={location:{href:'https://mam.example/demo',origin:'https://mam.example'},fetch:fetchImpl};
  const context=vm.createContext({window:root,URL,AbortController,TextDecoder,TextEncoder,Uint8Array,setTimeout(fn,ms){const key=++id;timers.set(key,{fn,at:now+ms});return key;},clearTimeout(key){timers.delete(key);}});
  vm.runInContext(source,context,{filename:'source-info.js'});
  const create=(options={})=>root.ThanhAnSourceInfo.create({endpoint:'/api/mam-info',productIds,fetchImpl,...options});
  async function advance(ms){const end=now+ms;for(;;){const next=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;now=next[1].at;timers.delete(next[0]);next[1].fn();await microtasks();}now=end;await microtasks();}
  return {api:root.ThanhAnSourceInfo,create,calls,timers,advance};
}
function deferredFetch(){
  let resolve,signal;
  return {handle(_url,init){signal=init.signal;return new Promise(res=>{resolve=res;});},resolve(value=information){resolve(response(value));},get signal(){return signal;}};
}
function streamResponse(chunks){
  let index=0,cancelled=0,released=0;
  return {value:response(null,{body:{getReader(){return {async read(){return index<chunks.length?{done:false,value:chunks[index++]}:{done:true};},async cancel(){cancelled++;},releaseLock(){released++;}};}}}),state:()=>({cancelled,released})};
}

test('frozen module exposes only the seven information fields and starts idle',()=>{
  const f=fixture(),client=f.create();assert.ok(Object.isFrozen(f.api));assert.ok(Object.isFrozen(f.api.fields));assert.ok(Object.isFrozen(client));
  assert.deepEqual(plain(f.api.fields),fields);assert.deepEqual(plain(client.getState()),{destroyed:false,pending:false});assert.equal(f.calls.length,0);
});
test('endpoint must be same-origin HTTP without credentials, query or fragment',()=>{
  const f=fixture();for(const endpoint of [undefined,'','https://other.example/api','http://mam.example/api','//other.example/api','javascript:alert(1)','data:text/plain,x','https://user:pass@mam.example/api','/api?message=fictional','/api#private'])assert.throws(()=>f.create({endpoint}),/same-origin/);
  assert.doesNotThrow(()=>f.create({endpoint:'https://mam.example/api/mam-info'}));assert.equal(f.calls.length,0);
});
test('product inventory is mandatory, bounded, exact and copied instead of accepting chat text',async()=>{
  const f=fixture();for(const ids of [undefined,[],['namecard-c300','namecard-c300'],['../admin'],['<script>'],['contains spaces'],new Array(101).fill('a')])assert.throws(()=>f.create({productIds:ids}),/inventory/);
  const ids=[...productIds],client=f.create({productIds:ids});ids.push('invented');assert.equal(await client.get('invented','material'),null);assert.equal(f.calls.length,0);
});
test('only fixed product and field identifiers can issue a GET',async()=>{
  const f=fixture(),client=f.create();
  for(const [product,field] of [['unknown','size'],['namecard-c300','price'],['namecard-c300','quantity'],['namecard-c300','https://example.invalid/'],['my phone 0123456789','material'],['<img src=x>','size'],[' namecard-c300 ','material'],['namecard-c300',{field:'size'}],[null,'size']])assert.equal(await client.get(product,field),null);
  assert.equal(f.calls.length,0);
});
test('request sends exactly three fixed query keys and no body, credentials, referrer, cache or redirects',async()=>{
  const f=fixture(),client=f.create();const result=await client.get('namecard-c300','material','fictional raw question ignored');
  assert.deepEqual(plain(result),information);const {url,init}=f.calls[0],parsed=new URL(url);
  assert.equal(parsed.origin,'https://mam.example');assert.equal(parsed.pathname,'/api/mam-info');assert.deepEqual([...parsed.searchParams],[['version','1'],['productId','namecard-c300'],['field','material']]);
  assert.equal(init.method,'GET');assert.equal(init.body,undefined);assert.equal(init.credentials,'omit');assert.equal(init.cache,'no-store');assert.equal(init.referrerPolicy,'no-referrer');assert.equal(init.redirect,'error');assert.deepEqual(plain(init.headers),{Accept:'application/json'});
  assert.ok(!url.includes('fictional'));assert.equal(f.timers.size,0);
});
test('every allowed information field is scoped to the requested product and field',async()=>{
  const f=fixture(url=>{const u=new URL(url);return response({...information,productId:u.searchParams.get('productId'),field:u.searchParams.get('field')});}),client=f.create();
  for(const field of fields)assert.equal((await client.get('catalogue',field)).field,field);
  assert.equal(f.calls.length,7);
});
test('validated facts and all nested source objects are immutable',async()=>{
  const f=fixture(),result=await f.create().get('namecard-c300','material');assert.ok(Object.isFrozen(result));assert.ok(Object.isFrozen(result.sources));assert.ok(Object.isFrozen(result.sources[0]));
  assert.throws(()=>{result.text='fictional replacement';},TypeError);assert.equal(result.text,information.text);
});
test('mismatched product, field, version or kind cannot become information',async()=>{
  for(const value of [{...information,productId:'catalogue'},{...information,field:'size'},{...information,version:2},{...information,kind:'price'},null,[],{},'raw text']){const f=fixture(()=>response(value));assert.equal(await f.create().get('namecard-c300','material'),null);}
});
test('extra price, raw HTML or model fields are rejected rather than passed to UI',async()=>{
  for(const value of [{...information,priceVnd:1},{...information,quantity:30},{...information,unit:'hộp'},{...information,html:'<script>fictional</script>'},{...information,rawModelText:'fictional'}]){const f=fixture(()=>response(value));assert.equal(await f.create().get('namecard-c300','material'),null);}
});
test('text is bounded plain information; numeric dimensions remain legitimate',async()=>{
  for(const text of ['', '   ','x'.repeat(2001),'<img src=x onerror=alert(1)>','<script>fictional</script>','a\u0000b']){const f=fixture(()=>response({...information,text}));assert.equal(await f.create().get('namecard-c300','material'),null);}
  const f=fixture(()=>response({...information,text:'Kích thước 90 × 54 mm; in 2 mặt.'}));assert.ok(await f.create().get('namecard-c300','material'));
});
test('information text cannot smuggle a price, discount or total while physical/file numbers remain valid',async()=>{
  for(const text of ['Giá 90.000₫.','Chi phí 140 đồng.','Giá 120 VND.','Giá 160 VNĐ.','Chi phí 5 USD.','Khoảng 90k.','Khoảng 140 nghìn.','Khoảng 3 triệu.','Đơn giá theo hộp.','Tổng tiền của bạn.','Giảm giá cho bạn.','Chiết khấu 10%.','Giá １００ｋ.']){const f=fixture(()=>response({...information,text}));assert.equal(await f.create().get('namecard-c300','material'),null,text);}
  for(const text of ['Giấy C300, 90 × 54 mm, in 2 mặt.','Ảnh 300dpi; file tối đa 100MB.','Quy cách gồm 100 tấm mỗi hộp.','File mẫu 300kB.']){const f=fixture(()=>response({...information,text}));assert.ok(await f.create().get('namecard-c300','material'),text);}
});
test('sources require exact provider/URL keys and a matching official HTTPS hostname',async()=>{
  const invalid=[[],new Array(9).fill(information.sources[0]),[{provider:'other',url:information.sources[0].url}],[{provider:'vinh-phat',url:information.sources[0].url}],[{provider:'thanh-an',url:'https://example.invalid/'}],[{provider:'thanh-an',url:'http://innhanhtphcm.com/'}],[{provider:'thanh-an',url:'https://innhanhtphcm.com.evil.invalid/'}],[{provider:'thanh-an',url:'https://user:pass@innhanhtphcm.com/'}],[{provider:'thanh-an',url:'https://innhanhtphcm.com:8443/'}],[{provider:'thanh-an',url:'https://innhanhtphcm.com/?redirect=other'}],[{provider:'thanh-an',url:'https://innhanhtphcm.com/#private'}],[{provider:'thanh-an',url:null}],[{...information.sources[0],text:'fictional'}]];
  for(const sources of invalid){const f=fixture(()=>response({...information,sources}));assert.equal(await f.create().get('namecard-c300','material'),null);}
  const f=fixture(()=>response({...information,reference:true,sources:[{provider:'vinh-phat',url:'https://invinhphat.com/san-pham/in-tag-treo-khuyen-tai/'}]}));assert.ok(await f.create().get('namecard-c300','material'));
});
test('reference is boolean and checked time is a valid UTC calendar timestamp',async()=>{
  const vp={provider:'vinh-phat',url:'https://invinhphat.com/san-pham/in-tag-treo-khuyen-tai/'};
  for(const value of [{...information,reference:'false'},{...information,reference:true},{...information,sources:[vp]},{...information,reference:true,sources:[...information.sources,vp]},{...information,checkedAtUtc:null},{...information,checkedAtUtc:'not a date'},{...information,checkedAtUtc:'2026-02-30T08:00:00Z'},{...information,checkedAtUtc:'2026-10-13T08:00:00+07:00'}]){const f=fixture(()=>response(value));assert.equal(await f.create().get('namecard-c300','material'),null);}
  for(const checkedAtUtc of ['2026-10-13T08:00:00.1Z','2026-10-13T08:00:00.123Z']){const f=fixture(()=>response({...information,checkedAtUtc}));assert.ok(await f.create().get('namecard-c300','material'));}
});
test('fallback and clarification do not create an arbitrary answer or automatic retry',async()=>{
  for(const kind of ['fallback','clarify']){const f=fixture(()=>response({version:1,kind})),client=f.create();assert.equal(await client.get('namecard-c300','material'),null);assert.equal(f.calls.length,1);assert.equal(f.timers.size,0);}
});
test('HTTP errors, invalid JSON, oversized bodies and offline failure safely return null',async()=>{
  const faults=[()=>response(null,{status:400}),()=>response(null,{status:403}),()=>response(null,{status:429}),()=>response(null,{status:503}),()=>response(null,{raw:'invalid JSON'}),()=>response(null,{raw:'x'.repeat(16385)}),()=>{throw new Error('Fictional offline');}];
  for(const fault of faults){const f=fixture(fault),client=f.create();assert.equal(await client.get('namecard-c300','material'),null);assert.equal(f.calls.length,1);assert.equal(f.timers.size,0);assert.equal(client.getState().pending,false);}
});
test('UTF-8 stream reads valid facts and cancels excessive or malformed streams',async()=>{
  const bytes=new TextEncoder().encode(JSON.stringify(information)),valid=streamResponse([bytes.slice(0,31),bytes.slice(31)]),f=fixture(()=>valid.value);
  assert.deepEqual(plain(await f.create().get('namecard-c300','material')),information);assert.equal(valid.state().released,1);
  for(const chunks of [[new Uint8Array(16385)],[new Uint8Array([0xff])],new Array(257).fill(new Uint8Array())]){const stream=streamResponse(chunks),f=fixture(()=>stream.value);assert.equal(await f.create().get('namecard-c300','material'),null);assert.equal(stream.state().released,1);assert.ok(stream.state().cancelled>=1);}
});
test('only one request is in flight and no later field is queued',async()=>{
  const deferred=deferredFetch(),f=fixture(deferred.handle),client=f.create(),first=client.get('namecard-c300','material');assert.equal(client.getState().pending,true);
  assert.equal(await client.get('catalogue','size'),null);assert.equal(f.calls.length,1);deferred.resolve();assert.ok(await first);assert.equal(client.getState().pending,false);
});
test('five-second timeout remains bounded even when fetch ignores abort and later completes',async()=>{
  const deferred=deferredFetch(),f=fixture(deferred.handle),client=f.create(),pending=client.get('namecard-c300','material');
  await f.advance(4999);assert.equal(deferred.signal.aborted,false);await f.advance(1);assert.equal(await pending,null);assert.equal(deferred.signal.aborted,true);assert.equal(client.getState().pending,false);assert.equal(f.timers.size,0);
  deferred.resolve();await microtasks();assert.equal(client.getState().pending,false);assert.equal(f.calls.length,1);
});
test('five-second timeout also covers an abort-ignoring response body reader',async()=>{
  let resolveBody;
  const f=fixture(()=>({ok:true,text:()=>new Promise(resolve=>{resolveBody=resolve;})})),client=f.create(),pending=client.get('namecard-c300','material');await microtasks();await f.advance(5000);
  assert.equal(await pending,null);assert.equal(client.getState().pending,false);resolveBody(JSON.stringify(information));await microtasks();assert.equal(client.getState().pending,false);assert.equal(f.timers.size,0);
});
test('abort invalidates a late response and permits a fresh independent lookup',async()=>{
  const deferred=deferredFetch();let count=0;
  const f=fixture((url,init)=>++count===1?deferred.handle(url,init):response(information)),client=f.create(),old=client.get('namecard-c300','material');client.abort();
  assert.equal(deferred.signal.aborted,true);assert.equal(await old,null);const current=client.get('namecard-c300','material');deferred.resolve();assert.ok(await current);await microtasks();assert.equal(client.getState().pending,false);assert.equal(f.calls.length,2);
});
test('destroy is idempotent, cancels pending work and prevents any future request',async()=>{
  const deferred=deferredFetch(),f=fixture(deferred.handle),client=f.create(),pending=client.get('namecard-c300','material');client.destroy();client.destroy();
  assert.equal(deferred.signal.aborted,true);assert.equal(await pending,null);deferred.resolve();await microtasks();assert.deepEqual(plain(client.getState()),{destroyed:true,pending:false});assert.equal(await client.get('catalogue','size'),null);assert.equal(f.calls.length,1);assert.equal(f.timers.size,0);
});
test('repeated completed lookups use no visitor storage or implicit memory cache',async()=>{
  const f=fixture(),client=f.create();await client.get('namecard-c300','material');await client.get('namecard-c300','material');assert.equal(f.calls.length,2);
  assert.doesNotMatch(source,/localStorage|sessionStorage|document\.cookie|navigator\.sendBeacon|console\./);
});
