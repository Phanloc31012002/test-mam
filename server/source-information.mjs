import {readFileSync} from 'node:fs';

// Read-only, reviewed website information. This endpoint never accepts visitor
// chat, follows customer links, changes prices, uses credentials or logs bodies.
export const INFORMATION_FIELDS = Object.freeze(['size','material','sides','lamination','finishing','leadTime','fileRequirements']);
export const PRODUCT_IDS = Object.freeze([
  'namecard-c300','decal-paper','decal-plastic','flyer','catalogue','kraft-bag',
  'paper-box','envelope-a5','red-envelope','menu-paper','receipt','wedding',
  'namecard-vp','namecard-digital-vp','decal-paper-vp','flyer-vp','envelope-vp',
  'receipt-vp','paper-bag-vp','folder-vp','tag-vp','earring-tag-vp','namecard-offset-ta'
]);
// Exact reviewed product-page inventory, including explicit card information
// references. No wildcard hostname, crawl, inferred product family or URL input.
export const SOURCE_URLS = Object.freeze([
  'https://innhanhtphcm.com/san-pham/in-danh-thiep-giay-c300-gia-re',
  'https://innhanhtphcm.com/san-pham/in-decal-giay-re-dep',
  'https://innhanhtphcm.com/san-pham/in-decal-nhua',
  'https://innhanhtphcm.com/san-pham/in-to-roi-to-gap',
  'https://innhanhtphcm.com/san-pham/in-catalogue-so-luong-it',
  'https://innhanhtphcm.com/san-pham/thanh-an-in-tui-giay-kraft',
  'https://innhanhtphcm.com/san-pham/in-hop-giay-tphcm',
  'https://innhanhtphcm.com/san-pham/in-bao-thu-a5-in-nhanh-gia-re',
  'https://innhanhtphcm.com/san-pham/in-bao-li-xi',
  'https://innhanhtphcm.com/san-pham/in-menu-giay',
  'https://innhanhtphcm.com/san-pham/in-phieu-thu-2-lien-tai-phuong-cho-lon-q5',
  'https://innhanhtphcm.com/san-pham/in-thiep-cuoi-gia-re-tai-thanh-an',
  'https://invinhphat.com/san-pham/in-name-card-visit-danh-thiep-gia-re/',
  'https://invinhphat.com/san-pham/in-name-card-gia-re/',
  'https://invinhphat.com/san-pham/cong-ty-in-danh-thiep-nhanh-gia-re-tphcm/',
  'https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/',
  'https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/',
  'https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/',
  'https://invinhphat.com/san-pham/phieu-thu-cac-loai/',
  'https://invinhphat.com/san-pham/in-tui-giay-gia-re/',
  'https://invinhphat.com/san-pham/in-folder-kep-file/',
  'https://invinhphat.com/san-pham/in-tag-treo-the-bai/',
  'https://invinhphat.com/san-pham/in-tag-treo-khuyen-tai/',
  'https://invinhphat.com/san-pham/in-catalouge/',
  'https://invinhphat.com/san-pham/in-catalogue-a5/',
  'https://innhanhtphcm.com/san-pham/in-card-visit-offset',
  'https://innhanhtphcm.com/san-pham/in-danh-thiep-chuan-gia-re'
]);
export const INFO_LIMITS = Object.freeze({
  timeoutMs:4000,cacheMs:90000,cacheEntries:32,pageBytes:1048576,pageChunks:2048,
  visibleCharacters:262144,tagCharacters:4096,htmlDepth:128,
  outputCharacters:2000,requestsPerMinute:30,concurrent:2
});
const DEFAULT_ORIGIN='https://test-mam.vercel.app';
const PROVIDERS=Object.freeze(['thanh-an','vinh-phat']);
const HEADERS=Object.freeze({'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store, max-age=0','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Vary':'Origin'});
const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.getPrototypeOf(value)===Object.prototype;
const exact=(value,keys)=>record(value)&&Object.keys(value).length===keys.length&&keys.every(key=>Object.hasOwn(value,key));
const plain=(value,max=2000)=>typeof value==='string'&&!!value.trim()&&value.length<=max&&!/[<>\p{Cc}\p{Cf}]/u.test(value);
const iso=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString()===(value.includes('.')?value:value.replace('Z','.000Z'));
const reply=(kind,status=200,extra={})=>new Response(JSON.stringify({version:1,kind,...extra}),{status,headers:HEADERS});

