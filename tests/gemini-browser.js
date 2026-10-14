(function(){'use strict';
const byId=id=>document.getElementById(id),run=byId('run'),summary=byId('summary'),list=byId('results');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const frames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
const microtasks=async()=>{for(let n=0;n<12;n++)await Promise.resolve();};
async function controlledFinish(promise){let timer;try{await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Presentation did not settle after the controlled deadline')),1500);})]);}finally{clearTimeout(timer);}}
function manualTimers(){let now=0,nextId=0;const pending=new Map();return {setTimeout(callback,delay){const id=++nextId;pending.set(id,{callback,due:now+delay});return id;},clearTimeout(id){pending.delete(id);},advance(ms){const target=now+ms;for(;;){const ready=[...pending].filter(([,task])=>task.due<=target).sort((a,b)=>a[1].due-b[1].due||a[0]-b[0])[0];if(!ready)break;now=ready[1].due;pending.delete(ready[0]);ready[1].callback();}now=target;},get now(){return now;},get pending(){return pending.size;}};}
const metadata={version:1,enabled:true,privacyVersion:'google-free-v1'};
const suggestion={version:1,kind:'suggestion',intent:'product',categoryId:'catalogue'};
const unknown='zz_mock_gemini_unknown';
const EARRING_SOURCE='https://invinhphat.com/san-pham/in-tag-treo-khuyen-tai/';
const CATALOGUE_SOURCE='https://invinhphat.com/san-pham/in-catalouge/';
const CATALOGUE_DISPLAY_SOURCE='https://innhanhtphcm.com/san-pham/in-catalogue-gia-re-lay-lien-tai-tphcm';
const A5_SOURCE='https://invinhphat.com/san-pham/in-catalogue-a5/';
const DECAL_SOURCE='https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/';
const INFO_SOURCE='https://innhanhtphcm.com/san-pham/in-card-visit-offset';
const INFO_QUERY='cán màng có loại nào?';
const INFO_TEXT='MOCK: Cán màng mờ hoặc bóng; cần xác nhận loại phù hợp với ấn phẩm.';
const fakeResponse=(value,status=200)=>({ok:status>=200&&status<300,text:async()=>JSON.stringify(value)});
function rgb(value){const match=value.match(/^rgba?\(([^)]+)\)$/);if(!match)return null;const values=match[1].split(/[\s,\/]+/).filter(Boolean).map(Number);return {r:values[0]/255,g:values[1]/255,b:values[2]/255,a:values[3]??1};}
function composite(top,bottom){const a=top.a+bottom.a*(1-top.a);return {r:(top.r*top.a+bottom.r*bottom.a*(1-top.a))/a,g:(top.g*top.a+bottom.g*bottom.a*(1-top.a))/a,b:(top.b*top.a+bottom.b*bottom.a*(1-top.a))/a,a};}
function contrast(element){const chain=[];for(let node=element;node;node=node.parentElement)chain.push(node);let background={r:1,g:1,b:1,a:1};for(const node of chain.reverse()){const color=rgb(getComputedStyle(node).backgroundColor);if(color)background=composite(color,background);}const foreground=rgb(getComputedStyle(element).color);if(!foreground)return 0;const luminance=color=>[color.r,color.g,color.b].map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);const a=luminance(composite(foreground,background)),b=luminance(background);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);}
function visibleContentViews(content){return [...content.children].filter(element=>!element.hidden&&getComputedStyle(element).display!=='none'&&element.getBoundingClientRect().height>0);}
function verticalScrollOwners(content){return [content,...content.querySelectorAll('*')].filter(element=>element.clientHeight>0&&element.getBoundingClientRect().height>0&&['auto','scroll'].includes(getComputedStyle(element).overflowY)&&element.scrollHeight>element.clientHeight+1);}
let widget=null;
async function until(predicate,ms=2000){const start=performance.now();while(!predicate()){if(performance.now()-start>ms)throw new Error('Mock harness condition timed out');await sleep(10);}}
async function tests(){
 run.disabled=true;list.replaceChildren();summary.textContent='Đang chạy mock.';
 if(widget){widget.destroy();widget=null;}
 const began=new Date().toISOString(),results=[];
 const check=(name,pass,detail='')=>{const record={name,pass:!!pass,detail};results.push(record);const row=document.createElement('li');row.className=pass?'pass':'fail';row.textContent=(pass?'PASS · ':'FAIL · ')+name+(detail?' — '+detail:'');list.appendChild(row);};
 const lastBubble=()=>widget.shadow.querySelector('.ta-log').lastElementChild?.querySelector('.ta-message-bubble')?.textContent||'';
 const plainReply=()=>{const text=lastBubble().replace(/^Dạ,\s*/u,'');return text.charAt(0).toLocaleUpperCase('vi-VN')+text.slice(1);};
 const hasMockInfo=()=>lastBubble().toLocaleLowerCase('vi-VN').includes(INFO_TEXT.toLocaleLowerCase('vi-VN'));
 const compactPrice=(text,quantity,unit,total,specs=[])=>{const lines=text.split('\n'),amount=quantity.toLocaleString('vi-VN')+' '+unit+': '+total.toLocaleString('vi-VN')+' ₫';return lines.length===2&&specs.every(spec=>lines[0].includes(spec))&&(lines[1]===amount||lines[1]===amount+' (chưa VAT)')&&!/Tổng tham khảo|Nguồn giá|mức nguồn|quy tắc chủ|đơn thực tế|cần tư vấn viên/i.test(text);};
 try{
  const [data,styles,languageData]=await Promise.all([fetch('../widget/data.json',{credentials:'omit'}).then(r=>r.json()),fetch('../widget/widget.css',{credentials:'omit'}).then(r=>r.text()),fetch('../widget/approved-language.json',{credentials:'omit'}).then(r=>r.json())]);
  const languageSnapshot=JSON.stringify(languageData);
  check('Mock classification input reaches only the local unknown branch',ThanhAnFAQ.answer(unknown,data).kind==='unknown');
  const allFacts=data.products.flatMap(p=>p.priceFacts||[]);
  check('The reviewed dataset contains 196 facts and preserves its 62 owner-confirmed records',allFacts.length===196&&data.products.length===23&&allFacts.filter(f=>f.ownerPriceRevision?.kind==='business-owner-price-update').length===62&&allFacts.filter(f=>f.originalSourceRecord).length===46);
  async function mount(options={}){
   if(widget)widget.destroy();const calls=[],infoCalls=[];let resolvePost=null,resolveInfo=null,resolveMetadata=null,metadataRead=false;
   const aiFetch=async(url,init)=>{
    if(new URL(url,location.href).origin!==location.origin||new URL(url,location.href).pathname!=='/api/mam-assist')throw new Error('Unexpected mock endpoint');
    calls.push({method:init.method,body:init.body,signal:init.signal});
    if(init.method==='GET'){
     const response={ok:true,text:async()=>{metadataRead=true;return JSON.stringify(options.metadata||metadata);}};
     if(options.pendingMetadata)return new Promise(resolve=>{resolveMetadata=()=>resolve(response);});
     return response;
    }
    if(options.pending)return new Promise(resolve=>{resolvePost=()=>resolve(fakeResponse(options.reply||suggestion,options.status||200));});
    if(options.offline)throw new Error('Mock offline');
    return fakeResponse(options.reply||suggestion,options.status||200);
   };
   const infoFetch=async(url,init)=>{
    const parsed=new URL(url,location.href);
    if(parsed.origin!==location.origin||parsed.pathname!=='/api/mam-info'||[...parsed.searchParams.keys()].sort().join(',')!=='field,productId,version'||parsed.searchParams.get('version')!=='1'||!data.products.some(product=>product.id===parsed.searchParams.get('productId'))||!ThanhAnSourceInfo.fields.includes(parsed.searchParams.get('field'))||init.method!=='GET'||init.body!==undefined)throw new Error('Unexpected source-information mock request');
    infoCalls.push({url:parsed.href,...init});
    const reply=options.infoReply??{version:1,kind:'information',productId:parsed.searchParams.get('productId'),field:parsed.searchParams.get('field'),text:INFO_TEXT,sources:[{provider:'thanh-an',url:INFO_SOURCE}],reference:false,checkedAtUtc:'2026-10-13T07:00:00.000Z'};
    if(options.infoPending)return new Promise(resolve=>{resolveInfo=()=>resolve(fakeResponse(reply,options.infoStatus||200));});
    if(options.infoOffline)throw new Error('Mock source-information offline');
    return fakeResponse(reply,options.infoStatus||200);
   };
   const languageConfig=options.approvedLanguageUrl?{approvedLanguageUrl:options.approvedLanguageUrl,approvedLanguageFetch:options.approvedLanguageFetch}:{approvedLanguageData:options.approvedLanguageData??languageData};
   const infoConfig=options.sourceInfo?{infoEndpoint:'/api/mam-info',infoFetch}:{};
   const originalPresentation=window.ThanhAnPresentation;
   if(options.presentationTimers)window.ThanhAnPresentation=Object.freeze({create:settings=>originalPresentation.create({...settings,timers:options.presentationTimers})});
   try{widget=await ThanhAnChat.mount({data,styles,reducedMotion:true,aiEndpoint:'/api/mam-assist',aiFetch,...languageConfig,...infoConfig});}finally{window.ThanhAnPresentation=originalPresentation;}
   widget.open();
   const shadow=widget.shadow;
   await until(()=>options.pendingMetadata?calls.some(call=>call.method==='GET'):metadataRead);for(let n=0;n<8;n++)await Promise.resolve();
   if(options.presentationTimers&&!options.keepWelcomePending){options.presentationTimers.advance(320);await microtasks();}
   if(!options.keepWelcomePending)await until(()=>shadow.querySelector('.ta-log .ta-message:not(.ta-message-user):not(.ta-message-typing)')&&typingAbsent(shadow));
   const posts=()=>calls.filter(c=>c.method==='POST');
   return {shadow,posts,calls,infoCalls,resolve:()=>resolvePost?.(),resolveInfo:()=>resolveInfo?.(),resolveMetadata:()=>resolveMetadata?.()};
  }
  const typingAbsent=shadow=>shadow.querySelectorAll('.ta-message-typing').length===0;
  function pendingDots(shadow,staticHeader=true){
   const rows=[...shadow.querySelectorAll('.ta-message-typing')],dots=[...shadow.querySelectorAll('.ta-typing-dot')],subtitle=shadow.querySelector('.ta-subtitle').textContent,bubble=rows[0]?.querySelector('.ta-typing-bubble'),visibleCopy=bubble?.cloneNode(true);
   visibleCopy?.querySelectorAll('.ta-sr-only').forEach(element=>element.remove());
   const hiddenLabels=[...rows[0]?.querySelectorAll('.ta-sr-only')||[]].every(element=>{const style=getComputedStyle(element);return style.position==='absolute'&&style.overflow==='hidden'&&style.clip==='rect(0px, 0px, 0px, 0px)'&&element.getBoundingClientRect().width<=1&&element.getBoundingClientRect().height<=1;});
   return rows.length===1&&!!bubble&&!!rows[0].querySelector('.ta-typing-dots')&&visibleCopy.textContent.trim()===''&&hiddenLabels&&rows[0].getBoundingClientRect().height>0&&dots.length===3&&dots.every(dot=>{const style=getComputedStyle(dot),color=rgb(style.backgroundColor),rect=dot.getBoundingClientRect();return color&&color.a>0&&Math.max(color.r,color.g,color.b)-Math.min(color.r,color.g,color.b)<.14&&rect.width>0&&rect.width<=10&&rect.height>0&&rect.height<=10&&style.animationName==='none';})&&(!staticHeader||subtitle.includes('Trợ lý thông tin in ấn'))&&!/đang|tìm giúp|xử lý|processing|loading|Google|Gemini|Flash|backend|provider|API/i.test(subtitle);
  }
  const botMessages=shadow=>[...shadow.querySelectorAll('.ta-log .ta-message:not(.ta-message-user):not(.ta-message-typing)')];
  async function clickPresented(button,shadow){button.click();await sleep(360);await until(()=>typingAbsent(shadow));}
  async function resetFinished(shadow){await sleep(360);await until(()=>typingAbsent(shadow)&&botMessages(shadow).length===1);}
  function choiceConsult(menu){const foot=menu.querySelector('.ta-price-footer'),links=[...menu.querySelectorAll('.ta-price-footer .ta-price-zalo')];return foot?.querySelector('.ta-price-consult-title')?.textContent==='Tư vấn qua Zalo'&&foot.querySelector('p,strong')===null&&links.length===3&&data.contacts.every(person=>links.some(link=>link.getAttribute('href')===person.zalo&&link.target==='_blank'&&link.rel.includes('noopener')&&link.referrerPolicy==='no-referrer'));}
  // Only presentation timers are controlled here. The actual exported
  // presentation module, widget, DOM and mocked endpoint clients still run.
  let clock=manualTimers(),f=await mount({sourceInfo:true,presentationTimers:clock,keepWelcomePending:true});
  clock.advance(319);await microtasks();const heldWelcome=pendingDots(f.shadow,false)&&botMessages(f.shadow).length===0;
  clock.advance(1);await microtasks();await until(()=>typingAbsent(f.shadow)&&botMessages(f.shadow).length===1);
  check('Opening shows only gray dots before the controlled 320ms deadline and then exactly one welcome',heldWelcome&&/^Dạ[,\s]/u.test(lastBubble())&&typingAbsent(f.shadow)&&botMessages(f.shadow).length===1&&clock.pending===0);
  let timedPending=widget.send('kt a4 là bao nhiêu');await until(()=>pendingDots(f.shadow));clock.advance(319);await microtasks();
  const heldFaq=pendingDots(f.shadow)&&botMessages(f.shadow).length===1&&!botMessages(f.shadow).some(block=>block.textContent.includes('21 × 29,7'));
  clock.advance(1);await controlledFinish(timedPending);
  check('A local FAQ waits behind only three dots until 320ms and then answers without either endpoint',heldFaq&&lastBubble().includes('21 × 29,7 cm')&&typingAbsent(f.shadow)&&botMessages(f.shadow).length===2&&f.posts().length===0&&f.infoCalls.length===0);
  const presentationPrice=allFacts.find(fact=>fact.id==='catalogue-a4-16-500');
  for(const [name,query,visible] of [
   ['quote',presentationPrice.lookupQuery,shadow=>!!shadow.querySelector('.ta-message-quote')],
   ['product choices','Xem giá',shadow=>shadow.querySelectorAll('.ta-quote-products .ta-chip').length===13],
   ['consultation','Liên hệ Zalo',shadow=>shadow.querySelector('.ta-aux-view').dataset.view==='contacts'&&!shadow.querySelector('.ta-aux-view').hidden&&shadow.querySelectorAll('.ta-contact').length===3],
   ['price menu','Xem bảng giá',shadow=>shadow.querySelector('.ta-aux-view').dataset.view==='prices'&&!shadow.querySelector('.ta-aux-view').hidden&&shadow.querySelectorAll('.ta-price-category').length===13]
  ]){
   clock=manualTimers();f=await mount({presentationTimers:clock});timedPending=widget.send(query);await until(()=>pendingDots(f.shadow));clock.advance(319);await microtasks();const held=pendingDots(f.shadow)&&!visible(f.shadow);
   clock.advance(1);await controlledFinish(timedPending);
   check('The local '+name+' appears after the same controlled presentation delay without premature content',held&&visible(f.shadow)&&typingAbsent(f.shadow)&&f.posts().length===0&&f.infoCalls.length===0);
  }
  clock=manualTimers();f=await mount({presentationTimers:clock,pending:true});timedPending=widget.send(unknown);await until(()=>f.posts().length===1);f.resolve();await microtasks();clock.advance(319);await microtasks();const heldFast=pendingDots(f.shadow)&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue');clock.advance(1);await controlledFinish(timedPending);
  check('A fast automatic response cannot render before the shared presentation deadline',heldFast&&typingAbsent(f.shadow)&&f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&f.posts().length===1&&clock.pending===0);
  clock=manualTimers();f=await mount({presentationTimers:clock,pending:true});timedPending=widget.send(unknown);await until(()=>f.posts().length===1);clock.advance(320);await microtasks();const heldSlow=pendingDots(f.shadow)&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue'),slowDeadline=clock.now;f.resolve();await controlledFinish(timedPending);
  check('A slow lookup keeps its dots after 320ms and renders on completion without another presentation delay',heldSlow&&typingAbsent(f.shadow)&&f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&clock.now===slowDeadline&&clock.pending===0);
  const sourcePresentationCases=[];
  for(const slow of [false,true]){
   clock=manualTimers();f=await mount({presentationTimers:clock,sourceInfo:true,infoPending:true});timedPending=widget.send('Danh thiếp in offset 12 hộp');await until(()=>pendingDots(f.shadow));clock.advance(320);await controlledFinish(timedPending);
   timedPending=widget.send(INFO_QUERY);await until(()=>f.infoCalls.length===1);
   if(slow){clock.advance(320);await microtasks();const held=pendingDots(f.shadow)&&!hasMockInfo(),deadline=clock.now;f.resolveInfo();await controlledFinish(timedPending);sourcePresentationCases.push(held&&hasMockInfo()&&typingAbsent(f.shadow)&&clock.now===deadline&&clock.pending===0&&f.posts().length===0);}
   else{f.resolveInfo();await microtasks();clock.advance(319);await microtasks();const held=pendingDots(f.shadow)&&!hasMockInfo();clock.advance(1);await controlledFinish(timedPending);sourcePresentationCases.push(held&&hasMockInfo()&&typingAbsent(f.shadow)&&clock.pending===0&&f.posts().length===0);}
  }
  check('Both fast and slow source replies obey the same minimum delay without adding a second delay after lookup',sourcePresentationCases.length===2&&sourcePresentationCases.every(Boolean));
  clock=manualTimers();f=await mount({presentationTimers:clock});timedPending=widget.send('kt a4 là bao nhiêu');await until(()=>pendingDots(f.shadow));const duplicatePending=widget.send('kt a4 là bao nhiêu'),deduped=duplicatePending===timedPending&&f.shadow.querySelectorAll('.ta-message-typing').length===1;clock.advance(320);await controlledFinish(Promise.all([timedPending,duplicatePending]));
  check('Repeating the same pending message deduplicates its request, typing bubble and eventual reply',deduped&&f.shadow.querySelectorAll('.ta-message-user').length===1&&botMessages(f.shadow).length===2&&typingAbsent(f.shadow)&&f.posts().length===0&&f.infoCalls.length===0);
  clock=manualTimers();f=await mount({presentationTimers:clock});timedPending=widget.send('kt a4 là bao nhiêu');await until(()=>pendingDots(f.shadow));const replacement=widget.send('A5 kích thước');await controlledFinish(timedPending);await until(()=>pendingDots(f.shadow));const oneReplacement=f.shadow.querySelectorAll('.ta-message-typing').length===1;clock.advance(320);await controlledFinish(replacement);
  check('A different new message cancels the earlier presentation and shows only the replacement answer',oneReplacement&&lastBubble().includes('14,8 × 21 cm')&&!botMessages(f.shadow).some(block=>block.textContent.includes('21 × 29,7'))&&botMessages(f.shadow).length===2&&typingAbsent(f.shadow));
  clock=manualTimers();f=await mount({presentationTimers:clock});timedPending=widget.send('kt a4 là bao nhiêu');await until(()=>pendingDots(f.shadow));widget.close();const timerClosedLog=f.shadow.querySelector('.ta-log').textContent,timerClosedImmediately=typingAbsent(f.shadow)&&clock.pending===0;clock.advance(1000);await controlledFinish(timedPending);
  check('Closing cancels an unfinished local presentation so no late answer or dots remain',timerClosedImmediately&&f.shadow.querySelector('.ta-panel').hidden&&typingAbsent(f.shadow)&&f.shadow.querySelector('.ta-log').textContent===timerClosedLog&&!botMessages(f.shadow).some(block=>block.textContent.includes('21 × 29,7')));
  clock=manualTimers();f=await mount({presentationTimers:clock});timedPending=widget.send('kt a4 là bao nhiêu');await until(()=>pendingDots(f.shadow));f.shadow.querySelector('.ta-clear').click();await controlledFinish(timedPending);clock.advance(319);await microtasks();const heldReset=pendingDots(f.shadow,false)&&botMessages(f.shadow).length===0;clock.advance(1);await microtasks();await until(()=>typingAbsent(f.shadow)&&botMessages(f.shadow).length===1);
  check('Reset cancels the old presentation and delays one new welcome with three dots',heldReset&&typingAbsent(f.shadow)&&/^Dạ[,\s]/u.test(lastBubble())&&f.shadow.querySelectorAll('.ta-message').length===1&&f.shadow.querySelectorAll('.ta-message-user').length===0&&clock.pending===0);

  f=await mount();
  check('Understanding checks metadata once and no mode checkbox exists',f.calls.length===1&&f.calls[0].method==='GET'&&f.shadow.querySelector('.ta-ai-consent')===null&&f.shadow.querySelector('input[type="checkbox"]')===null);
  const privacyTrigger=f.shadow.querySelector('.ta-privacy-open');
  const commonText=[f.shadow.querySelector('.ta-header'),f.shadow.querySelector('.ta-log'),f.shadow.querySelector('.ta-quick')].map(element=>element.textContent).join(' ');
  privacyTrigger.focus();const privacyFocusable=f.shadow.activeElement===privacyTrigger&&privacyTrigger.tabIndex===0&&!privacyTrigger.disabled;privacyTrigger.click();
  const privacyView=f.shadow.querySelector('.ta-aux-view[data-view="privacy"]'),content=f.shadow.querySelector('.ta-content'),chatLog=f.shadow.querySelector('.ta-log'),notice=privacyView.textContent;
  check('Google processing, human review and free-tier product improvement are disclosed',notice.includes('Google')&&notice.includes('miễn phí')&&notice.includes('cải thiện')&&notice.includes('người xét duyệt')&&notice.includes('thông tin cá nhân'));
  check('Automatic processing discloses adults, Vietnam and current-message-only limits in accessible privacy information',notice.includes('18 tuổi')&&notice.includes('Việt Nam')&&notice.includes('tự hỗ trợ')&&notice.includes('chỉ câu hiện tại')&&notice.includes('không lưu lâu dài')&&notice.includes('không thu thập chat riêng')&&notice.includes('toàn bộ lịch sử'));
  check('The privacy control stays in the header without a mode selector or provider text in the main chat',f.shadow.querySelector('.ta-header').contains(privacyTrigger)&&privacyTrigger.tagName==='BUTTON'&&privacyTrigger.getAttribute('aria-label')==='Thông tin & quyền riêng tư'&&!f.shadow.querySelector('.ta-ai-options,.ta-ai-label,.ta-ai-helper')&&!/Bật hiểu sâu|Giúp Mầm hiểu|Google|Gemini|Flash|API\s*key|backend|provider|generativelanguage/i.test(commonText));
  check('Privacy opens as the sole content view with keyboard focus and one vertical scroll owner',privacyFocusable&&chatLog.hidden&&!privacyView.hidden&&visibleContentViews(content).length===1&&visibleContentViews(content)[0]===privacyView&&privacyView.contains(f.shadow.activeElement)&&verticalScrollOwners(content).every(element=>element===privacyView)&&privacyTrigger.getAttribute('aria-expanded')==='true');
  privacyView.querySelector('.ta-view-back').click();
  check('Returning from privacy restores chat and keyboard focus to the header control',!chatLog.hidden&&f.shadow.querySelector('.ta-aux-view').hidden&&visibleContentViews(content).length===1&&visibleContentViews(content)[0]===chatLog&&f.shadow.activeElement===privacyTrigger&&privacyTrigger.getAttribute('aria-expanded')==='false');
  privacyTrigger.click();f.shadow.querySelector('.ta-view-back').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,composed:true,cancelable:true}));
  const escapeReturned=!chatLog.hidden&&!f.shadow.querySelector('.ta-panel').hidden&&f.shadow.activeElement===privacyTrigger;
  privacyTrigger.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,composed:true,cancelable:true}));
  check('Escape first returns from the auxiliary view and only then closes the panel',escapeReturned&&f.shadow.querySelector('.ta-panel').hidden&&f.shadow.activeElement===f.shadow.querySelector('.ta-launcher'));
  widget.open();
  const initialBubble=f.shadow.querySelector('.ta-message-bubble'),inputElement=f.shadow.querySelector('.ta-input'),clearButton=f.shadow.querySelector('.ta-clear');
  const readable={bubble:parseFloat(getComputedStyle(initialBubble).fontSize),input:parseFloat(getComputedStyle(inputElement).fontSize),clear:parseFloat(getComputedStyle(clearButton).fontSize),privacy:parseFloat(getComputedStyle(privacyTrigger).fontSize)};
  check('Customer messages, input and controls keep readable 16px text',Object.values(readable).every(value=>value>=16)&&clearButton.style.fontSize!=='10px',JSON.stringify(readable));
  check('Quick, clear and privacy controls have at least 44px touch targets',clearButton.getBoundingClientRect().height>=44&&privacyTrigger.getBoundingClientRect().height>=44&&[...f.shadow.querySelectorAll('.ta-quick .ta-chip')].every(button=>button.getBoundingClientRect().height>=44));
  const contrasts={bubble:contrast(initialBubble),input:contrast(inputElement),clear:contrast(clearButton),privacy:contrast(privacyTrigger)};
  check('Actual customer text colors meet a 4.5 to 1 contrast target',Object.values(contrasts).every(value=>value>=4.5),JSON.stringify(contrasts));
  const exactPrice=data.products.flatMap(p=>p.priceFacts||[]).find(f=>f.id==='catalogue-a4-16-500');
  await widget.send(exactPrice.lookupQuery);
  const exactLocal=ThanhAnFAQ.answer(exactPrice.lookupQuery,data);
  check('An exact local price bypasses automatic understanding and shows a compact total',f.posts().length===0&&compactPrice(lastBubble(),500,'cuốn',exactPrice.priceVnd*500,['A4','16 trang','C250','C150'])&&exactLocal.quote.unitPriceVnd===exactPrice.priceVnd&&exactLocal.quote.provider==='thanh-an'&&exactLocal.quote.sourceUrl===exactPrice.sourceUrl);
  await widget.send('Xem giá');
  const quoteConsult=f.shadow.querySelector('.ta-consult-cta');
  check('Xem giá offers thirteen local products and only the exact consultation button without automatically opening tables',f.posts().length===0&&f.shadow.querySelectorAll('.ta-quote-products .ta-chip').length===13&&quoteConsult?.textContent==='Tư vấn qua Zalo'&&quoteConsult.parentElement.children.length===1&&f.shadow.querySelectorAll('.ta-price-menu').length===0);
  await widget.send('Xem bảng giá');const clearedMenu=f.shadow.querySelector('.ta-price-menu');
  f.shadow.querySelector('.ta-clear').click();
  check('Clear chat removes a mounted price view and keeps privacy available without a mode selector',!!clearedMenu&&!clearedMenu.isConnected&&f.shadow.querySelectorAll('.ta-price-menu').length===0&&!f.shadow.querySelector('.ta-log').hidden&&f.shadow.querySelector('.ta-aux-view').hidden&&f.shadow.querySelector('.ta-privacy-open')===privacyTrigger&&f.shadow.querySelector('.ta-ai-consent')===null);
  await widget.send(unknown);
  const productButton=[...f.shadow.querySelectorAll('.ta-chip')].find(b=>b.textContent==='Xem lựa chọn Catalogue');
  check('An unknown question automatically receives a product confirmation after metadata and clear, without an opt-in action',f.posts().length===1&&!!productButton&&f.shadow.querySelectorAll('.ta-price-menu').length===0);
  const body=JSON.parse(f.posts()[0].body);
  check('The mock POST preserves the reviewed schema and sends only the current message without local price or history',Object.keys(body).sort().join(',')==='adult,consent,message,version'&&body.message===unknown&&body.adult===true&&body.consent==='google-free-v1'&&!f.posts()[0].body.includes('15.000')&&!f.posts()[0].body.includes(exactPrice.lookupQuery)&&!f.posts()[0].body.includes('history'));
  productButton.click();
  await until(()=>plainReply()==='Bạn cần in bao nhiêu cuốn?'&&widget.host.dataset.activity==='idle');
  check('Confirming the Gemini product asks only quantity first, without opening a table',f.posts().length===1&&plainReply()==='Bạn cần in bao nhiêu cuốn?'&&f.shadow.querySelectorAll('.ta-price-menu').length===0);
  await widget.send('500');
  check('Catalogue quantity reply asks the next single question about size',plainReply()==='Bạn cần khổ nào?'&&f.posts().length===1&&f.shadow.querySelectorAll('.ta-price-table').length===0);
  await widget.send('A4');
  check('Catalogue size reply asks the next single question about page count',plainReply()==='Catalogue của bạn có bao nhiêu trang?'&&f.posts().length===1);
  await widget.send('16 trang');
  check('Catalogue page count offers the three distinct paper choices without choosing for the customer',lastBubble().endsWith('?')&&['C250','C150','C300'].every(paper=>lastBubble().includes(paper))&&!lastBubble().includes('₫')&&f.posts().length===1);
  await widget.send('Bìa C250 ruột C150');
  const catalogueSession=ThanhAnFAQ.createSession(data);let catalogueQuote;for(const step of ['Catalogue','500','A4','16 trang','Bìa C250 ruột C150'])catalogueQuote=catalogueSession.answer(step);
  check('Confirmed catalogue specifications produce only the two-line local quote with verified payload',compactPrice(lastBubble(),500,'cuốn',exactPrice.priceVnd*500,['A4','16 trang','C250','C150'])&&catalogueQuote.quote.unitPriceVnd===exactPrice.priceVnd&&catalogueQuote.quote.sourceQuantity===500&&catalogueQuote.quote.provenance.kind==='business-owner-policy'&&catalogueQuote.quote.sourceUrl===exactPrice.sourceUrl&&f.posts().length===1&&f.shadow.querySelectorAll('.ta-price-table').length===0,lastBubble());
  const optionalDetails=f.shadow.querySelector('.ta-log').lastElementChild.querySelector('.ta-quote-details'),optionalSource=f.shadow.querySelector('.ta-log').lastElementChild.querySelector('.ta-source');
  check('Conditions and unit price basis remain optional while the small source link stays directly accessible',optionalDetails&&!optionalDetails.open&&optionalDetails.textContent.includes('15.000')&&optionalDetails.querySelector('summary').textContent==='Quy cách & lưu ý'&&optionalSource?.closest('details')===null&&optionalSource.textContent==='Xem chi tiết'&&optionalSource.href===ThanhAnFAQ.displayLink(exactPrice.sourceUrl)&&f.shadow.querySelectorAll('.ta-source-details').length===0&&!lastBubble().includes('15.000')&&!lastBubble().includes('Nguồn'));
  const quoteBubble=f.shadow.querySelector('.ta-log').lastElementChild.querySelector('.ta-message-bubble'),totalSpan=quoteBubble.querySelector('.ta-quote-total');
  check('The two-line price uses a safe text node and a readable semibold total span',quoteBubble.parentElement.classList.contains('ta-message-quote')&&quoteBubble.firstChild.nodeType===Node.TEXT_NODE&&quoteBubble.children.length===1&&!!totalSpan&&totalSpan.textContent===lastBubble().split('\n')[1]&&parseFloat(getComputedStyle(totalSpan).fontSize)>=16&&Number(getComputedStyle(totalSpan).fontWeight)>=600&&contrast(totalSpan)>=4.5);
  await widget.send('Xem bảng giá');
  check('Only explicit Xem bảng giá opens the full thirteen-category source menu outside the chat log',f.shadow.querySelectorAll('.ta-price-category').length===13&&f.posts().length===1&&f.shadow.querySelector('.ta-log').hidden&&f.shadow.querySelector('.ta-log').querySelectorAll('.ta-price-menu').length===0&&f.shadow.querySelector('.ta-aux-view').dataset.view==='prices'&&f.shadow.querySelector('.ta-aux-view').contains(f.shadow.querySelector('.ta-price-menu')));
  const categoryConsult=choiceConsult(f.shadow.querySelector('.ta-price-menu'));
  const catalogueCategory=[...f.shadow.querySelectorAll('.ta-price-category')].find(b=>b.dataset.categoryId==='catalogue');await clickPresented(catalogueCategory,f.shadow);
  check('Explicit table category selection opens specification variants',f.shadow.querySelectorAll('.ta-price-variant').length>0&&f.shadow.querySelectorAll('.ta-price-table').length===0);
  check('Category and specification choices expose all three verified Zalo advisers without requiring a table',categoryConsult&&choiceConsult(f.shadow.querySelector('.ta-price-menu'))&&f.posts().length===1);
  const variant=[...f.shadow.querySelectorAll('.ta-price-variant')].find(b=>b.dataset.variantId==='table-catalogue-a4-12-200');await clickPresented(variant,f.shadow);
  const rows=[...f.shadow.querySelectorAll('.ta-price-table tr[data-fact-id]')];
  const expected=ThanhAnPriceMenu.buildCatalog(data).categories.find(c=>c.id==='catalogue').variants.find(v=>v.id===variant.dataset.variantId).rows;
  check('The confirmed source table contains all 21 original rows',rows.length===21&&rows.map(r=>r.dataset.factId).join(',')===expected.map(r=>r.id).join(','));
  check('The table footer keeps the concise Zalo heading and three verified contact links without long notices',choiceConsult(f.shadow.querySelector('.ta-price-menu')));
  let fullMenu=f.shadow.querySelector('.ta-price-menu');fullMenu.querySelector('.ta-price-back').click();
  const ownerCatalogueId='table-catalogue-a4-cover-c250-offset-12-200';await clickPresented(fullMenu.querySelector('[data-variant-id="'+ownerCatalogueId+'"]'),f.shadow);
  const ownerCatalogue=ThanhAnPriceMenu.buildCatalog(data).categories.find(c=>c.id==='catalogue').variants.find(v=>v.id===ownerCatalogueId),ownerCatalogueRows=[...fullMenu.querySelectorAll('tr[data-fact-id]')];
  check('Owner-confirmed C300 offset catalogue keeps all 28 exact updated rows and provenance',ownerCatalogueRows.length===28&&ownerCatalogueRows.every(row=>{const fact=ownerCatalogue.rows.find(f=>f.id===row.dataset.factId);return fact&&fact.specs.material==='cover-c300'&&fact.ownerPriceRevision?.websitePublicationVerified===false&&row.querySelector('.ta-price-amount').textContent===ThanhAnFAQ.money(fact.priceVnd);})&&fullMenu.textContent.includes('C300'));
  const mappedCatalogueSources=[...fullMenu.querySelectorAll('.ta-price-source')];
  const mappedCatalogueDisplay=ThanhAnFAQ.displayLink(CATALOGUE_SOURCE)===CATALOGUE_DISPLAY_SOURCE&&mappedCatalogueSources.length===1&&mappedCatalogueSources[0].href===CATALOGUE_DISPLAY_SOURCE&&mappedCatalogueSources[0].textContent==='Xem chi tiết'&&mappedCatalogueSources[0].target==='_blank'&&mappedCatalogueSources[0].rel.includes('noopener')&&mappedCatalogueSources[0].referrerPolicy==='no-referrer'&&ownerCatalogue.sourceUrls.length===1&&ownerCatalogue.sourceUrls[0]===CATALOGUE_SOURCE&&ownerCatalogue.rows.every(fact=>fact.sourceUrl===CATALOGUE_SOURCE&&fact.provider==='vinh-phat')&&data.products.find(product=>product.id==='catalogue').priceFacts.filter(fact=>fact.specs?.material==='cover-c300').every(fact=>fact.sourceUrl===CATALOGUE_SOURCE);
  fullMenu.querySelector('.ta-price-back').click();await clickPresented(fullMenu.querySelector('[data-variant-id="estimate-catalogue-a5-all-c150-12-1000-estimate"]'),f.shadow);
  const a5DisplaySource=fullMenu.querySelector('.ta-price-source')?.href,a5RawSources=ThanhAnPriceMenu.buildCatalog(data).categories.find(category=>category.id==='catalogue').variants.find(variant=>variant.id==='estimate-catalogue-a5-all-c150-12-1000-estimate').sourceUrls;
  fullMenu.querySelector('.ta-price-back').click();fullMenu.querySelector('.ta-price-back').click();await clickPresented(fullMenu.querySelector('[data-category-id="decal"]'),f.shadow);await clickPresented(fullMenu.querySelector('[data-variant-id="table-vp-decal-9x5.5-1000"]'),f.shadow);
  const decalDisplaySource=fullMenu.querySelector('.ta-price-source')?.href,decalRawSources=ThanhAnPriceMenu.buildCatalog(data).categories.find(category=>category.id==='decal').variants.find(variant=>variant.id==='table-vp-decal-9x5.5-1000').sourceUrls,earringDisplaySources=[];
  fullMenu.querySelector('.ta-price-back').click();fullMenu.querySelector('.ta-price-back').click();await clickPresented(fullMenu.querySelector('[data-category-id="tag"]'),f.shadow);
  for(const variantId of ['table-owner-earring-tag-50x40-1000','table-owner-earring-tag-85x50-500']){
   await clickPresented(fullMenu.querySelector('[data-variant-id="'+variantId+'"]'),f.shadow);
   const ownerRows=[...fullMenu.querySelectorAll('tr[data-fact-id]')],earring=data.products.find(p=>p.id==='earring-tag-vp').priceFacts.filter(f=>f.id.includes(variantId.includes('50x40')?'50x40':'85x50'));
   const referenceLinks=[...fullMenu.querySelectorAll('.ta-price-source')];
   earringDisplaySources.push(referenceLinks[0]?.href);
   check(`${variantId} preserves owner unit amounts and the exact verified secondary reference`,ownerRows.length===3&&earring.every(fact=>ownerRows.some(row=>row.dataset.factId===fact.id&&row.querySelector('.ta-price-amount').textContent===ThanhAnFAQ.money(fact.priceVnd)))&&referenceLinks.length===1&&referenceLinks[0].href===ThanhAnFAQ.displayLink(EARRING_SOURCE)&&referenceLinks[0].target==='_blank'&&referenceLinks[0].rel.includes('noopener')&&referenceLinks[0].referrerPolicy==='no-referrer'&&fullMenu.querySelectorAll('.ta-price-zalo').length===3&&earring.every(fact=>fact.sourceUrl===null&&fact.secondarySourceUrls?.length===1&&fact.secondarySourceUrls[0]===EARRING_SOURCE&&fact.specs.material==='c300'&&fact.specs.sides===2&&fact.rawSourceFlags.ownerRecipeIncomplete&&fact.specs.finishing===undefined));
   fullMenu.querySelector('.ta-price-back').click();
  }
  check('Unmapped A5 catalogue, decal and earring displays preserve their exact original source URLs',a5DisplaySource===A5_SOURCE&&a5RawSources.length===1&&a5RawSources[0]===A5_SOURCE&&decalDisplaySource===DECAL_SOURCE&&decalRawSources.length===1&&decalRawSources[0]===DECAL_SOURCE&&earringDisplaySources.length===2&&earringDisplaySources.every(url=>url===EARRING_SOURCE)&&[A5_SOURCE,DECAL_SOURCE,EARRING_SOURCE].every(raw=>ThanhAnFAQ.displayLink(raw)===raw));
  const returnedMenu=fullMenu;f.shadow.querySelector('.ta-view-back').click();
  const directTableBack=!returnedMenu.isConnected&&f.shadow.querySelectorAll('.ta-price-menu').length===0&&!f.shadow.querySelector('.ta-log').hidden&&f.shadow.querySelector('.ta-aux-view').hidden&&f.shadow.activeElement===f.shadow.querySelector('.ta-input');
  const quickTable=f.shadow.querySelectorAll('.ta-quick .ta-chip')[1];quickTable.focus();quickTable.click();
  await until(()=>!f.shadow.querySelector('.ta-aux-view').hidden&&!!f.shadow.querySelector('.ta-price-menu'));
  const quickMenu=f.shadow.querySelector('.ta-price-menu');f.shadow.querySelector('.ta-view-back').click();
  check('Back destroys the full price menu and restores the direct-input or quick-button trigger',directTableBack&&!quickMenu.isConnected&&f.shadow.querySelectorAll('.ta-price-menu').length===0&&!f.shadow.querySelector('.ta-log').hidden&&f.shadow.querySelector('.ta-aux-view').hidden&&f.shadow.activeElement===quickTable&&quickTable.textContent.includes('Bảng giá'));
  check('Supplementary provider branding remains hidden in customer text',!f.shadow.textContent.includes('Vĩnh Phát')&&!f.shadow.textContent.includes('Vinh Phát'));
  const avatar=f.shadow.querySelector('.ta-avatar'),canvas=avatar.querySelector('canvas');await frames();
  const panelRect=f.shadow.querySelector('.ta-panel').getBoundingClientRect(),avatarRect=canvas.getBoundingClientRect(),viewport=document.documentElement.clientWidth;
  check('Open mascot keeps the 96 by 104 pixel displayed size',Math.abs(avatarRect.width-96)<0.2&&Math.abs(avatarRect.height-104)<0.2,JSON.stringify({width:avatarRect.width,height:avatarRect.height}));
  check('Panel and external mascot fit the viewport at the current width',panelRect.left>=0&&panelRect.right<=viewport+1&&avatarRect.left>=0&&avatarRect.right<=viewport+1,JSON.stringify({viewport,panelLeft:panelRect.left,panelRight:panelRect.right,avatarLeft:avatarRect.left,avatarRight:avatarRect.right}));
  f.shadow.querySelector('.ta-privacy-open').click();await frames();const optionsView=f.shadow.querySelector('.ta-aux-view'),optionsRect=optionsView.getBoundingClientRect();
  check('The auxiliary privacy view fits the dialog without horizontal or nested vertical overflow',optionsRect.left>=panelRect.left&&optionsRect.right<=panelRect.right+1&&optionsView.scrollWidth<=optionsRect.width+1&&verticalScrollOwners(f.shadow.querySelector('.ta-content')).every(element=>element===optionsView));
  optionsView.querySelector('.ta-view-back').click();
  f=await mount();const consultButton=f.shadow.querySelectorAll('.ta-quick .ta-chip')[2],nativeOpen=window.open;let automaticOpens=0;
  window.open=()=>{automaticOpens++;return null;};
  try{consultButton.focus();consultButton.click();await until(()=>f.shadow.querySelector('.ta-aux-view').dataset.view==='contacts'&&!f.shadow.querySelector('.ta-aux-view').hidden);}finally{window.open=nativeOpen;}
  const contactView=f.shadow.querySelector('.ta-aux-view'),contactBody=contactView.querySelector('.ta-aux-body'),contactRows=[...contactView.querySelectorAll('.ta-contact')],contactLinks=[...contactView.querySelectorAll('.ta-contact a')];
  const exactContactLinks=contactRows.length===3&&contactLinks.length===6&&data.contacts.every(person=>contactLinks.some(link=>link.getAttribute('href')===person.zalo&&link.target==='_blank'&&link.rel.includes('noopener')&&link.referrerPolicy==='no-referrer')&&contactLinks.some(link=>link.getAttribute('href')==='tel:'+person.phone));
  const consultOpened=consultButton.textContent==='Tư vấn qua Zalo'&&consultButton.getAttribute('aria-label')==='Tư vấn qua Zalo'&&contactView.querySelector('.ta-aux-title').textContent==='Tư vấn qua Zalo'&&contactBody.querySelector('.ta-contact-intro')===null&&contactBody.children.length===3&&f.shadow.querySelector('.ta-log').hidden&&f.shadow.querySelector('.ta-log').querySelectorAll('.ta-contact').length===0&&visibleContentViews(f.shadow.querySelector('.ta-content')).length===1&&contactView.scrollWidth<=contactView.clientWidth+1;
  contactView.querySelector('.ta-view-back').click();
  check('Consult opens the three verified advisers in one auxiliary view and returns to its trigger without opening a contact link',consultOpened&&exactContactLinks&&automaticOpens===0&&f.posts().length===0&&!f.shadow.querySelector('.ta-log').hidden&&f.shadow.querySelector('.ta-aux-view').hidden&&f.shadow.activeElement===consultButton);
  f=await mount();await widget.send('Xem giá');
  const cardChoice=[...f.shadow.querySelectorAll('.ta-quote-products .ta-chip')].find(b=>b.textContent.includes('Danh thiếp'));cardChoice.click();
  await until(()=>plainReply()==='Bạn chọn in offset hay in nhanh?'&&widget.host.dataset.activity==='idle');
  const printingButtons=[...f.shadow.querySelector('.ta-log').lastElementChild.querySelectorAll('.ta-suggestions .ta-chip')].map(button=>button.textContent),printingFirst=printingButtons.join('|')==='In offset|In nhanh'&&f.posts().length===0;
  await widget.send('In nhanh');
  check('A local card click asks the exact printing choices before the selected quick-print quantity question',printingFirst&&plainReply()==='Bạn cần in bao nhiêu hộp?'&&f.posts().length===0&&f.shadow.querySelectorAll('.ta-price-table').length===0);
  await widget.send('9');
  check('Card quantity asks the next paper specification instead of dumping source rows',lastBubble().includes('?')&&!lastBubble().includes('Tổng tham khảo')&&f.shadow.querySelectorAll('.ta-price-table').length===0&&f.posts().length===0);
  await widget.send('C300');
  const cardFacts=data.products.find(p=>p.id==='namecard-c300').priceFacts,five=cardFacts.find(f=>f.quantity===5),ten=cardFacts.find(f=>f.quantity===10);
  const cardSession=ThanhAnFAQ.createSession(data);let cardQuote;for(const step of ['Danh thiếp in nhanh','9','C300'])cardQuote=cardSession.answer(step);
  check('Nine card boxes use the five-box floor tier with only specs and total in the bubble',compactPrice(lastBubble(),9,'hộp',five.priceVnd*9,['C300'])&&cardQuote.quote.unitPriceVnd===five.priceVnd&&cardQuote.quote.sourceQuantity===5&&cardQuote.quote.provenance.kind==='business-owner-policy'&&f.posts().length===0,lastBubble());
  for(const quantity of [10,11,12,30]){
   await widget.send(String(quantity)+' hộp');
   cardQuote=cardSession.answer(String(quantity)+' hộp');
   check(`${quantity} card boxes keep the current ten-box baseline in the verified payload and compact total`,compactPrice(lastBubble(),quantity,'hộp',ten.priceVnd*quantity,['C300'])&&cardQuote.quote.unitPriceVnd===ten.priceVnd&&cardQuote.quote.sourceQuantity===10&&cardQuote.quote.provider==='thanh-an'&&cardQuote.quote.sourceUrl===ten.sourceUrl&&cardQuote.quote.provenance.kind==='business-owner-policy'&&(quantity!==30||cardQuote.quote.totalVnd===2100000)&&f.posts().length===0,lastBubble());
  }
  await widget.send('giảm giá 50%');
  check('The new owner tier does not authorize model discounts or extra commercial promises',lastBubble().includes('không tự suy ra giảm giá')&&f.posts().length===0&&f.shadow.querySelectorAll('.ta-price-table').length===0);
  const incompleteEarring=data.products.find(p=>p.id==='earring-tag-vp').priceFacts[0];await widget.send(incompleteEarring.lookupQuery);
  const incompleteResult=ThanhAnFAQ.answer(incompleteEarring.lookupQuery,data);
  check('An earring price with unresolved lamination inclusion hands off locally without a computed quote',incompleteResult.handoff===true&&!incompleteResult.quote&&incompleteEarring.rawSourceFlags.ownerRecipeIncomplete&&incompleteEarring.rawSourceFlags.missingConditions.some(value=>value.includes('cán màng'))&&!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote')&&!!f.shadow.querySelector('.ta-quick button[aria-label="Tư vấn qua Zalo"]')&&f.posts().length===0);

  f=await mount();await widget.send('Danh thiếp');await widget.send('In offset');
  check('Selecting the local offset method asks one quantity question without silently quoting',plainReply()==='Bạn cần in bao nhiêu hộp?'&&f.posts().length===0&&!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote'));
  await widget.send('12 hộp');
  const offsetSource=data.products.find(product=>product.id==='namecard-offset-ta').priceFacts;
  const offsetSession=ThanhAnFAQ.createSession(data);let offsetResult;for(const step of ['Danh thiếp','In offset','12 hộp'])offsetResult=offsetSession.answer(step);
  check('Twelve offset boxes use the approved unit-rule provenance while published package records stay intact',compactPrice(lastBubble(),12,'hộp',192000,['offset'])&&f.posts().length===0&&offsetResult.quote.unitPriceVnd===16000&&offsetResult.quote.sourceQuantity===10&&offsetResult.quote.totalKind==='computed-owner-offset'&&offsetResult.quote.provenance.kind==='business-owner-policy'&&offsetResult.quote.provenance.policyId==='owner-card-offset-unit-2026-10-13'&&offsetResult.quote.sourcePriceKind==='source_total'&&offsetResult.quote.sourcePublishedTotalVnd===160000&&offsetSource.map(fact=>[fact.quantity,fact.priceVnd,fact.priceKind]).map(row=>row.join(':')).join('|')==='2:90000:source_total|5:120000:source_total|10:160000:source_total',lastBubble());
  await widget.send('kích thước danh thiếp bao nhiêu?');
  const sizeAnswer=!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote')&&lastBubble().length>0;
  await widget.send('tổng tiền');
  check('An information question does not repeat the old quote or forget the saved offset quantity',sizeAnswer&&compactPrice(lastBubble(),12,'hộp',192000,['offset'])&&f.posts().length===0,lastBubble());
  await widget.send('7 hộp');const unsupportedOffset=!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote')&&lastBubble().includes('?')&&lastBubble().includes('hộp');
  await widget.send('15 hộp');
  check('An unsupported small offset quantity asks clarification while fifteen boxes quote directly without splitting packages',unsupportedOffset&&compactPrice(lastBubble(),15,'hộp',240000,['offset'])&&f.posts().length===0,lastBubble());
  await widget.send('12 hộp');await widget.send('In nhanh');
  const quickSwitchAsked=lastBubble().includes('C300')&&lastBubble().includes('?')&&!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote');
  await widget.send('C300');
  check('Switching offset to quick print retains twelve boxes and asks paper before quoting',quickSwitchAsked&&compactPrice(lastBubble(),12,'hộp',ten.priceVnd*12,['C300'])&&f.posts().length===0,lastBubble());
  f=await mount({reply:{...suggestion,priceVnd:1}});await widget.send(unknown);
  check('A response containing a fabricated price is discarded for local fallback',f.posts().length===1&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&f.shadow.querySelectorAll('.ta-price-table').length===0);
  f=await mount({reply:{...suggestion,categoryId:'invented'}});await widget.send(unknown);
  check('A model category absent from the local catalog is discarded',f.posts().length===1&&!f.shadow.textContent.includes('Xem lựa chọn')&&f.shadow.querySelectorAll('.ta-price-menu').length===0);
  f=await mount({status:429});await widget.send(unknown);
  check('Quota HTTP failure falls back without a retry loop',f.posts().length===1&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&widget.host.dataset.activity==='idle');
  f=await mount({offline:true});await widget.send(unknown);
  check('Network failure returns to the local unknown answer',f.posts().length===1&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&widget.host.dataset.activity==='idle');
  f=await mount({metadata:{...metadata,enabled:false}});await widget.send(unknown);
  check('A disabled deployment stays local and keeps privacy available without a mode selector',f.posts().length===0&&f.shadow.querySelector('.ta-ai-consent,.ta-ai-title,.ta-ai-helper')===null&&f.shadow.querySelector('.ta-header').contains(f.shadow.querySelector('.ta-privacy-open'))&&f.shadow.querySelector('.ta-privacy-open').getAttribute('aria-label')==='Thông tin & quyền riêng tư');
  f=await mount({pendingMetadata:true});let earlyPending=widget.send(unknown+'_before_metadata');await microtasks();const waitingForMetadata=f.posts().length===0&&pendingDots(f.shadow);f.resolveMetadata();await earlyPending;
  check('An early unknown question waits for metadata before automatically requesting a suggestion',waitingForMetadata&&f.posts().length===1&&JSON.parse(f.posts()[0].body).message===unknown+'_before_metadata'&&f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&typingAbsent(f.shadow));
  for(const action of ['clear','close']){
   f=await mount({pendingMetadata:true});let settled=false;earlyPending=widget.send(unknown+'_old_'+action).then(()=>{settled=true;});await microtasks();const awaitingMetadata=pendingDots(f.shadow)&&f.posts().length===0;
   if(action==='clear')f.shadow.querySelector('.ta-clear').click();else widget.close();
   await microtasks();const oldSettled=settled;f.resolveMetadata();await earlyPending;await microtasks();const noOldPost=f.posts().length===0&&!f.calls[0].signal.aborted;
   if(action==='close')widget.open();else await resetFinished(f.shadow);
   await widget.send(unknown+'_new_'+action);
   check('Before metadata '+action+' settles the old question and preserves readiness for only the new question',awaitingMetadata&&oldSettled&&noOldPost&&f.posts().length===1&&JSON.parse(f.posts()[0].body).message===unknown+'_new_'+action&&f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&typingAbsent(f.shadow));
  }
  f=await mount({pendingMetadata:true});let earlyDestroyedSettled=false;earlyPending=widget.send(unknown+'_destroy_metadata').then(()=>{earlyDestroyedSettled=true;});await microtasks();const metadataHost=widget.host;widget.destroy();widget=null;await microtasks();f.resolveMetadata();await earlyPending;await microtasks();
  check('Destroy settles an early question and aborts metadata without a late POST or connected host',earlyDestroyedSettled&&f.calls[0].signal.aborted&&f.posts().length===0&&!metadataHost.isConnected&&typingAbsent(f.shadow));
  f=await mount();
  for(const privateInput of ['fictional@example.invalid','Số điện thoại thử nghiệm 0901234567','mật khẩu thử nghiệm chỉ dùng trong test'])await widget.send(privateInput);
  check('Automatic understanding never POSTs the tested synthetic email, phone or secret-marker questions',f.posts().length===0);
  window.__geminiHarnessXss=0;await widget.send('<img src=x onerror="window.__geminiHarnessXss=1">');
  check('Visitor XSS is literal text, never HTML or a provider call',window.__geminiHarnessXss===0&&f.posts().length===0&&f.shadow.querySelectorAll('img').length===0&&f.shadow.querySelector('.ta-log').textContent.includes('<img'));
  f=await mount({pending:true});let pending=widget.send(unknown);await until(()=>f.posts().length===1);
  check('Pending automatic understanding shows only three small gray dots with a static customer status',pendingDots(f.shadow)&&widget.host.dataset.activity==='working');
  f.shadow.querySelector('.ta-clear').click();await pending;await resetFinished(f.shadow);const cleared=f.shadow.querySelector('.ta-log').textContent;f.resolve();await frames();
  check('Clear cancels automatic in-flight work and a late reply cannot repopulate the new chat',f.posts()[0].signal.aborted&&f.shadow.querySelector('.ta-log').textContent===cleared&&f.shadow.querySelectorAll('.ta-message').length===1&&typingAbsent(f.shadow)&&f.shadow.querySelector('.ta-ai-consent')===null);
  f=await mount({pending:true});pending=widget.send(unknown);await until(()=>f.posts().length===1);const oldHost=widget.host;widget.destroy();widget=null;f.resolve();await pending;
  check('Destroy aborts pending work and leaves no orphan host',f.posts()[0].signal.aborted&&!oldHost.isConnected&&!document.getElementById('ta-mam-chat-host')&&typingAbsent(f.shadow));
  f=await mount({pending:true});pending=widget.send(unknown);await until(()=>f.posts().length===1);const successDots=pendingDots(f.shadow);f.resolve();await pending;
  check('Successful automatic understanding removes the waiting dots before showing its confirmation',successDots&&typingAbsent(f.shadow)&&f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&widget.host.dataset.activity==='idle');
  f=await mount({pending:true,status:429});pending=widget.send(unknown);await until(()=>f.posts().length===1);const failureDots=pendingDots(f.shadow);f.resolve();await pending;
  check('An asynchronous quota error removes waiting dots and returns to the local fallback without retrying',failureDots&&typingAbsent(f.shadow)&&f.posts().length===1&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&widget.host.dataset.activity==='idle');
  f=await mount({pending:true});pending=widget.send(unknown);await until(()=>f.posts().length===1);widget.close();const closedLog=f.shadow.querySelector('.ta-log').textContent,closedDots=typingAbsent(f.shadow);f.resolve();await pending;
  check('Closing cancels automatic understanding immediately and suppresses the late response on reopening',closedDots&&f.posts()[0].signal.aborted&&f.shadow.querySelector('.ta-panel').hidden&&f.shadow.querySelector('.ta-log').textContent===closedLog&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&typingAbsent(f.shadow));
  widget.open();
  f=await mount({pending:true});const aiTimeoutStart=performance.now();pending=widget.send(unknown);await until(()=>f.posts().length===1);const timeoutDots=pendingDots(f.shadow);await pending;f.resolve();await frames();
  check('A stalled automatic understanding request times out, removes its dots and rejects an ignored-abort late reply',timeoutDots&&f.posts()[0].signal.aborted&&typingAbsent(f.shadow)&&f.posts().length===1&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&widget.host.dataset.activity==='idle'&&performance.now()-aiTimeoutStart<9000);

  // Basic references must answer locally before optional source or provider
  // lookups, including when a different product has an active price recipe.
  f=await mount({sourceInfo:true});const basicFaqSession=ThanhAnFAQ.createSession(data);
  for(const step of ['catalogue A4 500 cuốn','16 trang','Bìa C250 ruột C150']){await widget.send(step);basicFaqSession.answer(step);}
  for(const [query,terms,source] of [
   ['kt a4 là bao nhiêu',['A4','21 × 29,7 cm'],null],
   ['kích thước của tờ rơi a4',['A4','21 × 29,7 cm'],null],
   ['A5 kích thước',['A5','14,8 × 21 cm'],null],
   ['giấyC300làgì',['C300','Couche','300 g/m²'],data.cardPrintingInformation.digital.sourceUrl]
  ]){
   await widget.send(query);const localBasic=basicFaqSession.answer(query),basicBlock=f.shadow.querySelector('.ta-log').lastElementChild,basicLink=basicBlock.querySelector('.ta-source');
   check('Basic FAQ '+query+' answers locally without fetching or changing the active catalogue recipe',terms.every(term=>lastBubble().includes(term))&&/^Dạ[,\s]/u.test(lastBubble())&&localBasic.kind==='faq'&&localBasic.basicInformation===true&&localBasic.informationScope==='common-reference-not-price-condition'&&!localBasic.informationQuery&&!localBasic.quote&&!basicBlock.classList.contains('ta-message-quote')&&typingAbsent(f.shadow)&&f.posts().length===0&&f.infoCalls.length===0&&(!source||(localBasic.sources?.[0].url===source&&basicLink?.href===ThanhAnFAQ.displayLink(source)&&!!data.cardPrintingInformation.digital.verifiedAtUtc)),lastBubble());
  }
  await widget.send('tổng tiền');const retainedBasicQuote=basicFaqSession.answer('tổng tiền').quote;
  check('After A4, flyer, A5 and C300 explanations the saved catalogue remains A4 C250 sixteen pages and five hundred copies',compactPrice(lastBubble(),500,'cuốn',exactPrice.priceVnd*500,['A4','C250','C150','16 trang'])&&retainedBasicQuote.quantity===500&&retainedBasicQuote.totalVnd===exactPrice.priceVnd*500&&retainedBasicQuote.sourceUrl===exactPrice.sourceUrl&&f.posts().length===0&&f.infoCalls.length===0&&typingAbsent(f.shadow),lastBubble());

  // Source information is mocked independently. No raw visitor text is sent to
  // this read-only endpoint, and its responses never become price conditions.
  f=await mount();for(const step of ['Danh thiếp','In offset','12 hộp',INFO_QUERY])await widget.send(step);
  check('Without an optional source endpoint a recognized information question remains local with no provider call or dots',f.infoCalls.length===0&&f.posts().length===0&&typingAbsent(f.shadow)&&!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote'));
  f=await mount({sourceInfo:true,infoPending:true});for(const step of ['Danh thiếp','In offset','12 hộp'])await widget.send(step);
  const localQuoteHadNoDots=typingAbsent(f.shadow)&&f.infoCalls.length===0&&f.posts().length===0;pending=widget.send(INFO_QUERY);await until(()=>f.infoCalls.length===1);
  check('Information lookup keeps the three dots visible while completed local prices bypass both endpoints',localQuoteHadNoDots&&pendingDots(f.shadow)&&f.posts().length===0);
  const infoRequest=f.infoCalls[0],infoUrl=new URL(infoRequest.url);
  check('The source-information mock receives only the known product and field in a same-origin read-only GET',infoUrl.origin===location.origin&&infoUrl.pathname==='/api/mam-info'&&[...infoUrl.searchParams.keys()].sort().join(',')==='field,productId,version'&&infoUrl.searchParams.get('version')==='1'&&infoUrl.searchParams.get('productId')==='namecard-offset-ta'&&infoUrl.searchParams.get('field')==='lamination'&&infoRequest.method==='GET'&&infoRequest.body===undefined&&infoRequest.credentials==='omit'&&infoRequest.cache==='no-store'&&infoRequest.referrerPolicy==='no-referrer'&&infoRequest.redirect==='error'&&![...infoUrl.searchParams.values()].includes('12')&&f.posts().length===0);
  f.resolveInfo();await pending;const infoBlock=f.shadow.querySelector('.ta-log').lastElementChild,infoLink=infoBlock.querySelector('.ta-source');
  const successfulInfo=hasMockInfo()&&/^Dạ[,\s]/u.test(lastBubble())&&!infoBlock.classList.contains('ta-message-quote')&&infoLink?.href===ThanhAnFAQ.displayLink(INFO_SOURCE)&&infoLink.textContent==='Xem chi tiết'&&infoLink.closest('details')===null&&infoBlock.querySelectorAll('.ta-source-details').length===0&&infoLink.target==='_blank'&&infoLink.rel.includes('noopener')&&infoLink.referrerPolicy==='no-referrer'&&typingAbsent(f.shadow)&&f.posts().length===0;
  await widget.send('tổng tiền');
  check('Validated source information removes dots, keeps its safe reference separate from prices and preserves the offset quote context',successfulInfo&&compactPrice(lastBubble(),12,'hộp',192000,['offset'])&&f.infoCalls.length===1&&f.posts().length===0,lastBubble());
  const invalidInfo={version:1,kind:'information',productId:'namecard-offset-ta',field:'lamination',text:INFO_TEXT,sources:[{provider:'thanh-an',url:INFO_SOURCE}],reference:false,checkedAtUtc:'2026-10-13T07:00:00.000Z'};
  for(const [name,reply] of [
   ['a price-bearing response',{...invalidInfo,priceVnd:1}],
   ['HTML and an untrusted reference',{...invalidInfo,text:'<img src=x onerror="window.__geminiHarnessXss=1">',sources:[{provider:'thanh-an',url:'https://example.invalid/fake-source'}]}],
   ['an unavailable source field',{version:1,kind:'fallback',productId:'namecard-offset-ta',field:'lamination'}]
  ]){
   f=await mount({sourceInfo:true,infoPending:true,infoReply:reply});for(const step of ['Danh thiếp','In offset','12 hộp'])await widget.send(step);
   pending=widget.send(INFO_QUERY);await until(()=>f.infoCalls.length===1);const beforeFallback=pendingDots(f.shadow);f.resolveInfo();await pending;
   check('Source information rejects '+name+' without replacing the local fallback or quoting',beforeFallback&&f.posts().length===0&&f.infoCalls.length===1&&typingAbsent(f.shadow)&&!hasMockInfo()&&!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote')&&f.shadow.querySelectorAll('img').length===0&&window.__geminiHarnessXss===0&&![...f.shadow.querySelectorAll('.ta-source')].some(link=>link.href.startsWith('https://example.invalid/')));
  }
  f=await mount({sourceInfo:true,infoOffline:true});for(const step of ['Danh thiếp','In offset','12 hộp',INFO_QUERY])await widget.send(step);
  check('A source-information network error removes dots and uses local information without falling through to Gemini',f.infoCalls.length===1&&f.posts().length===0&&typingAbsent(f.shadow)&&lastBubble().length>0&&!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote')&&widget.host.dataset.activity==='idle');
  f=await mount({sourceInfo:true,infoPending:true});for(const step of ['Danh thiếp','In offset','12 hộp'])await widget.send(step);
  const infoTimeoutStart=performance.now();pending=widget.send(INFO_QUERY);await until(()=>f.infoCalls.length===1);const infoTimeoutDots=pendingDots(f.shadow);await pending;const timeoutFallback=f.shadow.querySelector('.ta-log').textContent;f.resolveInfo();await frames();
  check('A stalled source lookup bypasses classification, removes dots and suppresses a late source reply',infoTimeoutDots&&f.infoCalls[0].signal.aborted&&f.infoCalls.length===1&&f.posts().length===0&&typingAbsent(f.shadow)&&f.shadow.querySelector('.ta-log').textContent===timeoutFallback&&!hasMockInfo()&&widget.host.dataset.activity==='idle'&&performance.now()-infoTimeoutStart<7000);
  f=await mount({sourceInfo:true,infoPending:true});for(const step of ['Danh thiếp','In offset','12 hộp'])await widget.send(step);
  pending=widget.send(INFO_QUERY);await until(()=>f.infoCalls.length===1);f.shadow.querySelector('.ta-clear').click();await pending;await resetFinished(f.shadow);const infoClearedLog=f.shadow.querySelector('.ta-log').textContent,infoClearedDots=typingAbsent(f.shadow);f.resolveInfo();await frames();
  check('Clear aborts source information immediately and an ignored-abort response cannot restore its dots or content',infoClearedDots&&f.infoCalls[0].signal.aborted&&typingAbsent(f.shadow)&&f.shadow.querySelector('.ta-log').textContent===infoClearedLog&&f.shadow.querySelectorAll('.ta-message').length===1&&f.posts().length===0);
  f=await mount({sourceInfo:true,infoPending:true});for(const step of ['Danh thiếp','In offset','12 hộp'])await widget.send(step);
  pending=widget.send(INFO_QUERY);await until(()=>f.infoCalls.length===1);widget.close();const infoClosedLog=f.shadow.querySelector('.ta-log').textContent,infoClosedDots=typingAbsent(f.shadow);f.resolveInfo();await pending;widget.open();
  check('Close aborts source information and reopening never reveals an ignored-abort late reply',infoClosedDots&&f.infoCalls[0].signal.aborted&&typingAbsent(f.shadow)&&!f.shadow.querySelector('.ta-panel').hidden&&f.shadow.querySelector('.ta-log').textContent===infoClosedLog&&!hasMockInfo()&&f.posts().length===0);
  f=await mount({sourceInfo:true,infoPending:true});for(const step of ['Danh thiếp','In offset','12 hộp'])await widget.send(step);
  pending=widget.send(INFO_QUERY);await until(()=>f.infoCalls.length===1);const infoDestroyedHost=widget.host;widget.destroy();widget=null;const destroyedInfoDots=typingAbsent(f.shadow);f.resolveInfo();await pending;
  check('Destroy aborts source information and removes waiting dots even when the fake fetch ignores abort',destroyedInfoDots&&f.infoCalls[0].signal.aborted&&typingAbsent(f.shadow)&&!infoDestroyedHost.isConnected&&!document.getElementById('ta-mam-chat-host')&&f.posts().length===0);

  // Regressions for the real local quote session; provider responses remain fake.
  const owner300=allFacts.find(fact=>fact.id==='catalogue-a4-cover-c300-offset-16-300'),owner500=allFacts.find(fact=>fact.id==='catalogue-a4-cover-c250-offset-16-500');
  f=await mount();await widget.send('catalogue A4 300 cuốn');
  check('A local catalogue A4 300 request keeps quantity and size and asks only pages',plainReply()==='Catalogue của bạn có bao nhiêu trang?'&&f.posts().length===0&&!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote'));
  await widget.send('16 trang');
  check('A sixteen-page reply continues the existing catalogue and asks only paper',lastBubble().endsWith('?')&&['C250','C150','C300'].every(paper=>lastBubble().includes(paper))&&f.posts().length===0&&!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote'));
  await widget.send('Bìa C300 ruột C150');
  check('Choosing C300 quotes the saved A4 300 sixteen-page request without a provider call',compactPrice(lastBubble(),300,'cuốn',owner300.priceVnd*300,['A4','C300','C150','16 trang'])&&f.posts().length===0,lastBubble());
  const c300SourceLink=f.shadow.querySelector('.ta-log').lastElementChild.querySelector('.ta-source'),c300RawQuote=ThanhAnFAQ.answer(owner300.lookupQuery,data).quote;
  check('Catalogue table and quote source displays point to the exact Thanh An page while original price provenance stays intact',mappedCatalogueDisplay&&c300SourceLink?.href===CATALOGUE_DISPLAY_SOURCE&&c300SourceLink.textContent==='Xem chi tiết'&&c300SourceLink.target==='_blank'&&c300SourceLink.rel.includes('noopener')&&c300SourceLink.referrerPolicy==='no-referrer'&&c300SourceLink.closest('details')===null&&f.shadow.querySelector('.ta-log').lastElementChild.querySelector('.ta-quote-details')&&!f.shadow.querySelector('.ta-log').lastElementChild.querySelector('.ta-quote-details').open&&owner300.sourceUrl===CATALOGUE_SOURCE&&c300RawQuote.sourceUrl===CATALOGUE_SOURCE&&c300RawQuote.provider==='vinh-phat');
  await widget.send('350 cuốn');
  check('Changing quantity to 350 preserves all catalogue specifications and uses the 300 floor tier',compactPrice(lastBubble(),350,'cuốn',owner300.priceVnd*350,['A4','C300','C150','16 trang'])&&f.posts().length===0,lastBubble());
  await widget.send('500 cuốn');
  check('Changing quantity to 500 selects its published owner tier without forgetting the catalogue',compactPrice(lastBubble(),500,'cuốn',owner500.priceVnd*500,['A4','C300','C150','16 trang'])&&f.posts().length===0,lastBubble());
  await widget.send('300 cuốn hoặc 500 cuốn');
  check('Conflicting quantities ask confirmation without silently choosing a price or calling the provider',!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote')&&lastBubble().includes('?')&&f.posts().length===0,lastBubble());
  await widget.send('400 cuốn');
  check('Resolving the quantity conflict keeps the other catalogue specifications',compactPrice(lastBubble(),400,'cuốn',owner300.priceVnd*400,['A4','C300','C150','16 trang'])&&f.posts().length===0,lastBubble());
  await widget.send('400 cuốn hay 500 tờ');
  const mixedUnitAsked=!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote')&&lastBubble().includes('?')&&lastBubble().includes('cuốn')&&f.posts().length===0;
  await widget.send('400 cuốn');
  check('Mixed quantity units require confirmation and resolving them keeps the catalogue recipe',mixedUnitAsked&&compactPrice(lastBubble(),400,'cuốn',owner300.priceVnd*400,['A4','C300','C150','16 trang'])&&f.posts().length===0,lastBubble());
  await widget.send('A4 hay A5');
  check('Conflicting sizes ask one size question and never substitute another sheet size',!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote')&&lastBubble().includes('một khổ')&&f.posts().length===0,lastBubble());
  await widget.send('A4');
  check('Resolving the size conflict restores the quote without losing quantity, paper or pages',compactPrice(lastBubble(),400,'cuốn',owner300.priceVnd*400,['A4','C300','C150','16 trang'])&&f.posts().length===0,lastBubble());
  f=await mount({status:429});await widget.send(unknown);
  for(const step of ['catalogue A4 300 cuốn','16 trang','Bìa C300 ruột C150'])await widget.send(step);
  check('After quota fallback a recognized catalogue conversation remains local and retains context',f.posts().length===1&&compactPrice(lastBubble(),300,'cuốn',owner300.priceVnd*300,['A4','C300','C150','16 trang']),lastBubble());

  // Explicit synthetic approvals exist only inside this mock test run. The actual
  // downloaded JSON is never changed or saved, and has no owner-approved seeds.
  const seed=languageData.entries.find(entry=>entry.intent==='product'&&entry.categoryId==='catalogue');
  check('The actual approved-language JSON keeps assistant examples pending rather than claiming owner approval',languageData.schemaVersion===1&&!!seed&&seed.status==='pending'&&languageData.entries.every(entry=>entry.status!=='approved')&&ThanhAnApprovedLanguage.create(languageData).lookup(seed.phrase)===null);
  function syntheticFixture(entry){const synthetic=JSON.parse(JSON.stringify(entry));synthetic.status='approved';synthetic.review={decision:'approved',byRole:'owner',at:'2026-10-13T00:00:00.000Z',mappingKey:ThanhAnApprovedLanguage.mappingKey(synthetic)};return {schemaVersion:1,entries:[synthetic]};}
  const approvedFixture=syntheticFixture(seed),approvedMemory=ThanhAnApprovedLanguage.create(approvedFixture);
  const approvedHint=approvedMemory.lookup(seed.phrase);
  check('The isolated synthetic approved fixture returns only a category hint without changing the actual pending data',ThanhAnFAQ.answer(seed.phrase,data).kind==='unknown'&&approvedHint?.intent==='product'&&approvedHint.categoryId==='catalogue'&&Object.keys(approvedHint).sort().join(',')==='categoryId,intent'&&JSON.stringify(languageData)===languageSnapshot);
  f=await mount({approvedLanguageData:approvedFixture});await widget.send(seed.phrase);
  check('An exact synthetically approved catalogue phrase skips the provider and starts local quantity-first lookup',plainReply()==='Bạn cần in bao nhiêu cuốn?'&&f.posts().length===0);
  await widget.send('A4 300 cuốn');
  check('The approved category route keeps a combined quantity and size reply for the next question',plainReply()==='Catalogue của bạn có bao nhiêu trang?'&&f.posts().length===0);
  await widget.send('16 trang');await widget.send('Bìa C300 ruột C150');
  check('The approved phrase route preserves the original message context through the final source-based quote',compactPrice(lastBubble(),300,'cuốn',owner300.priceVnd*300,['A4','C300','C150','16 trang'])&&f.posts().length===0,lastBubble());
  const hoursFixture=syntheticFixture({id:'synthetic-hours',phrase:'lịch tiếp khách ở tiệm',intent:'hours',categoryId:null,status:'pending',author:'assistant',review:null});
  f=await mount({approvedLanguageData:hoursFixture});await widget.send(hoursFixture.entries[0].phrase);
  check('A synthetic approved non-product phrase routes to the actual local FAQ without a provider call',plainReply().includes(data.faq.hours)&&f.posts().length===0&&!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote'));
  const outOfScopeFixture=syntheticFixture({id:'synthetic-out-of-scope',phrase:'kể chuyện về bầu trời',intent:'out_of_scope',categoryId:null,status:'pending',author:'assistant',review:null});
  f=await mount({approvedLanguageData:outOfScopeFixture});await widget.send(outOfScopeFixture.entries[0].phrase);
  check('A synthetic approved out-of-scope phrase stays on a bounded local answer instead of spending provider quota',f.posts().length===0&&lastBubble().length>0&&lastBubble().length<=500&&!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote')&&f.shadow.querySelectorAll('.ta-price-table').length===0);
  const invalidFixture=JSON.parse(JSON.stringify(approvedFixture));invalidFixture.entries[0].priceVnd=1;
  f=await mount({approvedLanguageData:invalidFixture,status:429});await widget.send(seed.phrase);
  check('An invalid language fixture cannot inject a price or activate an unreviewed local product route',f.posts().length===1&&!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote')&&!plainReply().includes('Bạn cần in bao nhiêu cuốn?')&&f.shadow.querySelectorAll('.ta-price-table').length===0);
  let stalledSignal=null,stalledCalls=0;const stallStarted=performance.now();
  f=await mount({approvedLanguageUrl:'/widget/approved-language.json',approvedLanguageFetch:(_url,init)=>{stalledCalls++;stalledSignal=init.signal;return new Promise(()=>{});}});
  const stallMountMs=performance.now()-stallStarted;
  for(const step of ['catalogue A4 300 cuốn','16 trang','Bìa C300 ruột C150'])await widget.send(step);
  check('A stalled optional rules fetch cannot block mount or the local catalogue even when it ignores abort',stalledCalls===1&&stalledSignal?.aborted===true&&stallMountMs<3000&&f.posts().length===0&&compactPrice(lastBubble(),300,'cuốn',owner300.priceVnd*300,['A4','C300','C150','16 trang']),JSON.stringify({mountMs:stallMountMs,fetchCalls:stalledCalls,aborted:stalledSignal?.aborted}));

  // Leave the actual widget open for visual review; this is still a mock provider.
  f=await mount();f.shadow.querySelector('.ta-privacy-open').click();
  check('Final review uses the original native mascot assets',widget.avatarMascot.getFrame().assetUrl.includes('seedy-spritesheet-v10.webp')&&widget.avatarMascot.element.width===192&&widget.avatarMascot.element.height===208);
 }catch(error){check('Harness completed without an uncaught error',false,error.message);}
 const pass=results.filter(r=>r.pass).length,report={kind:'Gemini MOCK browser integration; no real provider call',began,ended:new Date().toISOString(),viewport:{width:innerWidth,height:innerHeight},pass,fail:results.length-pass,total:results.length,results};
 byId('results-json').textContent=JSON.stringify(report,null,2);window.__geminiBrowserReport=report;summary.textContent=`${pass}/${results.length} PASS · ${report.fail} FAIL · MOCK ONLY`;run.disabled=false;
}
run.addEventListener('click',tests);
})();
