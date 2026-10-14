import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Node integration tests: real policy, presentation and widget code, with a
// deliberately small DOM and deterministic timers. No browser or network.
const sources=Object.fromEntries(['policy','presentation','gemini-client','widget'].map(name=>[name,fs.readFileSync(new URL('../widget/'+name+'.js',import.meta.url),'utf8')]));
const data=JSON.parse(fs.readFileSync(new URL('../widget/data.json',import.meta.url),'utf8'));
const microtasks=async()=>{for(let i=0;i<20;i++)await Promise.resolve();};

function clock(){
  let now=0,nextId=1;
  const pending=new Map();
  const setTimeout=(fn,ms=0)=>{const id=nextId++;pending.set(id,{fn,at:now+Math.max(0,Number(ms)||0)});return id;};
  const clearTimeout=id=>pending.delete(id);
  async function advance(ms){const end=now+ms;for(;;){const task=[...pending].filter(([,v])=>v.at<=end).sort((a,b)=>a[1].at-b[1].at||a[0]-b[0])[0];if(!task)break;now=task[1].at;pending.delete(task[0]);task[1].fn();await microtasks();}now=end;await microtasks();}
  return{get now(){return now;},setTimeout,clearTimeout,advance,pending};
}

function fakeDocument(){
  const doc={baseURI:'https://mam.test/demo',activeElement:null};
  class Node {
    constructor(tag,text=null){this.tagName=tag.toUpperCase();this.nodeType=text===null?1:3;this._text=text||'';this.children=[];this.parentNode=null;this.attributes=new Map();this.listeners=new Map();this.className='';this.dataset={};this.hidden=false;this.style={setProperty:(key,value)=>{this.style[key]=value;}};this.scrollTop=0;this.clientHeight=400;this.offsetHeight=80;}
    get parentElement(){return this.parentNode?.nodeType===1?this.parentNode:null;}
    get childElementCount(){return this.children.filter(n=>n.nodeType===1).length;}
    get firstElementChild(){return this.children.find(n=>n.nodeType===1)||null;}
    get scrollHeight(){return this.children.length*80;}
    get isConnected(){return this===doc.body||Boolean(this.parentNode?.isConnected)||Boolean(this.host?.isConnected);}
    get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
    set textContent(value){this.replaceChildren();this._text=String(value??'');}
    set innerHTML(_){throw new Error('Unsafe HTML writes are forbidden in this fixture');}
    get classList(){return{add:(...names)=>{this.className=[...new Set([...this.className.split(/\s+/).filter(Boolean),...names])].join(' ');},contains:name=>this.className.split(/\s+/).includes(name)};}
    setAttribute(key,value){this.attributes.set(key,String(value));if(key==='class')this.className=String(value);if(key==='id')this.id=String(value);}
    getAttribute(key){return this.attributes.get(key)??null;}
    removeAttribute(key){this.attributes.delete(key);if(key.startsWith('data-'))delete this.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())];}
    appendChild(child){child.remove();this.children.push(child);child.parentNode=this;return child;}
    append(...children){children.forEach(child=>this.appendChild(child));}
    prepend(child){child.remove();this.children.unshift(child);child.parentNode=this;}
    insertBefore(child,before){child.remove();const i=this.children.indexOf(before);if(i<0)return this.appendChild(child);this.children.splice(i,0,child);child.parentNode=this;return child;}
    replaceChildren(...children){for(const child of this.children)child.parentNode=null;this.children=[];this._text='';children.forEach(child=>this.appendChild(child));}
    remove(){if(this.parentNode){const i=this.parentNode.children.indexOf(this);if(i>=0)this.parentNode.children.splice(i,1);this.parentNode=null;}}
    attachShadow(){const shadow=new Node('#shadow-root');shadow.host=this;shadow.activeElement=null;this.shadowRoot=shadow;return shadow;}
    contains(target){return this===target||this.children.some(child=>child.contains(target));}
    matches(selector){return selector.split(',').some(part=>{const s=part.trim();if(s.startsWith('.'))return s.slice(1).split('.').every(c=>this.classList.contains(c));if(s.startsWith('#'))return this.id===s.slice(1);return this.tagName===s.toUpperCase();});}
    querySelectorAll(selector){const found=[];for(const child of this.children){if(child.nodeType===1&&child.matches(selector))found.push(child);found.push(...child.querySelectorAll(selector));}return found;}
    querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
    closest(selector){for(let n=this;n;n=n.parentNode)if(n.matches(selector))return n;return null;}
    addEventListener(type,fn,capture=false){const listeners=this.listeners.get(type)||[];listeners.push({fn,capture:typeof capture==='boolean'?capture:Boolean(capture.capture)});this.listeners.set(type,listeners);}
    removeEventListener(type,fn){this.listeners.set(type,(this.listeners.get(type)||[]).filter(record=>record.fn!==fn));}
    dispatchEvent(event){event.target??=this;event.preventDefault??=()=>{event.defaultPrevented=true;};event.stopImmediatePropagation??=()=>{event.stopped=true;};const path=[];for(let n=this;n;n=n.parentNode)path.push(n);for(const n of [...path].reverse()){for(const l of n.listeners.get(event.type)||[]){if(l.capture){l.fn(event);if(event.stopped)return !event.defaultPrevented;}}}for(const n of path){for(const l of n.listeners.get(event.type)||[]){if(!l.capture){l.fn(event);if(event.stopped)return !event.defaultPrevented;}}}return !event.defaultPrevented;}
    click(){this.dispatchEvent({type:'click'});}
    focus(){doc.activeElement=this;for(let n=this;n;n=n.parentNode)if(n.host){n.activeElement=this;break;}}
    scrollTo(options){this.scrollTop=options.top;}
    getBoundingClientRect(){return{top:0,left:0,right:300,bottom:this.offsetHeight,width:300,height:this.offsetHeight};}
  }
  doc.body=new Node('body');doc.createElement=tag=>new Node(tag);doc.createElementNS=(_,tag)=>new Node(tag);doc.createTextNode=text=>new Node('#text',String(text));
  return doc;
}