export function normalizeEvidence(value){return String(value).normalize('NFKC').normalize('NFD').replace(/\p{M}/gu,'').replace(/đ/gi,'d').toLowerCase().replace(/\s+/gu,' ').trim();}
function monetary(value){
  const text=normalizeEvidence(value);
  return /\d[\d.,\s]*\s*(?:₫|dong\b|vnd\b|vndong\b|usd\b|k\b|nghin\b|ngan\b|trieu\b)|\b(?:don gia|tong tien|thanh tien|gia tien|giam gia|chiet khau)\b/u.test(text);
}
function sourceAllowed(url,provider){
  if(typeof url!=='string'||!SOURCE_URLS.includes(url))return false;
  const parsed=new URL(url);
  return parsed.protocol==='https:'&&!parsed.port&&!parsed.username&&!parsed.password&&!parsed.search&&!parsed.hash&&parsed.hostname===(provider==='thanh-an'?'innhanhtphcm.com':provider==='vinh-phat'?'invinhphat.com':'');
}
export function validateInformationData(data){
  if(!exact(data,['schemaVersion','fieldNames','sourcePriority','verifiedAtUtc','products'])||data.schemaVersion!==1||!Array.isArray(data.fieldNames)||data.fieldNames.join(',')!==INFORMATION_FIELDS.join(',')||!Array.isArray(data.sourcePriority)||data.sourcePriority.join(',')!==PROVIDERS.join(',')||!iso(data.verifiedAtUtc)||!Array.isArray(data.products)||data.products.length!==PRODUCT_IDS.length)throw Error('Invalid information corpus');
  const products=new Set(),facts=new Set();
  for(const product of data.products){
    if(!exact(product,['productId','fields'])||!PRODUCT_IDS.includes(product.productId)||products.has(product.productId)||!exact(product.fields,INFORMATION_FIELDS))throw Error('Invalid information product');
    products.add(product.productId);
    for(const field of INFORMATION_FIELDS){
      const entry=product.fields[field],keys=Object.hasOwn(entry||{},'reason')?['status','facts','reason']:['status','facts'];
      if(!exact(entry,keys)||!['verified','conditional','unknown','conflict'].includes(entry.status)||!Array.isArray(entry.facts)||entry.facts.length>8||entry.reason!==undefined&&!plain(entry.reason,500))throw Error('Invalid information field');
      if(['unknown','conflict'].includes(entry.status)){if(entry.facts.length)throw Error('Unresolved field cannot answer');continue;}
      if(!entry.facts.length||field==='leadTime'&&entry.status!=='conditional')throw Error('Missing information evidence or conditional lead time');
      for(const fact of entry.facts){
        if(!exact(fact,['id','field','text','provider','sourceUrl','verifiedAtUtc','scope','conditions','evidence'])||!plain(fact.id,120)||facts.has(fact.id)||fact.field!==field||!plain(fact.text,1600)||monetary(fact.text)||!PROVIDERS.includes(fact.provider)||!sourceAllowed(fact.sourceUrl,fact.provider)||!iso(fact.verifiedAtUtc)||!['product','variant','common-reference'].includes(fact.scope)||!Array.isArray(fact.conditions)||fact.conditions.length>8||!fact.conditions.every(value=>plain(value,300)&&!monetary(value))||!Array.isArray(fact.evidence)||!fact.evidence.length||fact.evidence.length>8||!fact.evidence.every(value=>plain(value,500)&&!!normalizeEvidence(value)))throw Error('Invalid reviewed fact');
        if((fact.scope!=='product'||entry.status==='conditional')&&!fact.conditions.length)throw Error('Conditional information needs scope');
        facts.add(fact.id);
      }
    }
  }
  return data;
}

