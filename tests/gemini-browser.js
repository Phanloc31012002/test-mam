(function(){'use strict';
const byId=id=>document.getElementById(id),run=byId('run'),summary=byId('summary'),list=byId('results');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const frames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
const metadata={version:1,enabled:true,privacyVersion:'google-free-v1'};
const suggestion={version:1,kind:'suggestion',intent:'product',categoryId:'catalogue'};
const unknown='zz_mock_gemini_unknown';
const EARRING_SOURCE='https://invinhphat.com/san-pham/in-tag-treo-khuyen-tai/';
const fakeResponse=(value,status=200)=>({ok:status>=200&&status<300,text:async()=>JSON.stringify(value)});
function rgb(value){const match=value.match(/^rgba?\(([^)]+)\)$/);if(!match)return null;const values=match[1].split(/[\s,\/]+/).filter(Boolean).map(Number);return {r:values[0]/255,g:values[1]/255,b:values[2]/255,a:values[3]??1};}
function composite(top,bottom){const a=top.a+bottom.a*(1-top.a);return {r:(top.r*top.a+bottom.r*bottom.a*(1-top.a))/a,g:(top.g*top.a+bottom.g*bottom.a*(1-top.a))/a,b:(top.b*top.a+bottom.b*bottom.a*(1-top.a))/a,a};}
function contrast(element){const chain=[];for(let node=element;node;node=node.parentElement)chain.push(node);let background={r:1,g:1,b:1,a:1};for(const node of chain.reverse()){const color=rgb(getComputedStyle(node).backgroundColor);if(color)background=composite(color,background);}const foreground=rgb(getComputedStyle(element).color);if(!foreground)return 0;const luminance=color=>[color.r,color.g,color.b].map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);const a=luminance(composite(foreground,background)),b=luminance(background);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);}
let widget=null;
async function until(predicate,ms=2000){const start=performance.now();while(!predicate()){if(performance.now()-start>ms)throw new Error('Mock harness condition timed out');await sleep(10);}}
async function tests(){
 run.disabled=true;list.replaceChildren();summary.textContent='Đang chạy mock.';
 if(widget){widget.destroy();widget=null;}
 const began=new Date().toISOString(),results=[];
 const check=(name,pass,detail='')=>{const record={name,pass:!!pass,detail};results.push(record);const row=document.createElement('li');row.className=pass?'pass':'fail';row.textContent=(pass?'PASS · ':'FAIL · ')+name+(detail?' — '+detail:'');list.appendChild(row);};
 const lastBubble=()=>widget.shadow.querySelector('.ta-log').lastElementChild?.querySelector('.ta-message-bubble')?.textContent||'';
 const compactPrice=(text,quantity,unit,total,specs=[])=>{const lines=text.split('\n'),amount=quantity.toLocaleString('vi-VN')+' '+unit+': '+total.toLocaleString('vi-VN')+' ₫';return lines.length===2&&specs.every(spec=>lines[0].includes(spec))&&(lines[1]===amount||lines[1]===amount+' (chưa VAT)')&&!/Tổng tham khảo|Nguồn giá|mức nguồn|quy tắc chủ|đơn thực tế|cần tư vấn viên/i.test(text);};
 try{
  const [data,styles]=await Promise.all([fetch('../widget/data.json',{credentials:'omit'}).then(r=>r.json()),fetch('../widget/widget.css',{credentials:'omit'}).then(r=>r.text())]);
  check('Mock classification input reaches only the local unknown branch',ThanhAnFAQ.answer(unknown,data).kind==='unknown');
  const allFacts=data.products.flatMap(p=>p.priceFacts||[]);
  check('The reviewed dataset contains 193 facts and 62 distinct owner-confirmed records',allFacts.length===193&&data.products.length===22&&allFacts.filter(f=>f.ownerPriceRevision?.kind==='business-owner-price-update').length===62&&allFacts.filter(f=>f.originalSourceRecord).length===46);
  async function mount(options={}){
   if(widget)widget.destroy();const calls=[];let resolvePost=null,metadataRead=false;
   const aiFetch=async(url,init)=>{
    if(new URL(url,location.href).origin!==location.origin||new URL(url,location.href).pathname!=='/api/mam-assist')throw new Error('Unexpected mock endpoint');
    calls.push({method:init.method,body:init.body,signal:init.signal});
    if(init.method==='GET')return {ok:true,text:async()=>{metadataRead=true;return JSON.stringify(options.metadata||metadata);}};
    if(options.pending)return new Promise(resolve=>{resolvePost=()=>resolve(fakeResponse(options.reply||suggestion));});
    if(options.offline)throw new Error('Mock offline');
    return fakeResponse(options.reply||suggestion,options.status||200);
   };
   widget=await ThanhAnChat.mount({data,styles,reducedMotion:true,aiEndpoint:'/api/mam-assist',aiFetch});widget.open();
   const shadow=widget.shadow,consent=shadow.querySelector('.ta-ai-consent');
   await until(()=>metadataRead);for(let n=0;n<8;n++)await Promise.resolve();
   const optIn=()=>{consent.checked=true;consent.dispatchEvent(new Event('change',{bubbles:true}));};
   const revoke=()=>{consent.checked=false;consent.dispatchEvent(new Event('change',{bubbles:true}));};
   const posts=()=>calls.filter(c=>c.method==='POST');
   return {shadow,consent,optIn,revoke,posts,calls,resolve:()=>resolvePost?.()};
  }
  let f=await mount();
  check('Optional AI starts unchecked and checks metadata once',!f.consent.checked&&f.calls.length===1&&f.calls[0].method==='GET');
  const notice=[...f.shadow.querySelectorAll('.ta-ai-notice')].map(p=>p.textContent).join(' '),label=f.consent.parentElement.textContent;
  check('Google processing, human review and free-tier product improvement are disclosed',notice.includes('Google')&&notice.includes('miễn phí')&&notice.includes('cải thiện')&&notice.includes('người xét duyệt')&&notice.includes('thông tin cá nhân'));
  check('Opt-in explicitly covers adults and Vietnam',label.includes('18 tuổi')&&label.includes('Việt Nam'));
  check('Customer privacy controls use a generic label without model or backend names',f.shadow.querySelector('.ta-ai-options summary').textContent==='Thông tin & quyền riêng tư'&&!/Gemini|Flash|API\s*key|backend|provider|generativelanguage/i.test(f.shadow.textContent));
  const initialBubble=f.shadow.querySelector('.ta-message-bubble'),inputElement=f.shadow.querySelector('.ta-input'),clearButton=f.shadow.querySelector('.ta-clear'),privacySummary=f.shadow.querySelector('.ta-ai-options summary');
  const readable={bubble:parseFloat(getComputedStyle(initialBubble).fontSize),input:parseFloat(getComputedStyle(inputElement).fontSize),clear:parseFloat(getComputedStyle(clearButton).fontSize),privacy:parseFloat(getComputedStyle(privacySummary).fontSize)};
  check('Customer messages and input are 16px with readable secondary controls',readable.bubble>=16&&readable.input>=16&&readable.clear>=14&&readable.privacy>=13&&clearButton.style.fontSize!=='10px',JSON.stringify(readable));
  check('Quick, clear and privacy controls have at least 44px touch targets',clearButton.getBoundingClientRect().height>=44&&privacySummary.getBoundingClientRect().height>=44&&[...f.shadow.querySelectorAll('.ta-quick .ta-chip')].every(button=>button.getBoundingClientRect().height>=44));
  const contrasts={bubble:contrast(initialBubble),input:contrast(inputElement),clear:contrast(clearButton),privacy:contrast(privacySummary)};
  check('Actual customer text colors meet a 4.5 to 1 contrast target',Object.values(contrasts).every(value=>value>=4.5),JSON.stringify(contrasts));
  await widget.send(unknown);check('Unknown text remains local before opt-in',f.posts().length===0);
  f.optIn();check('An explicit checkbox action enables consent',f.consent.checked);
  const exactPrice=data.products.flatMap(p=>p.priceFacts||[]).find(f=>f.id==='catalogue-a4-16-500');
  await widget.send(exactPrice.lookupQuery);
  const exactLocal=ThanhAnFAQ.answer(exactPrice.lookupQuery,data);
  check('An exact local price bypasses Gemini and shows a compact total after opt-in',f.posts().length===0&&compactPrice(lastBubble(),500,'cuốn',exactPrice.priceVnd*500,['A4','16 trang','C250','C150'])&&exactLocal.quote.unitPriceVnd===exactPrice.priceVnd&&exactLocal.quote.provider==='thanh-an'&&exactLocal.quote.sourceUrl===exactPrice.sourceUrl);
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
  check('Catalogue page count offers the three distinct paper choices without choosing for the customer',lastBubble().endsWith('?')&&['C250','C150','C300'].every(paper=>lastBubble().includes(paper))&&!lastBubble().includes('₫')&&f.posts().length===1);
  await widget.send('Bìa C250 ruột C150');
  const catalogueSession=ThanhAnFAQ.createSession(data);let catalogueQuote;for(const step of ['Catalogue','500','A4','16 trang','Bìa C250 ruột C150'])catalogueQuote=catalogueSession.answer(step);
  check('Confirmed catalogue specifications produce only the two-line local quote with verified payload',compactPrice(lastBubble(),500,'cuốn',exactPrice.priceVnd*500,['A4','16 trang','C250','C150'])&&catalogueQuote.quote.unitPriceVnd===exactPrice.priceVnd&&catalogueQuote.quote.sourceQuantity===500&&catalogueQuote.quote.provenance.kind==='business-owner-policy'&&catalogueQuote.quote.sourceUrl===exactPrice.sourceUrl&&f.posts().length===1&&f.shadow.querySelectorAll('.ta-price-table').length===0,lastBubble());
  const optionalDetails=f.shadow.querySelector('.ta-log').lastElementChild.querySelector('.ta-quote-details'),optionalSource=f.shadow.querySelector('.ta-log').lastElementChild.querySelector('.ta-source');
  check('Full conditions, source and unit price basis remain in closed optional details',optionalDetails&&!optionalDetails.open&&optionalDetails.textContent.includes('15.000')&&optionalSource?.closest('details')===optionalDetails&&optionalSource.href===exactPrice.sourceUrl&&!lastBubble().includes('15.000')&&!lastBubble().includes('Nguồn'));
  const quoteBubble=f.shadow.querySelector('.ta-log').lastElementChild.querySelector('.ta-message-bubble'),totalSpan=quoteBubble.querySelector('.ta-quote-total');
  check('The two-line price uses a safe text node and a readable semibold total span',quoteBubble.parentElement.classList.contains('ta-message-quote')&&quoteBubble.firstChild.nodeType===Node.TEXT_NODE&&quoteBubble.children.length===1&&!!totalSpan&&totalSpan.textContent===lastBubble().split('\n')[1]&&parseFloat(getComputedStyle(totalSpan).fontSize)>=16&&Number(getComputedStyle(totalSpan).fontWeight)>=600&&contrast(totalSpan)>=4.5);
  await widget.send('Xem bảng giá');
  check('Only explicit Xem bảng giá opens the full thirteen-category source menu',f.shadow.querySelectorAll('.ta-price-category').length===13&&f.posts().length===1);
  const catalogueCategory=[...f.shadow.querySelectorAll('.ta-price-category')].find(b=>b.dataset.categoryId==='catalogue');catalogueCategory.click();
  check('Explicit table category selection opens specification variants',f.shadow.querySelectorAll('.ta-price-variant').length>0&&f.shadow.querySelectorAll('.ta-price-table').length===0);
  const variant=[...f.shadow.querySelectorAll('.ta-price-variant')].find(b=>b.dataset.variantId==='table-catalogue-a4-12-200');variant.click();
  const rows=[...f.shadow.querySelectorAll('.ta-price-table tr[data-fact-id]')];
  const expected=ThanhAnPriceMenu.buildCatalog(data).categories.find(c=>c.id==='catalogue').variants.find(v=>v.id===variant.dataset.variantId).rows;
  check('The confirmed source table contains all 21 original rows',rows.length===21&&rows.map(r=>r.dataset.factId).join(',')===expected.map(r=>r.id).join(','));
  check('The original bold Zalo footer remains below the table',f.shadow.querySelector('.ta-price-footer strong')?.textContent.includes('hãy nhắn Zalo'));
  let fullMenu=f.shadow.querySelector('.ta-price-menu');fullMenu.querySelector('.ta-price-back').click();
  const ownerCatalogueId='table-catalogue-a4-cover-c250-offset-12-200';fullMenu.querySelector('[data-variant-id="'+ownerCatalogueId+'"]').click();
  const ownerCatalogue=ThanhAnPriceMenu.buildCatalog(data).categories.find(c=>c.id==='catalogue').variants.find(v=>v.id===ownerCatalogueId),ownerCatalogueRows=[...fullMenu.querySelectorAll('tr[data-fact-id]')];
  check('Owner-confirmed C300 offset catalogue keeps all 28 exact updated rows and provenance',ownerCatalogueRows.length===28&&ownerCatalogueRows.every(row=>{const fact=ownerCatalogue.rows.find(f=>f.id===row.dataset.factId);return fact&&fact.specs.material==='cover-c300'&&fact.ownerPriceRevision?.websitePublicationVerified===false&&row.querySelector('.ta-price-amount').textContent===ThanhAnFAQ.money(fact.priceVnd);})&&fullMenu.textContent.includes('C300'));
  fullMenu.querySelector('.ta-price-back').click();fullMenu.querySelector('.ta-price-back').click();fullMenu.querySelector('[data-category-id="tag"]').click();
  for(const variantId of ['table-owner-earring-tag-50x40-1000','table-owner-earring-tag-85x50-500']){
   fullMenu.querySelector('[data-variant-id="'+variantId+'"]').click();
   const ownerRows=[...fullMenu.querySelectorAll('tr[data-fact-id]')],earring=data.products.find(p=>p.id==='earring-tag-vp').priceFacts.filter(f=>f.id.includes(variantId.includes('50x40')?'50x40':'85x50'));
   const referenceLinks=[...fullMenu.querySelectorAll('.ta-price-source')];
   check(`${variantId} preserves owner unit amounts and the exact verified secondary reference`,ownerRows.length===3&&earring.every(fact=>ownerRows.some(row=>row.dataset.factId===fact.id&&row.querySelector('.ta-price-amount').textContent===ThanhAnFAQ.money(fact.priceVnd)))&&referenceLinks.length===1&&referenceLinks[0].href===EARRING_SOURCE&&referenceLinks[0].target==='_blank'&&referenceLinks[0].rel.includes('noopener')&&referenceLinks[0].referrerPolicy==='no-referrer'&&fullMenu.querySelectorAll('.ta-price-zalo').length===3&&earring.every(fact=>fact.sourceUrl===null&&fact.secondarySourceUrls?.length===1&&fact.secondarySourceUrls[0]===EARRING_SOURCE&&fact.specs.material==='c300'&&fact.specs.sides===2&&fact.rawSourceFlags.ownerRecipeIncomplete&&fact.specs.finishing===undefined));
   fullMenu.querySelector('.ta-price-back').click();
  }
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
  const cardSession=ThanhAnFAQ.createSession(data);let cardQuote;for(const step of ['Danh thiếp','9','C300'])cardQuote=cardSession.answer(step);
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
  check('An earring price with unresolved lamination inclusion hands off locally without a computed quote',incompleteResult.handoff===true&&!incompleteResult.quote&&incompleteEarring.rawSourceFlags.ownerRecipeIncomplete&&incompleteEarring.rawSourceFlags.missingConditions.some(value=>value.includes('cán màng'))&&!f.shadow.querySelector('.ta-log').lastElementChild.classList.contains('ta-message-quote')&&!!f.shadow.querySelector('.ta-log').lastElementChild.querySelector('.ta-handoff')&&f.posts().length===0);
  f=await mount({reply:{...suggestion,priceVnd:1}});f.optIn();await widget.send(unknown);
  check('A response containing a fabricated price is discarded for local fallback',f.posts().length===1&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&f.shadow.querySelectorAll('.ta-price-table').length===0);
  f=await mount({reply:{...suggestion,categoryId:'invented'}});f.optIn();await widget.send(unknown);
  check('A model category absent from the local catalog is discarded',f.posts().length===1&&!f.shadow.textContent.includes('Xem lựa chọn')&&f.shadow.querySelectorAll('.ta-price-menu').length===0);
  f=await mount({status:429});f.optIn();await widget.send(unknown);
  check('Quota HTTP failure falls back without a retry loop',f.posts().length===1&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&widget.host.dataset.activity==='idle');
  f=await mount({offline:true});f.optIn();await widget.send(unknown);
  check('Network failure returns to the local unknown answer',f.posts().length===1&&!f.shadow.textContent.includes('Xem lựa chọn Catalogue')&&widget.host.dataset.activity==='idle');
  f=await mount({metadata:{...metadata,enabled:false}});await widget.send(unknown);
  check('A deployment without a key stays local and disables opt-in behind the generic privacy label',f.consent.disabled&&!f.consent.checked&&f.posts().length===0&&f.shadow.querySelector('.ta-ai-options summary').textContent==='Thông tin & quyền riêng tư');
  f=await mount();f.optIn();const privateInput='fictional@example.invalid';await widget.send(privateInput);
  check('An email-containing unknown question is never sent to the provider',f.posts().length===0);
  window.__geminiHarnessXss=0;await widget.send('<img src=x onerror="window.__geminiHarnessXss=1">');
  check('Visitor XSS is literal text, never HTML or a provider call',window.__geminiHarnessXss===0&&f.posts().length===0&&f.shadow.querySelectorAll('img').length===0&&f.shadow.querySelector('.ta-log').textContent.includes('<img'));
  f=await mount({pending:true});f.optIn();let pending=widget.send(unknown);await until(()=>f.posts().length===1);
  check('Pending optional understanding uses a generic customer status',!(/Gemini|Flash|backend|provider|API/i.test(f.shadow.querySelector('.ta-subtitle').textContent))&&widget.host.dataset.activity==='working');
  f.revoke();f.resolve();await pending;
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