function deferredClient(c,options,kind){
  const calls=[],waiting=new Set();let consent=Boolean(options.consent),destroyed=false,aborts=0;
  function request(args){calls.push(args);const plan=(options.plan||(()=>({delay:0,value:null})))(...args);return new Promise(resolve=>{const record={resolve,timer:null};waiting.add(record);record.timer=c.setTimeout(()=>{waiting.delete(record);resolve(plan.value);},plan.delay);});}
  function abort(){aborts++;if(options.ignoreAbort)return;for(const record of waiting){c.clearTimeout(record.timer);record.resolve(null);}waiting.clear();}
  const client={check:async()=>true,getState:()=>({consent}),setConsent(value){abort();return consent=Boolean(value);},abort,destroy(){destroyed=true;abort();},calls,get aborted(){return aborts;},get destroyed(){return destroyed;}};
  if(kind==='ai')client.suggest=text=>request([text]);else client.get=(productId,field)=>request([productId,field]);
  return client;
}

async function fixture(options={}){
  const c=clock(),doc=fakeDocument(),events=new Map(),network=[],storage=[],alerts=[],dragCalls=[];
  const epoch=Date.parse('2026-10-13T12:00:00Z');
  class ClockDate extends Date{constructor(...args){super(...(args.length?args:[epoch+c.now]));}static now(){return epoch+c.now;}}
  const root={document:doc,location:{origin:'https://mam.test',href:'https://mam.test/demo'},innerHeight:800,setTimeout:c.setTimeout,clearTimeout:c.clearTimeout,addEventListener:(name,fn)=>events.set(name,fn),removeEventListener:(name,fn)=>{if(events.get(name)===fn)events.delete(name);}};
  root.alert=value=>alerts.push(String(value));
  if(options.drag)root.ThanhAnDrag={create(){return{reset(){dragCalls.push('reset');},reclamp(){dragCalls.push('reclamp');},destroy(){dragCalls.push('destroy');}};}};
  root.ThanhAnMascot={create(){return{element:doc.createElement('canvas'),ready:Promise.resolve(),setState(){},setPaused(){},destroy(){}};}};
  const menuCalls=[];
  root.ThanhAnPriceMenu={isMenuRequest:text=>/^(xem gia|xem bang gia)$/.test(root.ThanhAnFAQ.normalize(text)),buildCatalog:()=>({categories:[{id:'namecard',name:'Danh thiếp'},{id:'catalogue',name:'Catalogue'}]}),create({onActivity}){const element=doc.createElement('div');const b=doc.createElement('button');b.className='ta-price-category';b.textContent='Danh thiếp';element.appendChild(b);b.addEventListener('click',()=>{menuCalls.push(c.now);element.dataset.selected='namecard';onActivity();});return{element,destroy(){element.remove();},showCategory(){}};}};
  let ai=options.ai?deferredClient(c,options.ai,'ai'):null;
  const aiRequests=[],aiPending=[];
  const aiFetch=(url,init)=>{
    assert.equal(new URL(url).origin,root.location.origin);
    assert.equal(new URL(url).pathname,'/api/mam-ai');
    aiRequests.push({...init});
    const value=init.method==='GET'?{version:1,enabled:options.realAi.enabled!==false,privacyVersion:'google-free-v1'}:{version:1,kind:'suggestion',intent:'product',categoryId:'catalogue'};
    const response={ok:true,text:async()=>JSON.stringify(value)};
    if(options.realAi.pendingMetadata&&init.method==='GET'||options.realAi.pending&&init.method==='POST')return new Promise(resolve=>aiPending.push({method:init.method,resolve:()=>resolve(response)}));
    return Promise.resolve(response);
  };
  const info=options.info?deferredClient(c,options.info,'info'):null;
  if(ai)root.ThanhAnGemini={create:()=>ai};if(info)root.ThanhAnSourceInfo={create:()=>info};
  const fetch=()=>{network.push('fetch');throw new Error('Network is forbidden in this fixture');};
  const unavailableStorage=new Proxy({},{get(_,key){storage.push(String(key));throw new Error('Visitor storage is forbidden in this fixture');}});
  root.localStorage=unavailableStorage;root.sessionStorage=unavailableStorage;
  const context=vm.createContext({window:root,document:doc,location:root.location,URL,Date:ClockDate,AbortController,fetch,localStorage:unavailableStorage,sessionStorage:unavailableStorage,setTimeout:c.setTimeout,clearTimeout:c.clearTimeout,requestAnimationFrame:fn=>c.setTimeout(fn,16),cancelAnimationFrame:c.clearTimeout});
  for(const name of ['policy','presentation',...(options.realAi?['gemini-client']:[])])vm.runInContext(sources[name],context,{filename:name+'.js'});
  if(options.realAi){const originalCreate=root.ThanhAnGemini.create;root.ThanhAnGemini={...root.ThanhAnGemini,create(settings){return ai=originalCreate(settings);}};}
  vm.runInContext(sources.widget,context,{filename:'widget.js'});
  let answers=0,resets=0;
  const original=root.ThanhAnFAQ;
  root.ThanhAnFAQ={...original,createSession(...args){const session=original.createSession(...args);return{answer(...values){answers++;return session.answer(...values);},reset(){resets++;session.reset();}};}};
  const widget=await root.ThanhAnChat.mount({data,styles:'/* fixture styles */',reducedMotion:options.reducedMotion,aiEndpoint:ai||options.realAi?'/api/mam-ai':undefined,aiFetch:options.realAi?aiFetch:undefined,infoEndpoint:info?'/api/mam-info':undefined});
  const f={clock:c,document:doc,root,widget,ai,info,network,storage,alerts,dragCalls,menuCalls,aiRequests,posts:()=>aiRequests.filter(call=>call.method==='POST'),resolveAi(method='POST'){aiPending.find(call=>call.method===method)?.resolve();},get answers(){return answers;},get resets(){return resets;},find:selector=>widget.shadow.querySelector(selector),all:selector=>widget.shadow.querySelectorAll(selector),bots:()=>widget.shadow.querySelectorAll('.ta-message').filter(n=>!n.classList.contains('ta-message-user')&&!n.classList.contains('ta-message-typing')),users:()=>widget.shadow.querySelectorAll('.ta-message-user')};
  if(options.open!==false){widget.open();await c.advance(320);}
  return f;
}