const ENTITIES=Object.freeze({nbsp:' ',amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',times:'×',middot:'·',ensp:' ',emsp:' ',thinsp:' ',ndash:'–',mdash:'—',hellip:'…'});
function decodeEntities(value){return value.replace(/&(#x[\da-f]{1,6}|#\d{1,7}|[a-z]{1,32});/giu,(whole,entity)=>{
  if(entity[0]!=='#')return ENTITIES[entity.toLowerCase()]??whole;
  const number=entity[1].toLowerCase()==='x'?parseInt(entity.slice(2),16):parseInt(entity.slice(1),10);
  return number>0&&number<=0x10ffff&&!(number>=0xd800&&number<=0xdfff)?String.fromCodePoint(number):' ';
});}
const VOID=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const OPAQUE=new Set(['script','style','iframe','textarea']);
const IGNORE=new Set(['script','style','head','iframe','textarea','template','noscript','svg','canvas','object']);
// Bounded linear HTML text extraction. Script/style/metadata, comments, tag
// attributes and explicitly hidden sections cannot satisfy reviewed evidence.
export function visiblePageText(html){
  if(typeof html!=='string'||html.length>INFO_LIMITS.pageBytes||!/<\/html\s*>/iu.test(html))throw Error('Incomplete HTML document');
  const lower=html.toLowerCase(),chunks=[],stack=[];let position=0,ignored=0;
  function append(text){if(!ignored&&text)chunks.push(text);}
  while(position<html.length){
    const last=stack.at(-1);
    if(last&&OPAQUE.has(last.name)){
      const close=lower.indexOf('</'+last.name,position);
      if(close<0)throw Error('Incomplete opaque element');
      position=close;
    }
    const opening=html.indexOf('<',position);
    if(opening<0){append(html.slice(position));break;}
    append(html.slice(position,opening));
    if(html.startsWith('<!--',opening)){
      const end=html.indexOf('-->',opening+4);if(end<0)throw Error('Incomplete comment');position=end+3;continue;
    }
    let end=opening+1,quote='';
    while(end<html.length){const character=html[end];if(quote){if(character===quote)quote='';}else if(character==='"'||character==="'")quote=character;else if(character==='>')break;if(end-opening>INFO_LIMITS.tagCharacters)throw Error('Oversized HTML tag');end++;}
    if(end>=html.length)throw Error('Incomplete HTML tag');
    const tag=html.slice(opening+1,end),match=tag.match(/^\s*(\/?)\s*([a-z][a-z\d:-]*)\b/iu);position=end+1;
    if(!match)continue;
    const name=match[2].toLowerCase();
    if(match[1]){
      const index=stack.findLastIndex(item=>item.name===name);
      if(index>=0)while(stack.length>index){if(stack.pop().ignored)ignored--;}
    }else if(!VOID.has(name)&&!tag.trimEnd().endsWith('/')){
      const attributes=new Map();
      for(const attribute of tag.slice(match[0].length).matchAll(/(?:^|\s)([a-z][a-z\d:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>]+)))?/giu)){
        const key=attribute[1].toLowerCase();if(!attributes.has(key))attributes.set(key,(attribute[2]??attribute[3]??attribute[4]??'').toLowerCase());
      }
      const hidden=attributes.has('hidden')||attributes.get('aria-hidden')==='true'||/display\s*:\s*none|visibility\s*:\s*hidden/iu.test(attributes.get('style')||'');
      const item={name,ignored:IGNORE.has(name)||hidden};stack.push(item);if(item.ignored)ignored++;
      if(stack.length>INFO_LIMITS.htmlDepth)throw Error('HTML nesting too deep');
    }
    append(' ');
  }
  const text=normalizeEvidence(decodeEntities(chunks.join(' ')));
  if(text.length>INFO_LIMITS.visibleCharacters)throw Error('Visible text too large');
  return text;
}

async function readPage(stream,signal){
  if(!stream?.getReader)throw Error('Missing page body');
  const reader=stream.getReader(),chunks=[];let length=0,count=0;
  const cancel=()=>{reader.cancel().catch(()=>{});};signal.addEventListener('abort',cancel,{once:true});
  try{
    while(true){
      if(signal.aborted)throw Error('Aborted');
      const {done,value}=await reader.read();if(done)break;
      if(!(value instanceof Uint8Array)||++count>INFO_LIMITS.pageChunks)throw Error('Invalid page chunks');
      length+=value.byteLength;if(length>INFO_LIMITS.pageBytes)throw Error('Page too large');
      if(value.byteLength)chunks.push(value.slice());
    }
    if(signal.aborted)throw Error('Aborted');
    const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
    return new TextDecoder('utf-8',{fatal:true}).decode(bytes);
  }catch(error){cancel();throw error;}
  finally{signal.removeEventListener('abort',cancel);try{reader.releaseLock();}catch{}}
}
async function deadline(action,timers){
  const controller=new AbortController();let timer;
  const boundary=new Promise((_,reject)=>{timer=timers.setTimeout(()=>{controller.abort();reject(Error('Deadline'));},INFO_LIMITS.timeoutMs);});
  try{return await Promise.race([Promise.resolve().then(()=>action(controller.signal)),boundary]);}
  finally{timers.clearTimeout(timer);}
}
function appOrigin(env){
  const value=env.APP_ORIGIN||DEFAULT_ORIGIN;
  try{const url=new URL(value);if(typeof value!=='string'||value.includes('*')||url.protocol!=='https:'||url.origin!==value||url.username||url.password)return null;}
  catch{return null;}
  if(env.VERCEL_ENV==='preview'&&(env.APP_ALLOW_PREVIEW!=='true'||!env.APP_ORIGIN))return null;
  return value;
}
const defaultData=()=>JSON.parse(readFileSync(new URL('../widget/information.json',import.meta.url),'utf8'));
const defaultEnv=()=>({APP_ORIGIN:process.env.APP_ORIGIN,VERCEL_ENV:process.env.VERCEL_ENV,APP_ALLOW_PREVIEW:process.env.APP_ALLOW_PREVIEW});

