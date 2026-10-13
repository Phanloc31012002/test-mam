(function(){'use strict';
const byId=id=>document.getElementById(id),run=byId('run'),summary=byId('summary'),list=byId('results');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const frames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
const metadata={version:1,enabled:true,privacyVersion:'google-free-v1'};
const suggestion={version:1,kind:'suggestion',intent:'product',categoryId:'catalogue'};
const unknown='zz_mock_gemini_unknown';
const fakeResponse=(value,status=200)=>({ok:status>=200&&status<300,text:async()=>JSON.stringify(value)});
let widget=null;
async function until(predicate,ms=2000){const start=performance.now();while(!predicate()){if(performance.now()-start>ms)throw new Error('Mock harness condition timed out');await sleep(10);}}
async function tests(){
 run.disabled=true;list.replaceChildren();summary.textContent='Đang chạy mock.';
 if(widget){widget.destroy();widget=null;}
 const began=new Date().toISOString(),results=[];
 const check=(name,pass,detail='')=>{const record={name,pass:!!pass,detail};results.push(record);const row=document.createElement('li');row.className=pass?'pass':'fail';row.textContent=(pass?'PASS · ':'FAIL · ')+name+(detail?' — '+detail:'');list.appendChild(row);};
 const lastBubble=()=>widget.shadow.querySelector('.ta-log').lastElementChild?.querySelector('.ta-message-bubble')?.textContent||'';
 try{
  const [data,styles]=await Promise.all([fetch('../widget/data.json',{credentials:'omit'}).then(r=>r.json()),fetch('../widget/widget.css',{credentials:'omit'}).then(r=>r.text())]);
  check('Mock classification input reaches only the local unknown branch',ThanhAnFAQ.answer(unknown,data).kind==='unknown');
  check('The existing data still contains all 177 published facts',data.products.reduce((n,p)=>n+(p.priceFacts||[]).length,0)===177);
  async function mount(options={}){
   if(widget)widget.destroy();const calls=[];let resolvePost=null;
   const aiFetch=async(url,init)=>{
    if(new URL(url,location.href).origin!==location.origin||new URL(url,location.href).pathname!=='/api/mam-assist')throw new Error('Unexpected mock endpoint');
    calls.push({method:init.method,body:init.body,signal:init.signal});
    if(init.method==='GET')return fakeResponse(options.metadata||metadata);
    if(options.pending)return new Promise(resolve=>{resolvePost=()=>resolve(fakeResponse(options.reply||suggestion));});
    if(options.offline)throw new Error('Mock offline');
    return fakeResponse(options.reply||suggestion,options.status||200);
   };
   widget=await ThanhAnChat.mount({data,styles,reducedMotion:true,aiEndpoint:'/api/mam-assist',aiFetch});widget.open();
   const shadow=widget.shadow,consent=shadow.querySelector('.ta-ai-consent');
   await until(()=>!consent.disabled||shadow.querySelector('.ta-ai-options summary').textContent.includes('chưa kết nối'));
   const optIn=()=>{consent.checked=true;consent.dispatchEvent(new Event('change',{bubbles:true}));};
   const revoke=()=>{consent.checked=false;consent.dispatchEvent(new Event('change',{bubbles:true}));};
   const posts=()=>calls.filter(c=>c.method==='POST');
   return {shadow,consent,optIn,revoke,posts,calls,resolve:()=>resolvePost?.()};
  }
  let f=await mount();
  check('Optional AI starts unchecked and checks metadata once',!f.consent.checked&&f.calls.length===1&&f.calls[0].method==='GET');
  const notice=f.shadow.querySelector('.ta-ai-notice').textContent,label=f.consent.parentElement.textContent;
  check('Google processing and free-tier product improvement are disclosed',notice.includes('Google')&&notice.includes('miễn phí')&&notice.includes('cải thiện')&&notice.includes('thông tin cá nhân'));
  check('Opt-in explicitly covers adults and Vietnam',label.includes('18 tuổi')&&label.includes('Việt Nam'));
  await widget.send(unknown);check('Unknown text remains local before opt-in',f.posts().length===0);
  f.optIn();check('An explicit checkbox action enables consent',f.consent.checked);
  const exactPrice=data.products.flatMap(p=>p.priceFacts||[]).find(f=>f.id==='catalogue-a4-16-500');
  await widget.send(exactPrice.lookupQuery);
  check('An exact local price bypasses Gemini even after opt-in',f.posts().length===0&&f.shadow.querySelector('.ta-log').textContent.includes('15.000'));
  await widget.send('Xem giá');
  check('Xem giá offers thirteen local products without automatically opening tables',f.posts().length===0&&f.shadow.querySelectorAll('.ta-quote-products .ta-chip').length===13&&f.shadow.querySelectorAll('.ta-price-menu').length===0);
  f.shadow.querySelector('.ta-footnote button').click();
  check('Clear chat revokes consent and removes prior price menus',!f.consent.checked&&f.shadow.querySelectorAll('.ta-price-menu').length===0);
  f.optIn();await widget.send(unknown);
  const productButton=[...f.shadow.querySelectorAll('.ta-chip')].find(b=>b.textContent==='Xem lựa chọn Catalogue');
  check('A model product suggestion requires a user confirmation button',f.posts().length===1&&!!productButton&&f.shadow.querySelectorAll('.ta-price-menu').length===0);
  const body=JSON.parse(f.posts()[0].body);
  check('The mock POST sends only the current message, version and explicit consent',Object.keys(body).sort().join(',')==='adult,consent,message,version'&&body.message===unknown&&body.adult===true&&body.consent==='google-free-v1'&&!f.posts()[0].body.includes('15.000'));
  productButton.click();
  await until(()=>lastBubble().includes('Bạn cần in bao nhiêu cuốn?')&&widget.host.dataset.activity==='idle');
  check('Confirming the Gemini product asks only quantity first, without opening a table',f.posts().length===1&&lastBubble()==='Bạn cần in bao nhiêu cuốn?'&&f.shadow.querySelectorAll('.ta-price-menu').length===0);
  await widget.send('500');
  check('Catalogue quantity reply asks the next single question about size',lastBubble().startsWith('Bạn cần khổ nào?')&&f.posts().length===1&&f.shadow.querySelectorAll('.ta-price-table').length===0);
  await widget.send('A4');
  check('Catalogue size reply asks the next single question about page count',lastBubble()==='Catalogue của bạn có bao nhiêu trang?'&&f.posts().length===1);
  await widget.send('16 trang');
  check('Catalogue page count asks the paper choice without choosing for the customer',lastBubble().startsWith('Bạn chọn toàn bộ C150 hay bìa C250')&&f.posts().length===1);
  await widget.send('Bìa C250 ruột C150');
  check('Confirmed catalogue specifications produce only the local source-based quote',lastBubble().includes('7.500.000')&&lastBubble().includes('15.000')&&!!f.shadow.querySelector('.ta-log').lastElementChild.querySelector('.ta-quote-details')&&f.posts().length===1&&f.shadow.querySelectorAll('.ta-price-table').length===0,lastBubble());
  await widget.send('Xem bảng giá');
  check('Only explicit Xem bảng giá opens the full thirteen-category source menu',f.shadow.querySelectorAll('.ta-price-category').length===13&&f.posts().length===1);
  const catalogueCategory=[...f.shadow.querySelectorAll('.ta-price-category')].find(b=>b.dataset.categoryId==='catalogue');catalogueCategory.click();
  check('Explicit table category selection opens specification variants',f.shadow.querySelectorAll('.ta-price-variant').length>0&&f.shadow.querySelectorAll('.ta-price-table').length===0);
  const variant=[...f.shadow.querySelectorAll('.ta-price-variant')].find(b=>b.dataset.variantId==='table-catalogue-a4-12-200');variant.click();
  const rows=[...f.shadow.querySelectorAll('.ta-price-table tr[data-fact-id]')];
  const expected=ThanhAnPriceMenu.buildCatalog(data).categories.find(c=>c.id==='catalogue').variants.find(v=>v.id===variant.dataset.variantId).rows;
  check('The confirmed source table contains all 21 original rows',rows.length===21&&rows.map(r=>r.dataset.factId).join(',')===expected.map(r=>r.id).join(','));
  check('The original bold Zalo footer remains below the table',f.shadow.querySelector('.ta-price-footer strong')?.textContent.includes('hãy nhắn Zalo'));
  check('Supplementary provider branding remains hidden in customer text',!f.shadow.textContent.includes('Vĩnh Phát')&&!f.shadow.textContent.includes('Vinh Phát'));
  const avatar=f.shadow.querySelector('.ta-avatar'),canvas=avatar.querySelector('canvas');await frames();
  const panelRect=f.shadow.querySelector('.ta-panel').getBoundingClientRect(),avatarRect=canvas.getBoundingClientRect(),viewport=document.documentElement.clientWidth;
  check('Open mascot keeps the 96 by 104 pixel displayed size',Math.abs(avatarRect.width-96)<0.2&&Math.abs(avatarRect.height-104)<0.2,JSON.stringify({width:avatarRect.width,height:avatarRect.height}));
  check('Panel and external mascot fit the viewport at the current width',panelRect.left>=0&&panelRect.right<=viewport+1&&avatarRect.left>=0&&avatarRect.right<=viewport+1,JSON.stringify({viewport,panelLeft:panelRect.left,panelRight:panelRect.right,avatarLeft:avatarRect.left,avatarRight:avatarRect.right}));
  f.shadow.querySelector('.ta-ai-options').open=true;await frames();const optionsRect=f.shadow.querySelector('.ta-ai-options').getBoundingClientRect();
  check('Expanded consent options fit the dialog without horizontal overflow',optionsRect.left>=panelRect.left&&optionsRect.right<=panelRect.right+1&&f.shadow.querySelector('.ta-ai-options').scrollWidth<=optionsRect.width+1);
  f=await mount();f.optIn();await widget.send('Xem giá');
  const cardChoice=[...f.shadow.querySelectorAll('.ta-quote-products .ta-chip')].find(b=>b.textContent.includes('Danh thiếp'));cardChoice.click();
  await until(()=>lastBubble()==='Bạn cần in bao nhiêu hộp?'&&widget.host.dataset.activity==='idle');
  check('A local product click starts the one-question card conversation without Gemini',lastBubble()==='Bạn cần in bao nhiêu hộp?'&&f.posts().length===0&&f.shadow.querySelectorAll('.ta-price-table').length===0);
  await widget.send('9');
  check('Card quantity asks the next paper specification instead of dumping source rows',lastBubble().includes('?')&&!lastBubble().includes('Tổng tham khảo')&&f.shadow.querySelectorAll('.ta-price-table').length===0&&f.posts().length===0);
  await widget.send('C300');
  const cardFacts=data.products.find(p=>p.id==='namecard-c300').priceFacts,five=cardFacts.find(f=>f.quantity===5),ten=cardFacts.find(f=>f.quantity===10);
  const money=value=>value.toLocaleString('vi-VN');
  check('Nine card boxes use the owner-approved five-box floor tier and local computed total',lastBubble().includes(money(five.priceVnd*9))&&lastBubble().includes(money(five.priceVnd))&&lastBubble().includes('mức nguồn 5 hộp')&&f.posts().length===0,lastBubble());
  for(const quantity of [10,11,12]){
   await widget.send(String(quantity)+' hộp');
   check(`${quantity} card boxes keep the owner-approved ten-box unit price`,lastBubble().includes(money(ten.priceVnd*quantity))&&lastBubble().includes('70.000')&&lastBubble().includes('mức nguồn 10 hộp')&&f.posts().length===0,lastBubble());
  }
  await widget.send('giảm giá 50%');
  check('The new owner tier does not authorize model discounts or extra commercial promises',lastBubble().includes('không tự suy ra giảm giá')&&f.posts().length===0&&f.shadow.querySelectorAll('.ta-price-table').length===0);
  f=await mount({reply:{...suggestion,priceVnd:1}});f.optIn();await widget.send(unknown);
  check('A response containing a fabricated price is discarded for local fallback',f.posts().length===1&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&f.shadow.querySelectorAll('.ta-price-table').length===0);
  f=await mount({reply:{...suggestion,categoryId:'invented'}});f.optIn();await widget.send(unknown);
  check('A model category absent from the local catalog is discarded',f.posts().length===1&&!f.shadow.textContent.includes('Xem lựa chọn')&&f.shadow.querySelectorAll('.ta-price-menu').length===0);
  f=await mount({status:429});f.optIn();await widget.send(unknown);
  check('Quota HTTP failure falls back without a retry loop',f.posts().length===1&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&widget.host.dataset.activity==='idle');
  f=await mount({offline:true});f.optIn();await widget.send(unknown);
  check('Network failure returns to the local unknown answer',f.posts().length===1&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&widget.host.dataset.activity==='idle');
  f=await mount({metadata:{...metadata,enabled:false}});await widget.send(unknown);
  check('A deployment without a key stays on FAQ and disables opt-in',f.consent.disabled&&!f.consent.checked&&f.posts().length===0&&f.shadow.querySelector('.ta-ai-options summary').textContent.includes('chưa kết nối'));
  f=await mount();f.optIn();const privateInput='fictional@example.invalid';await widget.send(privateInput);
  check('An email-containing unknown question is never sent to the provider',f.posts().length===0);
  window.__geminiHarnessXss=0;await widget.send('<img src=x onerror="window.__geminiHarnessXss=1">');
  check('Visitor XSS is literal text, never HTML or a provider call',window.__geminiHarnessXss===0&&f.posts().length===0&&f.shadow.querySelectorAll('img').length===0&&f.shadow.querySelector('.ta-log').textContent.includes('<img'));
  f=await mount({pending:true});f.optIn();let pending=widget.send(unknown);await until(()=>f.posts().length===1);f.revoke();f.resolve();await pending;
  check('Revoking consent aborts the pending request and suppresses its late suggestion',f.posts()[0].signal.aborted&&!f.consent.checked&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue'));
  f=await mount({pending:true});f.optIn();pending=widget.send(unknown);await until(()=>f.posts().length===1);f.shadow.querySelector('.ta-footnote button').click();const cleared=f.shadow.querySelector('.ta-log').textContent;f.resolve();await pending;
  check('Clear cancels in-flight work and a late reply cannot repopulate the chat',f.posts()[0].signal.aborted&&!f.consent.checked&&f.shadow.querySelector('.ta-log').textContent===cleared&&f.shadow.querySelectorAll('.ta-message').length===1);
  f=await mount({pending:true});f.optIn();pending=widget.send(unknown);await until(()=>f.posts().length===1);const oldHost=widget.host;widget.destroy();widget=null;f.resolve();await pending;
  check('Destroy aborts pending work and leaves no orphan host',f.posts()[0].signal.aborted&&!oldHost.isConnected&&!document.getElementById('ta-mam-chat-host'));
  // Leave the actual widget open for visual review; this is still a mock provider.
  f=await mount();f.shadow.querySelector('.ta-ai-options').open=true;
  check('Final review uses the original native mascot assets',widget.avatarMascot.getFrame().assetUrl.includes('seedy-spritesheet-v10.webp')&&widget.avatarMascot.element.width===192&&widget.avatarMascot.element.height===208);
 }catch(error){check('Harness completed without an uncaught error',false,error.message);}
 const pass=results.filter(r=>r.pass).length,report={kind:'Gemini MOCK browser integration; no real provider call',began,ended:new Date().toISOString(),viewport:{width:innerWidth,height:innerHeight},pass,fail:results.length-pass,total:results.length,results};
 byId('results-json').textContent=JSON.stringify(report,null,2);window.__geminiBrowserReport=report;summary.textContent=`${pass}/${results.length} PASS · ${report.fail} FAIL · MOCK ONLY`;run.disabled=false;
}
run.addEventListener('click',tests);
})();