async function prepared(t,options){const f=await fixture(options);t.after(()=>{f.widget.destroy();assert.deepEqual(f.network,[]);assert.deepEqual(f.storage,[]);assert.deepEqual(f.alerts,[]);});return f;}
const noTyping=f=>assert.equal(f.all('.ta-message-typing').length,0);
const typing=f=>{assert.equal(f.all('.ta-message-typing').length,1);assert.equal(f.all('.ta-typing-dot').length,3);assert.equal(f.find('.ta-typing-dots').getAttribute('aria-hidden'),'true');assert.equal(f.find('.ta-typing-bubble').textContent,'Mầm đang trả lời');};
const noInformationUi=f=>{
  for(const selector of ['.ta-privacy-open','.ta-privacy-document','.ta-ai-notice','.ta-ai-options','.ta-ai-label','.ta-ai-helper','.ta-ai-title','.ta-ai-consent'])assert.equal(f.find(selector),null);
  assert.equal(f.find('.ta-aux-view').dataset.view==='privacy',false);assert.equal(f.find('.ta-alert').hidden,true);assert.equal(f.find('.ta-alert').textContent,'');
  const interfaceText=node=>node.classList.contains('ta-message-user')?'':node._text+node.children.map(interfaceText).join('');
  assert.doesNotMatch(interfaceText(f.find('.ta-panel')),/quyền riêng tư|Google|Gemini|người xét duyệt|18 tuổi|Bật hiểu sâu|Giúp Mầm hiểu/iu);assert.deepEqual(f.alerts,[]);
  for(const node of [...f.all('button'),...f.all('a')])assert.doesNotMatch([node.textContent,node.getAttribute('aria-label'),node.getAttribute('title'),node.href].filter(Boolean).join(' '),/privacy|quyền riêng tư|thông tin\s*&/iu);
};