export function createInformationHandler({data=defaultData,env=defaultEnv,fetchImpl=globalThis.fetch,now=Date.now,timers={setTimeout,clearTimeout}}={}){
  // Cache and traffic limits are bounded per warm instance, not a distributed
  // service-wide quota. They hold only public source text, never visitor chat.
  let corpus=null,active=0,windowUntil=0,count=0;const cache=new Map();
  function prune(){const time=now();for(const [url,entry]of cache)if(entry.expires<=time)cache.delete(url);}
  async function page(url,signal){
    prune();const cached=cache.get(url);if(cached)return cached;
    if(signal.aborted||!SOURCE_URLS.includes(url))throw Error('Unapproved source');
    const response=await fetchImpl(url,{method:'GET',headers:{Accept:'text/html'},credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store',redirect:'error',signal});
    const size=response.headers.get('content-length');
    if(signal.aborted||!response.ok||response.redirected||response.url!==url||!/^text\/html(?:\s*;.*)?$/iu.test(response.headers.get('content-type')||'')||size!==null&&(!/^\d{1,10}$/u.test(size)||Number(size)>INFO_LIMITS.pageBytes)){
      response.body?.cancel().catch(()=>{});throw Error('Unusable source response');
    }
    const html=await readPage(response.body,signal);if(signal.aborted)throw Error('Aborted');
    const text=visiblePageText(html);if(signal.aborted)throw Error('Aborted');
    prune();if(cache.size>=INFO_LIMITS.cacheEntries)throw Error('Cache full');
    const checked=now(),entry={text,checkedAtUtc:new Date(checked).toISOString(),expires:checked+INFO_LIMITS.cacheMs};
    cache.set(url,entry);return entry;
  }
  return async function handle(request){
    try{
      if(request.method!=='GET')return reply('fallback',405);
      const configuration=typeof env==='function'?env():env,origin=appOrigin(configuration),url=new URL(request.url),received=request.headers.get('origin'),site=request.headers.get('sec-fetch-site');
      if(!origin||url.origin!==origin||received&&received!==origin||site&&!['same-origin','none'].includes(site))return reply('fallback',403);
      const parameters=[...url.searchParams.keys()];
      if(url.pathname!=='/api/mam-info'||url.href.length>500||parameters.length!==3||new Set(parameters).size!==3||!['version','productId','field'].every(key=>parameters.includes(key))||url.searchParams.get('version')!=='1')return reply('fallback',400);
      const productId=url.searchParams.get('productId'),field=url.searchParams.get('field');
      if(!PRODUCT_IDS.includes(productId)||!INFORMATION_FIELDS.includes(field))return reply('fallback',400);
      if(!corpus){const supplied=typeof data==='function'?data():data;const candidate=JSON.parse(JSON.stringify(supplied));validateInformationData(candidate);corpus=candidate;}
      const entry=corpus.products.find(product=>product.productId===productId).fields[field];
      if(entry.status==='unknown')return reply('fallback');if(entry.status==='conflict')return reply('clarify');
      const preferred=entry.facts.some(fact=>fact.provider==='thanh-an')?'thanh-an':'vinh-phat',facts=entry.facts.filter(fact=>fact.provider===preferred);
      // Different reviewed variants remain distinct. Never merge their conditions
      // or select a variant merely because a page happens to mention its evidence.
      if(new Set(facts.map(fact=>JSON.stringify([fact.text,fact.scope,fact.conditions]))).size!==1)return reply('clarify');
      const text=facts[0].text+(facts[0].conditions.length?'\n'+facts[0].conditions.map(condition=>'• '+condition).join('\n'):'');
      if(text.length>INFO_LIMITS.outputCharacters||monetary(text))return reply('fallback');
      const time=now();if(time>=windowUntil){windowUntil=time+60000;count=0;}
      if(active>=INFO_LIMITS.concurrent||count>=INFO_LIMITS.requestsPerMinute)return reply('fallback',429);
      active++;count++;
      try{
        return await deadline(async signal=>{
          const verified=[];
          for(const fact of facts){
            const fresh=await page(fact.sourceUrl,signal);
            if(signal.aborted||!fact.evidence.every(evidence=>fresh.text.includes(normalizeEvidence(evidence))))throw Error('Evidence changed');
            verified.push(fresh);
          }
          if(signal.aborted)throw Error('Aborted');
          const sources=[...new Set(facts.map(fact=>fact.sourceUrl))].map(sourceUrl=>({provider:preferred,url:sourceUrl}));
          const checkedAtUtc=verified.map(value=>value.checkedAtUtc).sort()[0];
          return reply('information',200,{productId,field,text,sources,reference:preferred==='vinh-phat',checkedAtUtc});
        },timers);
      }catch{return reply('fallback');}finally{active--;}
    }catch{return reply('fallback');}
  };
}