test('opening the actual widget shows three dots before the greeting and renders at320ms',async t=>{
  const f=await prepared(t,{open:false});f.widget.open();typing(f);assert.equal(f.bots().length,0);await f.clock.advance(319);assert.equal(f.bots().length,0);typing(f);await f.clock.advance(1);noTyping(f);assert.equal(f.bots().length,1);assert.match(f.bots()[0].textContent,/Mầm chào bạn/);
});
test('local policy runs immediately while the visible reply waits320ms',async t=>{
  const f=await prepared(t),before=f.bots().length;const result=f.widget.send('Danh thiếp in nhanh C300 5 hộp');assert.equal(f.answers,1);typing(f);assert.equal(f.bots().length,before);await f.clock.advance(319);assert.equal(f.bots().length,before);await f.clock.advance(1);await result;noTyping(f);assert.equal(f.bots().length,before+1);assert.equal(f.find('.ta-quote-total').textContent,'5 hộp: 400.000 ₫');assert.deepEqual(f.network,[]);
});
test('reduced motion keeps the same320ms response floor',async t=>{
  const f=await prepared(t,{reducedMotion:true}),before=f.bots().length;const result=f.widget.send('Giờ làm việc');await f.clock.advance(319);assert.equal(f.bots().length,before);await f.clock.advance(1);await result;assert.equal(f.bots().length,before+1);noTyping(f);
});
for(const [name,delay]of [['fast',40],['slow',900]])test('unknown '+name+' classification and presentation run in parallel with max latency',async t=>{
  const f=await prepared(t,{ai:{plan:()=>({delay,value:{intent:'product',categoryId:'catalogue'}})}}),before=f.bots().length,start=f.clock.now;const result=f.widget.send('xyz'+name);await microtasks();assert.equal(f.ai.calls.length,1);typing(f);await f.clock.advance(Math.max(320,delay)-1);assert.equal(f.bots().length,before);typing(f);await f.clock.advance(1);await result;assert.equal(f.clock.now-start,Math.max(320,delay));assert.equal(f.bots().length,before+1);assert.match(f.bots().at(-1).textContent,/catalogue/);assert.equal(f.bots().at(-1).querySelector('.ta-consult-cta').textContent,'Tư vấn qua Zalo');noTyping(f);
});
test('duplicate pending input shares the promise, policy turn and user bubble',async t=>{
  const f=await prepared(t),a=f.widget.send('Catalogue A4 300 cuốn'),b=f.widget.send('Catalogue A4 300 cuốn');assert.equal(a,b);assert.equal(f.answers,1);assert.equal(f.users().length,1);typing(f);await f.clock.advance(320);await a;assert.match(f.bots().at(-1).textContent,/bao nhiêu trang/);
});
test('a new local turn cancels only the stale presentation and preserves synchronously applied slots',async t=>{
  const f=await prepared(t),before=f.bots().length;const old=f.widget.send('Catalogue A4 300 cuốn');await f.clock.advance(100);const current=f.widget.send('16 trang');await old;assert.equal(f.answers,2);assert.equal(f.bots().length,before);typing(f);await f.clock.advance(219);assert.equal(f.bots().length,before);await f.clock.advance(101);await current;assert.equal(f.bots().length,before+1);assert.doesNotMatch(f.bots().at(-1).textContent,/bao nhiêu trang/);const quote=f.widget.send('Bìa C300 ruột C150');await f.clock.advance(320);await quote;assert.equal(f.all('.ta-quote-total').at(-1).textContent,'300 cuốn: 6.900.000 ₫');
});
test('an ignored late AI completion cannot replace a newer local reply',async t=>{
  const f=await prepared(t,{ai:{ignoreAbort:true,plan:()=>({delay:900,value:{intent:'product',categoryId:'catalogue'}})}}),before=f.bots().length;const old=f.widget.send('xyzlate');await microtasks();assert.equal(f.ai.calls.length,1);await f.clock.advance(100);const latest=f.widget.send('Giờ làm việc');await f.clock.advance(320);await latest;assert.equal(f.bots().length,before+1);const reply=f.bots().at(-1).textContent;await f.clock.advance(480);await old;assert.equal(f.bots().length,before+1);assert.equal(f.bots().at(-1).textContent,reply);noTyping(f);
});
test('source lookup uses product and field only and fast results wait for presentation',async t=>{
  const f=await prepared(t,{info:{plan:()=>({delay:40,value:{kind:'information',text:'Dạ, gửi PDF đúng quy cách ạ.',sources:[{provider:'thanh-an',url:'https://innhanhtphcm.com/san-pham/in-danh-thiep-chuan-gia-re'}]}})}});let p=f.widget.send('Danh thiếp in nhanh C300 5 hộp');await f.clock.advance(320);await p;const before=f.bots().length;p=f.widget.send('File như nào?');assert.deepEqual(f.info.calls,[['namecard-c300','fileRequirements']]);await f.clock.advance(319);assert.equal(f.bots().length,before);await f.clock.advance(1);await p;assert.match(f.bots().at(-1).textContent,/PDF/);assert.equal(f.bots().at(-1).classList.contains('ta-message-quote'),false);noTyping(f);p=f.widget.send('tổng tiền');await f.clock.advance(320);await p;assert.equal(f.all('.ta-quote-total').at(-1).textContent,'5 hộp: 400.000 ₫');
});
test('slow source lookup adds no second presentation wait',async t=>{
  const f=await prepared(t,{info:{plan:()=>({delay:900,value:{kind:'information',text:'Dạ, gửi PDF ạ.',sources:[]}})}});const p=f.widget.send('Danh thiếp in nhanh gửi file gì?'),before=f.bots().length;await f.clock.advance(899);assert.equal(f.bots().length,before);await f.clock.advance(1);await p;assert.match(f.bots().at(-1).textContent,/PDF/);noTyping(f);
});
for(const action of ['close','clear','destroy'])test(action+' resolves a pending local presentation and removes its dots/timer',async t=>{
  const f=await prepared(t),before=f.bots().length;let done=false;const p=f.widget.send('Giờ làm việc').then(()=>{done=true;});await f.clock.advance(100);if(action==='clear')f.find('.ta-clear').click();else f.widget[action]();await microtasks();assert.equal(done,true);await p;if(action==='destroy'){assert.equal(f.widget.host.isConnected,false);assert.equal(f.clock.pending.size,0);}else if(action==='clear'){typing(f);assert.equal(f.bots().length,0);await f.clock.advance(320);assert.equal(f.bots().length,1);}else{noTyping(f);await f.clock.advance(220);assert.equal(f.bots().length,before);}assert.deepEqual(f.network,[]);
});
test('close aborts async work and a late ignored result never renders after reopening',async t=>{
  const f=await prepared(t,{ai:{ignoreAbort:true,plan:()=>({delay:900,value:{intent:'product',categoryId:'catalogue'}})}}),before=f.bots().length;const p=f.widget.send('xyzclose');await microtasks();assert.equal(f.ai.calls.length,1);await f.clock.advance(100);const aborts=f.ai.aborted;f.widget.close();assert.ok(f.ai.aborted>aborts);noTyping(f);f.widget.open();await f.clock.advance(800);await p;assert.equal(f.bots().length,before);noTyping(f);
});
test('clear resets the actual local conversation and cancels a deferred source response',async t=>{
  const f=await prepared(t,{info:{plan:()=>({delay:900,value:{kind:'information',text:'Dạ, gửi PDF ạ.',sources:[]}})}});let p=f.widget.send('Danh thiếp in nhanh C300 5 hộp');await f.clock.advance(320);await p;p=f.widget.send('File như nào?');await f.clock.advance(100);f.find('.ta-clear').click();await microtasks();await p;assert.equal(f.resets,1);await f.clock.advance(320);assert.equal(f.bots().length,1);const next=f.widget.send('5 hộp');await f.clock.advance(320);await next;assert.equal(f.all('.ta-message-quote').length,0);assert.doesNotMatch(f.bots().at(-1).textContent,/400\.000/);
});
for(const action of ['close','destroy'])test(action+' settles source work immediately and prevents its late reply',async t=>{
  const f=await prepared(t,{info:{plan:()=>({delay:900,value:{kind:'information',text:'Dạ, gửi PDF ạ.',sources:[]}})}});let p=f.widget.send('Danh thiếp in nhanh C300 5 hộp');await f.clock.advance(320);await p;const before=f.bots().length;let done=false;p=f.widget.send('File như nào?').then(()=>{done=true;});assert.equal(f.info.calls.length,1);await f.clock.advance(100);const aborts=f.info.aborted;f.widget[action]();await microtasks();assert.equal(done,true);await p;assert.ok(f.info.aborted>aborts);noTyping(f);if(action==='destroy'){assert.equal(f.info.destroyed,true);assert.equal(f.clock.pending.size,0);}await f.clock.advance(900);assert.equal(f.bots().length,before);
});
test('direct source anchors use the confirmed display mapping without a source-details wrapper',async t=>{
  const f=await prepared(t),p=f.widget.send('Catalogue A4 C300 16 trang 300 cuốn');await f.clock.advance(320);await p;const anchors=f.all('.ta-source');assert.ok(anchors.length);assert.equal(anchors[0].textContent,'Xem chi tiết');assert.equal(anchors[0].href,'https://innhanhtphcm.com/san-pham/in-catalogue-gia-re-lay-lien-tai-tphcm');assert.equal(anchors[0].target,'_blank');assert.equal(anchors[0].rel,'noopener noreferrer');assert.equal(anchors[0].referrerPolicy,'no-referrer');assert.equal(f.all('.ta-source-details').length,0);assert.deepEqual(f.network,[]);
});
test('quote category choices include a consult button which opens only verified contact links',async t=>{
  const f=await prepared(t),p=f.widget.send('Xem giá');typing(f);await f.clock.advance(320);await p;const choices=f.find('.ta-quote-products');assert.equal(choices.querySelectorAll('button').length,2);const consult=f.find('.ta-consult-cta');assert.equal(consult.textContent,'Tư vấn qua Zalo');assert.equal(consult.parentElement.querySelector('p'),null);consult.click();assert.equal(f.find('.ta-aux-view').hidden,true);await f.clock.advance(320);assert.equal(f.find('.ta-aux-view').dataset.view,'contacts');assert.equal(f.find('.ta-aux-title').textContent,'Tư vấn qua Zalo');assert.equal(f.find('.ta-contact-intro'),null);assert.deepEqual(f.all('.ta-zalo').map(a=>a.href),data.contacts.map(c=>c.zalo));assert.deepEqual(f.all('.ta-tel').map(a=>a.href),data.contacts.map(c=>'tel:'+c.phone));assert.deepEqual(f.network,[]);
});
test('the quick consultation label is exact and preserves the three adviser destinations',async t=>{
  const f=await prepared(t),quick=f.find('.ta-quick').querySelectorAll('button').find(button=>button.getAttribute('aria-label')==='Tư vấn qua Zalo');assert.ok(quick);assert.equal(quick.textContent,'Tư vấn qua Zalo');quick.click();typing(f);await f.clock.advance(320);assert.equal(f.find('.ta-aux-view').dataset.view,'contacts');assert.equal(f.find('.ta-contact-intro'),null);assert.equal(f.all('.ta-contact').length,3);assert.deepEqual(f.all('.ta-zalo').map(a=>a.href),data.contacts.map(c=>c.zalo));assert.deepEqual(f.all('.ta-tel').map(a=>a.href),data.contacts.map(c=>'tel:'+c.phone));assert.deepEqual(f.network,[]);
});
test('ordinary clarification choices include consultation while the greeting keeps its compact choices',async t=>{
  const f=await prepared(t);assert.equal(f.bots()[0].querySelector('.ta-consult-cta'),null);const p=f.widget.send('Danh thiếp');await f.clock.advance(320);await p;const block=f.bots().at(-1);assert.match(block.textContent,/in offset hay in nhanh/);assert.equal(block.querySelector('.ta-consult-cta').textContent,'Tư vấn qua Zalo');assert.ok(block.querySelectorAll('.ta-chip').some(b=>b.textContent==='In offset'));assert.ok(block.querySelectorAll('.ta-chip').some(b=>b.textContent==='In nhanh'));
});
test('full price menu selection receives the same320ms dots before changing its content',async t=>{
  const f=await prepared(t),p=f.widget.send('Xem bảng giá');await f.clock.advance(320);await p;const b=f.find('.ta-price-category');b.click();typing(f);assert.equal(f.menuCalls.length,0);await f.clock.advance(319);assert.equal(f.menuCalls.length,0);await f.clock.advance(1);assert.equal(f.menuCalls.length,1);noTyping(f);assert.equal(f.find('.ta-aux-view').scrollTop,0);
});
test('back navigation destroys a pending menu without leaving typing or a working activity state',async t=>{
  const f=await prepared(t),p=f.widget.send('Xem bảng giá');await f.clock.advance(320);await p;f.find('.ta-price-category').click();typing(f);await f.clock.advance(100);f.find('.ta-view-back').click();assert.equal(f.find('.ta-aux-view').hidden,true);assert.equal(f.find('.ta-price-category'),null);await f.clock.advance(220);assert.equal(f.menuCalls.length,0);noTyping(f);assert.equal(f.widget.host.dataset.activity,'idle');
});
test('plain XSS input remains literal text and never creates injected elements',async t=>{
  const f=await prepared(t),text='<img src=x onerror=alert(1)><script>alert(2)</script>';const p=f.widget.send(text);assert.equal(f.users().at(-1).querySelector('.ta-message-bubble').textContent,text);await f.clock.advance(320);await p;assert.equal(f.all('img').length,0);assert.equal(f.all('script').length,0);assert.equal(f.all('.ta-message-quote').length,0);assert.deepEqual(f.network,[]);
});

test('enabled metadata automatically handles an unknown turn while FAQ remains local and history stays out of the POST',async t=>{
  const f=await prepared(t,{realAi:{}});
  assert.equal(f.aiRequests.length,1);assert.equal(f.aiRequests[0].method,'GET');
  let p=f.widget.send('kt a4 là bao nhiêu');await f.clock.advance(320);await p;
  assert.match(f.bots().at(-1).textContent,/21 × 29,7 cm/);assert.equal(f.posts().length,0);
  p=f.widget.send('zz_default_unknown');await microtasks();assert.equal(f.posts().length,1);await f.clock.advance(320);await p;
  assert.ok(f.bots().at(-1).querySelectorAll('button').some(button=>button.textContent==='Xem lựa chọn Catalogue'));
  const body=JSON.parse(f.posts()[0].body);
  assert.deepEqual(body,{version:1,message:'zz_default_unknown',consent:'google-free-v1',adult:true});
  assert.equal(f.posts()[0].credentials,'omit');assert.equal(f.posts()[0].referrerPolicy,'no-referrer');
  assert.doesNotMatch(f.posts()[0].body,/kt a4|21|history|priceFacts|contacts/);
});

test('disabled metadata keeps unknown messages local without information controls or notices',async t=>{
  const f=await prepared(t,{realAi:{enabled:false}}),p=f.widget.send('zz_disabled_unknown');await f.clock.advance(320);await p;
  assert.equal(f.aiRequests.length,1);assert.equal(f.posts().length,0);assert.equal(f.ai.getState().consent,false);
  noInformationUi(f);
  assert.ok(!f.bots().at(-1).querySelectorAll('button').some(button=>button.textContent==='Xem lựa chọn Catalogue'));
});

test('metadata readiness is required before automatic understanding can send a question',async t=>{
  const f=await prepared(t,{realAi:{pendingMetadata:true}});
  assert.equal(f.ai.getState().consent,false);assert.equal(f.posts().length,0);
  const p=f.widget.send('zz_metadata_ready_unknown');await microtasks();typing(f);assert.equal(f.posts().length,0);
  await f.clock.advance(320);assert.equal(f.bots().length,1);typing(f);
  f.resolveAi('GET');await microtasks();
  assert.equal(f.posts().length,1);await p;
  assert.ok(f.bots().at(-1).querySelectorAll('button').some(button=>button.textContent==='Xem lựa chọn Catalogue'));
});

for(const action of ['close','clear'])test(action+' settles an early unknown turn without aborting metadata or sending it later',async t=>{
  const f=await prepared(t,{realAi:{pendingMetadata:true}});let settled=false;
  const p=f.widget.send('zz_early_old_'+action).then(()=>{settled=true;});await microtasks();typing(f);assert.equal(f.posts().length,0);
  if(action==='clear')f.find('.ta-clear').click();else f.widget.close();
  await microtasks();assert.equal(settled,true);await p;assert.equal(f.aiRequests[0].signal.aborted,false);
  f.resolveAi('GET');await microtasks();assert.equal(f.posts().length,0);
  if(action==='close')f.widget.open();else await f.clock.advance(320);
  const current=f.widget.send('zz_early_current_'+action);await microtasks();assert.equal(f.posts().length,1);await f.clock.advance(320);await current;
  assert.equal(JSON.parse(f.posts()[0].body).message,'zz_early_current_'+action);
  assert.ok(f.bots().at(-1).querySelectorAll('button').some(button=>button.textContent==='Xem lựa chọn Catalogue'));
});

test('destroy settles an early unknown turn and aborts unresolved metadata without a later POST',async t=>{
  const f=await prepared(t,{realAi:{pendingMetadata:true}});let settled=false;
  const p=f.widget.send('zz_destroy_before_metadata').then(()=>{settled=true;});await microtasks();typing(f);
  f.widget.destroy();await microtasks();assert.equal(settled,true);await p;
  assert.equal(f.aiRequests[0].signal.aborted,true);assert.equal(f.clock.pending.size,0);assert.equal(f.widget.host.isConnected,false);
  f.resolveAi('GET');await microtasks();assert.equal(f.posts().length,0);assert.equal(f.clock.pending.size,0);noTyping(f);
});

test('automatic understanding filters synthetic private text instead of sending it',async t=>{
  const f=await prepared(t,{realAi:{}});
  for(const text of ['fictional@example.invalid','Số điện thoại thử nghiệm 0901234567','mật khẩu thử nghiệm chỉ dùng trong test','<img src=x onerror=alert(1)>']){
    const p=f.widget.send(text);await f.clock.advance(320);await p;assert.equal(f.posts().length,0);
  }
  assert.equal(f.all('img').length,0);assert.equal(f.all('script').length,0);
});

test('clear resets local chat while a new unknown turn still uses automatic understanding',async t=>{
  const f=await prepared(t,{realAi:{}});let p=f.widget.send('kt a4 là bao nhiêu');await f.clock.advance(320);await p;
  f.find('.ta-clear').click();await f.clock.advance(320);assert.equal(f.bots().length,1);assert.equal(f.users().length,0);
  p=f.widget.send('zz_after_clear_unknown');await microtasks();assert.equal(f.posts().length,1);await f.clock.advance(320);await p;
  assert.ok(f.bots().at(-1).querySelectorAll('button').some(button=>button.textContent==='Xem lựa chọn Catalogue'));
  assert.equal(JSON.parse(f.posts()[0].body).message,'zz_after_clear_unknown');
});

for(const action of ['close','clear','destroy'])test(action+' aborts automatic understanding and suppresses ignored-abort late results',async t=>{
  const f=await prepared(t,{realAi:{pending:true}}),before=f.bots().length;
  const p=f.widget.send('zz_cancel_'+action);await microtasks();assert.equal(f.posts().length,1);typing(f);
  if(action==='clear')f.find('.ta-clear').click();else f.widget[action]();
  await microtasks();await p;assert.equal(f.posts()[0].signal.aborted,true);
  if(action==='clear'){await f.clock.advance(320);assert.equal(f.bots().length,1);assert.equal(f.users().length,0);}
  if(action==='close'){f.widget.open();assert.equal(f.bots().length,before);}
  const chatAfterAction=f.find('.ta-log').textContent;
  f.resolveAi();await microtasks();await f.clock.advance(900);
  assert.equal(f.find('.ta-log').textContent,chatAfterAction);noTyping(f);
  assert.ok(!f.all('button').some(button=>button.textContent==='Xem lựa chọn Catalogue'));
  if(action==='destroy'){assert.equal(f.widget.host.isConnected,false);assert.equal(f.clock.pending.size,0);}
  else assert.equal(f.ai.getState().consent,true);
});

for(const options of [{},{realAi:{}},{realAi:{enabled:false}}])test('removed information UI has no replacement and remaining header/form keyboard actions work '+JSON.stringify(options),async t=>{
  const f=await prepared(t,{...options,drag:true});noInformationUi(f);assert.equal(f.all('input').some(input=>input.type==='checkbox'),false);
  const actions=f.find('.ta-header-actions').querySelectorAll('button');assert.equal(actions.length,3);
  assert.deepEqual(actions.map(button=>button.getAttribute('aria-label')).sort(),['Di chuyển hoặc đặt lại vị trí','Làm mới','Đóng trò chuyện'].sort());
  for(const button of actions){assert.equal(button.type,'button');assert.equal(Boolean(button.disabled),false);button.focus();assert.equal(f.widget.shadow.activeElement,button);}
  f.find('.ta-window-drag').focus();f.find('.ta-window-drag').click();assert.ok(f.dragCalls.includes('reset'));
  const input=f.find('.ta-input');input.focus();input.value='Giờ làm việc';f.find('.ta-form').dispatchEvent({type:'submit'});typing(f);await f.clock.advance(320);noTyping(f);assert.equal(f.users().at(-1).querySelector('.ta-message-bubble').textContent,'Giờ làm việc');noInformationUi(f);
  f.find('.ta-clear').focus();f.find('.ta-clear').click();await f.clock.advance(320);assert.equal(f.bots().length,1);assert.equal(f.users().length,0);assert.equal(f.widget.shadow.activeElement,input);noInformationUi(f);
  f.find('.ta-close').focus();f.find('.ta-close').click();assert.equal(f.find('.ta-panel').hidden,true);assert.equal(f.widget.shadow.activeElement,f.find('.ta-launcher'));
  f.widget.open();input.dispatchEvent({type:'keydown',key:'Escape'});assert.equal(f.find('.ta-panel').hidden,true);assert.equal(f.widget.shadow.activeElement,f.find('.ta-launcher'));
  f.widget.open();assert.equal(f.widget.shadow.activeElement,input);noInformationUi(f);
});
