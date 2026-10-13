(function (root) {
  'use strict';
  let mounted = null;
  let mounting = null;
  const el=(tag,className,text,parent)=>{const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=root.ThanhAnFAQ?.displayText?root.ThanhAnFAQ.displayText(text):text;if(parent)parent.appendChild(e);return e;};
  function icon(parent) {
    const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
    const path=document.createElementNS(ns,'path');path.setAttribute('d','M5 12h14M13 6l6 6-6 6');path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','1.8');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');svg.appendChild(path);parent.appendChild(svg);
  }
  function assetUrl(value) { const u=new URL(value,document.baseURI);if(u.origin!==location.origin||!['http:','https:'].includes(u.protocol))throw new Error('Tài nguyên cần cùng nguồn với trang');return u.href; }
  async function createWidget(config={}) {
    if(!root.ThanhAnFAQ||!root.ThanhAnMascot||!root.ThanhAnPriceMenu||!root.ThanhAnPresentation)throw new Error('Thiếu thành phần widget');
    let data=config.data;
    if(!data){const r=await fetch(assetUrl(config.dataUrl),{credentials:'omit',cache:'no-cache',referrerPolicy:'no-referrer'});if(!r.ok)throw new Error('Không tải được dữ liệu FAQ');data=await r.json();}
    root.ThanhAnFAQ.validateData(data);
    if(!config.informationData&&config.informationDataUrl){
      const controller=new AbortController();let timer;
      try{
        const load=fetch(assetUrl(config.informationDataUrl),{credentials:'omit',cache:'no-cache',referrerPolicy:'no-referrer',signal:controller.signal}).then(response=>response.ok?response.json():null).catch(()=>null);
        const deadline=new Promise(resolve=>{timer=setTimeout(()=>{controller.abort();resolve(null);},1500);});
        config={...config,informationData:await Promise.race([load,deadline])};
      }finally{clearTimeout(timer);controller.abort();}
    }
    // Optional, versioned owner-reviewed language rules. A bad or missing rule
    // file never weakens the local price policy or blocks the existing widget.
    let languageMemory=null;
    if(root.ThanhAnApprovedLanguage){
      try{
        let rules=config.approvedLanguageData;
        if(!rules&&config.approvedLanguageUrl){
          const url=assetUrl(config.approvedLanguageUrl),controller=new AbortController();let timer;
          try{
            const load=Promise.resolve().then(()=>(config.approvedLanguageFetch||fetch)(url,{credentials:'omit',cache:'no-cache',referrerPolicy:'no-referrer',signal:controller.signal})).then(r=>r.ok?r.json():null).catch(()=>null);
            const deadline=new Promise(resolve=>{timer=setTimeout(()=>{controller.abort();resolve(null);},1500);});
            rules=await Promise.race([load,deadline]);
          }finally{clearTimeout(timer);controller.abort();}
        }
        if(rules)languageMemory=root.ThanhAnApprovedLanguage.create(rules);
      }catch(_){languageMemory=null;}
    }
    // Preserve source truth against changes from visitor messages.
    data=JSON.parse(JSON.stringify(data));
    function freeze(value){Object.freeze(value);Object.values(value).forEach(v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v))freeze(v);});}freeze(data);
    const conversation=root.ThanhAnFAQ.createSession?root.ThanhAnFAQ.createSession(data):{answer:text=>root.ThanhAnFAQ.answer(text,data),reset(){}};
    const presentation=root.ThanhAnPresentation.create({delayMs:320});
    function snapshotInformation(query){
      const corpus=config.informationData;
      if(!query||corpus?.schemaVersion!==1||!Array.isArray(corpus.products)||!corpus.fieldNames?.includes(query.field))return null;
      const entry=corpus.products.find(product=>product.productId===query.productId)?.fields?.[query.field];
      if(!entry||!['verified','conditional'].includes(entry.status)||!Array.isArray(entry.facts)||!entry.facts.length)return null;
      const provider=entry.facts.some(fact=>fact.provider==='thanh-an')?'thanh-an':'vinh-phat';
      const facts=entry.facts.filter(fact=>fact.provider===provider);
      if(facts.some(fact=>typeof fact.text!=='string'||!root.ThanhAnFAQ.safeLink(fact.sourceUrl)))return null;
      return{kind:'information',text:facts.map(fact=>fact.text+(fact.conditions?.length?'\n'+fact.conditions.map(condition=>'• '+condition).join('\n'):'')).join('\n'),sources:[...new Set(facts.map(fact=>fact.sourceUrl))].map(url=>({url,label:provider==='thanh-an'?'Quy cách trên website Thanh Ấn':'Thông tin tham khảo bổ sung'}))};
    }
    const host=el('div');host.id='ta-mam-chat-host';host.style.visibility='hidden';host.setAttribute('lang','vi');
    host.style.position='fixed';
    host.dataset.reducedMotion=String(config.reducedMotion===true);
    const shadow=host.attachShadow({mode:'open'});
    let cssReady;
    if(config.styles){el('style','',config.styles,shadow);cssReady=Promise.resolve();}
    else{const link=el('link');link.rel='stylesheet';link.href=assetUrl(config.stylesheetUrl);cssReady=new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(new Error('Không tải được giao diện')),6000);link.onload=()=>{clearTimeout(t);resolve();};link.onerror=()=>{clearTimeout(t);reject(new Error('Không tải được giao diện'));};});shadow.appendChild(link);}
    const shell=el('div','ta-widget',undefined,shadow);
    const panelWrap=el('div','ta-panel-wrap',undefined,shell);panelWrap.hidden=true;
    const avatar=el('div','ta-avatar',undefined,panelWrap);const avatarMascot=root.ThanhAnMascot.create({reducedMotion:config.reducedMotion,attentionDurationMs:config.attentionDurationMs});avatarMascot.setPaused(true);avatar.appendChild(avatarMascot.element);avatar.setAttribute('aria-hidden','true');
    const panel=el('section','ta-panel',undefined,panelWrap);panel.id='ta-mam-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','false');panel.setAttribute('aria-labelledby','ta-mam-title');
    const header=el('div','ta-header',undefined,panel);
    const titles=el('div','',undefined,header);const title=el('h2','ta-title','Mầm của Thanh Ấn',titles);title.id='ta-mam-title';
    const subtitle=el('p','ta-subtitle',undefined,titles);el('span','ta-status-dot','',subtitle);const statusLabel=el('span','','Trợ lý thông tin in ấn',subtitle);
    const headerActions=el('div','ta-header-actions ta-footnote',undefined,header);
    const close=el('button','ta-close','×',headerActions);close.type='button';close.setAttribute('aria-label','Đóng trò chuyện');
    let dragController=null;
    const dragButton=root.ThanhAnDrag?el('button','ta-window-drag ta-drag-handle','↔',headerActions):null;
    if(dragButton){dragButton.type='button';dragButton.setAttribute('aria-label','Di chuyển hoặc đặt lại vị trí');dragButton.setAttribute('title','Kéo để di chuyển; bấm để về vị trí ban đầu');headerActions.insertBefore(dragButton,close);dragButton.addEventListener('click',()=>{dragController?.reset();dragController?.reclamp();});}
    const aiClient=config.aiEndpoint&&root.ThanhAnGemini?root.ThanhAnGemini.create({endpoint:assetUrl(config.aiEndpoint),fetchImpl:config.aiFetch}):null;
    const infoClient=config.infoEndpoint&&root.ThanhAnSourceInfo?root.ThanhAnSourceInfo.create({endpoint:assetUrl(config.infoEndpoint),productIds:data.products.map(product=>product.id),fetchImpl:config.infoFetch}):null;
    let aiConsent=null,privacyButton=null,privacyDocument=null;
    if(aiClient){
      const tools=el('div','ta-ai-options',undefined,panel);
      const consentLabel=el('label','ta-ai-label',undefined,tools);
      aiConsent=el('input','ta-ai-consent',undefined,consentLabel);aiConsent.type='checkbox';aiConsent.disabled=true;
      const copy=el('span','ta-ai-copy',undefined,consentLabel);
      const toggleTitle=el('span','ta-ai-title','Bật hiểu sâu',copy);toggleTitle.id='ta-ai-toggle-title';
      const helper=el('span','ta-ai-helper','Giúp Mầm hiểu câu hỏi rõ hơn',copy);helper.id='ta-ai-helper';
      aiConsent.setAttribute('aria-labelledby',toggleTitle.id);aiConsent.setAttribute('aria-describedby','ta-ai-helper ta-ai-consent-terms');
      privacyButton=el('button','ta-privacy-open','i',tools);privacyButton.type='button';privacyButton.setAttribute('aria-label','Thông tin & quyền riêng tư');privacyButton.setAttribute('title','Thông tin & quyền riêng tư');privacyButton.setAttribute('aria-expanded','false');privacyButton.setAttribute('aria-controls','ta-mam-aux-view');
      privacyDocument=el('section','ta-privacy-document',undefined,panel);privacyDocument.hidden=true;
      el('p','ta-ai-notice','Mầm hỗ trợ thông tin in ấn và giá trong bảng. Lịch sử do Mầm giữ chỉ nằm trong phiên mở trang và không được lưu lâu dài.',privacyDocument);
      const terms=el('p','ta-ai-notice','Khi bật hiểu sâu, tôi xác nhận từ 18 tuổi, đang tại Việt Nam và đồng ý gửi câu chưa hiểu cho Google để hỗ trợ nhận diện câu hỏi.',privacyDocument);terms.id='ta-ai-consent-terms';
      el('p','ta-ai-notice','Dịch vụ miễn phí có thể dùng nội dung để cải thiện sản phẩm và có người xét duyệt. Đừng nhập thông tin cá nhân hoặc bí mật. Chỉ câu hiện tại chưa hiểu được gửi; Mầm không gửi toàn bộ lịch sử.',privacyDocument);
      privacyButton.addEventListener('click',showPrivacy);
      aiConsent.addEventListener('change',()=>{aiConsent.checked=aiClient.setConsent(aiConsent.checked);});
      aiClient.check().then(enabled=>{if(destroyed)return;aiConsent.disabled=!enabled;});
    }
    const content=el('div','ta-content',undefined,panel);
    const log=el('div','ta-log',undefined,content);log.setAttribute('role','log');log.setAttribute('aria-live','polite');log.setAttribute('aria-relevant','additions');log.setAttribute('aria-label','Cuộc trò chuyện với Mầm');
    const auxiliary=el('section','ta-aux-view',undefined,content);auxiliary.id='ta-mam-aux-view';auxiliary.hidden=true;auxiliary.setAttribute('aria-labelledby','ta-aux-title');
    const auxHead=el('div','ta-aux-head',undefined,auxiliary);
    const auxBack=el('button','ta-view-back','← Trò chuyện',auxHead);auxBack.type='button';
    const auxTitle=el('h3','ta-aux-title','',auxHead);auxTitle.id='ta-aux-title';
    const auxBody=el('div','ta-aux-body',undefined,auxiliary);
    let auxReturnFocus=null;
    auxBack.addEventListener('click',()=>showChat());
    const quick=el('div','ta-quick',undefined,panel);
    [['Báo giá','Xem giá'],['Bảng giá','Xem bảng giá'],['Tư vấn','Liên hệ Zalo']].forEach(([label,query])=>{const b=el('button','ta-chip',label,quick);b.type='button';if(query==='Liên hệ Zalo'){b.setAttribute('aria-label','Tư vấn qua Zalo');b.setAttribute('title','Chọn tư vấn viên qua Zalo');}b.addEventListener('click',()=>send(query));});
    const form=el('form','ta-form',undefined,panel);
    const label=el('label','ta-sr-only','Câu hỏi cho Mầm',form);label.htmlFor='ta-mam-input';
    const input=el('input','ta-input',undefined,form);input.id='ta-mam-input';input.type='text';input.placeholder='Bạn đang cần in gì?';input.maxLength=1000;input.autocomplete='off';input.setAttribute('enterkeyhint','send');
    const submit=el('button','ta-send',undefined,form);submit.type='submit';submit.setAttribute('aria-label','Gửi câu hỏi');icon(submit);
    const alert=el('p','ta-alert','',panel);alert.setAttribute('role','status');alert.hidden=true;
    const clear=el('button','ta-clear','↻',headerActions);clear.type='button';clear.setAttribute('aria-label','Làm mới');clear.setAttribute('title','Làm mới trò chuyện');headerActions.insertBefore(clear,close);clear.addEventListener('click',()=>{if(destroyed)return;generation++;pendingText=null;presentation.cancel();cancelPaint();infoClient?.abort();removeTyping();aiClient?.setConsent(false);if(aiConsent)aiConsent.checked=false;showChat(false);destroyMenus();setActivity('greeting');conversation.reset();log.replaceChildren();greetingShown=false;if(!panel.hidden)welcome();input.value='';input.focus();});
    const launcher=el('button','ta-launcher',undefined,shell);launcher.type='button';launcher.setAttribute('aria-expanded','false');launcher.setAttribute('aria-controls',panel.id);launcher.setAttribute('aria-label','Mở trò chuyện với Mầm');
    const launcherLabel=el('span','ta-launcher-label','Mầm giúp bạn nhé?',launcher);el('small','','Tìm giá & thông tin in ấn',launcherLabel);
    const launcherPlant=el('span','ta-launcher-plant',undefined,launcher);const launcherMascot=root.ThanhAnMascot.create({reducedMotion:config.reducedMotion,attentionDurationMs:config.attentionDurationMs});launcherPlant.appendChild(launcherMascot.element);el('span','ta-collapse-icon','⌄',launcherPlant);
    let destroyed=false,activityTimer=null,deskTimer=null,generation=0,queue=Promise.resolve(),pendingText=null,greetingShown=false;
    const activityIdleMs=Number.isFinite(config.activityIdleMs)?Math.max(100,Math.min(60000,config.activityIdleMs)):10000;
    const paintWaits=new Set();
    const priceMenus=new Map();
    const typingBubbles=new Set();
    function removeTyping(){for(const bubble of typingBubbles)bubble.remove();typingBubbles.clear();}
    function showTyping(parent=log){
      const block=el('div','ta-message ta-message-typing',undefined,parent);
      const bubble=el('div','ta-typing-bubble',undefined,block);
      const dots=el('span','ta-typing-dots',undefined,bubble);dots.setAttribute('aria-hidden','true');
      for(let i=0;i<3;i++)el('span','ta-typing-dot','',dots);
      el('span','ta-sr-only','Mầm đang trả lời',bubble);typingBubbles.add(block);if(parent===log)log.scrollTop=log.scrollHeight;
      return()=>{block.remove();typingBubbles.delete(block);};
    }
    function destroyMenus(){for(const menu of priceMenus.values())menu.destroy();priceMenus.clear();}
    function removeMessage(block){const menu=priceMenus.get(block);if(menu){menu.destroy();priceMenus.delete(block);}block.remove();}
    function showChat(restoreFocus=true){
      if(privacyDocument&&privacyDocument.parentElement===auxBody){privacyDocument.hidden=true;panel.appendChild(privacyDocument);}
      destroyMenus();auxBody.replaceChildren();auxiliary.hidden=true;auxiliary.removeAttribute('data-view');log.hidden=false;
      privacyButton?.setAttribute('aria-expanded','false');
      if(restoreFocus){const target=auxReturnFocus?.isConnected&&!auxiliary.contains(auxReturnFocus)?auxReturnFocus:input;target.focus({preventScroll:true});}
      auxReturnFocus=null;
    }
    function showAuxiliary(title,view,returnFocus){
      showChat(false);auxReturnFocus=returnFocus||input;auxTitle.textContent=title;
      log.hidden=true;auxiliary.hidden=false;auxiliary.dataset.view=view;auxiliary.scrollTop=0;auxBack.focus({preventScroll:true});
    }
    function showPrivacy(){
      if(destroyed||!privacyDocument)return;
      showAuxiliary('Thông tin & quyền riêng tư','privacy',privacyButton);
      privacyDocument.hidden=false;auxBody.appendChild(privacyDocument);privacyButton.setAttribute('aria-expanded','true');
    }
    function cancelPaint(){for(const wait of [...paintWaits])wait.cancel();}
    function nextPaint(){return new Promise(resolve=>{
      const wait={raf:0,timeout:0,cancel:finish};
      function finish(){cancelAnimationFrame(wait.raf);clearTimeout(wait.timeout);paintWaits.delete(wait);resolve();}
      paintWaits.add(wait);wait.raf=requestAnimationFrame(()=>{wait.raf=0;wait.timeout=setTimeout(finish,0);});
    });}
    function setMascotState(state){
      clearTimeout(activityTimer);activityTimer=null;
      avatarMascot.setState(state);launcherMascot.setState(state);host.dataset.mascotState=state;
      if(typeof config.onStateChange==='function'){try{config.onStateChange(state);}catch(_){}}
    }
    function scheduleDeskRest(){
      clearTimeout(deskTimer);
      deskTimer=setTimeout(()=>{
        deskTimer=null;if(destroyed)return;
        if(host.dataset.activity==='working'){scheduleDeskRest();return;}
        setMascotState('idle');statusLabel.textContent='Trợ lý thông tin in ấn';
      },activityIdleMs);
    }
    function keepWorking(){
      if(destroyed)return;setMascotState('working');scheduleDeskRest();
      if(host.dataset.activity!=='working'){host.dataset.activity='idle';statusLabel.textContent='Sẵn sàng cùng bạn';}
    }
    function setActivity(state,keepDesk=false){
      host.dataset.activity=state;
      statusLabel.textContent=state==='greeting'?'Chào bạn, Mầm đây!':'Trợ lý thông tin in ấn';
      if(state==='working'||(state==='idle'&&keepDesk)){keepWorking();return;}
      clearTimeout(deskTimer);deskTimer=null;setMascotState(state);
      if(state==='greeting')activityTimer=setTimeout(()=>{if(!destroyed)setActivity('idle');},900);
    }
    input.addEventListener('input',()=>{if(input.value.length||host.dataset.mascotState==='working')keepWorking();});
    function setOpen(value){if(destroyed)return;panel.hidden=!value;panelWrap.hidden=!value;avatarMascot.setPaused(!value);launcherMascot.setPaused(value);launcher.setAttribute('aria-expanded',String(value));launcher.setAttribute('aria-label',value?'Thu gọn trò chuyện với Mầm':'Mở trò chuyện với Mầm');if(value){setActivity('greeting');input.focus({preventScroll:true});if(!greetingShown&&!log.childElementCount)welcome();}else{generation++;pendingText=null;presentation.cancel();cancelPaint();removeTyping();if(!log.childElementCount)greetingShown=false;showChat(false);aiClient?.abort();infoClient?.abort();setActivity('idle');launcher.focus({preventScroll:true});}dragController?.reclamp();}
    launcher.addEventListener('click',()=>setOpen(panel.hidden));close.addEventListener('click',()=>setOpen(false));
    shadow.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){event.preventDefault();if(!auxiliary.hidden)showChat();else setOpen(false);}});
    function addMessage(text,user=false){
      const copy=String(text||'');
      const polite=user||/^Dạ(?:\s|[,.:!?]|$)/u.test(copy)?copy:'Dạ, '+copy.charAt(0).toLocaleLowerCase('vi-VN')+copy.slice(1);
      const block=el('div','ta-message'+(user?' ta-message-user':''),undefined,log);el('p','ta-message-name',user?'Bạn':'Mầm · Thanh Ấn',block);el('div','ta-message-bubble',polite,block);while(log.childElementCount>50)removeMessage(log.firstElementChild);return block;
    }
    function addSource(parent,source){
      const original=root.ThanhAnFAQ.safeLink(source.url);if(!original)return;
      const url=root.ThanhAnFAQ.safeLink(root.ThanhAnFAQ.displayLink?root.ThanhAnFAQ.displayLink(original):original);if(!url)return;
      const a=el('a','ta-source','Xem chi tiết',parent);a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.referrerPolicy='no-referrer';
    }
    function addContacts(parent){for(const c of data.contacts){const row=el('div','ta-contact',undefined,parent);const name=el('div','ta-contact-person',c.name,row);el('small','',c.phone.replace(/(\d{4})(\d{3})(\d{3})/,'$1 $2 $3'),name);const zalo=el('a','ta-zalo','Zalo ↗',row);zalo.href=c.zalo;zalo.target='_blank';zalo.rel='noopener noreferrer';zalo.referrerPolicy='no-referrer';zalo.setAttribute('aria-label','Mở Zalo của '+c.name);const tel=el('a','ta-tel','Gọi',row);tel.href='tel:'+c.phone;tel.setAttribute('aria-label','Gọi '+c.name);}}
    function render(result,returnFocus){
      if(result.kind==='information'&&result.text.includes('\n• ')){
        const [text,...conditions]=result.text.split('\n• ');
        result={...result,text,informationConditions:conditions};
      }
      if(result.contacts){
        showAuxiliary('Tư vấn qua Zalo','contacts',returnFocus||input);
        el('p','ta-contact-intro','Dạ, website chưa có đủ mọi mức giá và quy cách. Bạn chọn tư vấn viên qua Zalo để được hỗ trợ đúng nhu cầu ạ.',auxBody);
        addContacts(auxBody);return;
      }
      const block=addMessage(result.compactText||result.text);
      if(result.quote){
        block.classList.add('ta-message-quote');
        const bubble=block.querySelector('.ta-message-bubble');
        const lines=(result.compactText||result.text).split('\n');
        if(lines.length===2){bubble.replaceChildren(document.createTextNode(lines[0]+'\n'));el('span','ta-quote-total',lines[1],bubble);}
        const details=el('details','ta-quote-details',undefined,block);
        el('summary','','Quy cách & lưu ý',details);
        const quote=result.quote;
        if(quote.conditions?.length){const list=el('ul','',undefined,details);quote.conditions.forEach(condition=>el('li','',condition,list));}
        if(Number.isSafeInteger(quote.unitPriceVnd))el('p','','Giá làm căn cứ: '+quote.unitPriceVnd.toLocaleString('vi-VN')+' ₫/'+quote.unit+' · Mức số lượng '+quote.sourceQuantity.toLocaleString('vi-VN')+' '+quote.quantityUnit+'.',details);
        if(quote.provenance?.kind==='business-owner-price-update')el('p','','Giá do Thanh Ấn xác nhận ngày '+quote.provenance.approvedOn+'. Nguồn website được giữ để tham chiếu.',details);
        else if(quote.provider==='vinh-phat')el('p','','Giá tham khảo bổ sung; cần xác nhận khi đặt in.',details);
      }
      if(result.informationConditions?.length){const list=el('ul','ta-information-notes',undefined,block);result.informationConditions.forEach(condition=>el('li','',condition,list));}
      if(result.sources?.length){const links=el('div','ta-source-links',undefined,block);const visible=new Set();result.sources.forEach(source=>{const url=root.ThanhAnFAQ.displayLink?.(source.url)||source.url;if(!visible.has(url)){visible.add(url);addSource(links,source);}});}
      if(result.suggestions){const queries=result.suggestions.filter(query=>!['xem gia','xem bang gia','lien he zalo'].includes(root.ThanhAnFAQ.normalize(query)));if(queries.length){const buttons=el('div','ta-suggestions',undefined,block);queries.forEach(query=>{const b=el('button','ta-chip',query,buttons);b.type='button';b.addEventListener('click',()=>send(query));});if(result.kind!=='greeting')addConsultChoice(block);}}
      if(result.contacts)addContacts(block);
      if(log.clientHeight&&block.offsetHeight>log.clientHeight){log.scrollTop+=block.getBoundingClientRect().top-log.getBoundingClientRect().top-12;}else log.scrollTop=log.scrollHeight;
    }
    const categoryQueries=Object.freeze({namecard:'Danh thiếp',catalogue:'Catalogue',decal:'Decal',flyer:'Tờ rơi',bag:'Túi giấy',box:'Hộp giấy',envelope:'Bao thư', 'red-envelope':'Lì xì',receipt:'Phiếu thu',folder:'Folder',tag:'Tag treo',menu:'Menu',wedding:'Thiệp cưới'});
    function addConsultChoice(parent){
      const area=el('div','ta-consult-choice',undefined,parent);
      el('p','','Website chưa có đủ mọi mức giá và quy cách. Nếu chưa tìm thấy nhu cầu của bạn, hãy chọn tư vấn qua Zalo.',area);
      const button=el('button','ta-chip ta-consult-cta','Tư vấn qua Zalo',area);button.type='button';button.addEventListener('click',()=>send('Liên hệ Zalo'));
    }
    function renderQuoteChoices(){
      conversation.reset();const block=addMessage('Dạ, bạn cần in sản phẩm nào ạ? 🌱');
      const choices=el('div','ta-suggestions ta-quote-products',undefined,block);
      root.ThanhAnPriceMenu.buildCatalog(data).categories.forEach(category=>{const b=el('button','ta-chip',category.name,choices);b.type='button';b.addEventListener('click',()=>send(categoryQueries[category.id]));});
      addConsultChoice(block);
      if(log.clientHeight&&block.offsetHeight>log.clientHeight)log.scrollTop+=block.getBoundingClientRect().top-log.getBoundingClientRect().top-12;
      else log.scrollTop=log.scrollHeight;
    }
    function renderPriceMenu(categoryId,returnFocus){
      conversation.reset();showAuxiliary('Bảng giá','prices',returnFocus);
      const menu=root.ThanhAnPriceMenu.create({data,onActivity:()=>{
        if(destroyed)return;keepWorking();
        auxiliary.scrollTo({top:0,behavior:'instant'});
      }});
      auxBody.appendChild(menu.element);priceMenus.set(menu.element,menu);
      const bypass=new WeakSet();
      menu.element.addEventListener('click',event=>{
        const button=event.target.closest?.('.ta-price-category,.ta-price-variant');
        if(!button||bypass.has(button)||destroyed)return;
        event.preventDefault();event.stopImmediatePropagation();generation++;pendingText=null;presentation.cancel();removeTyping();aiClient?.abort();infoClient?.abort();
        const current=generation,finish=showTyping(auxBody),wait=presentation.begin();auxBody.prepend([...typingBubbles].at(-1));auxiliary.scrollTop=0;setActivity('working');
        queue=(async()=>{try{await wait;if(destroyed||current!==generation||!menu.element.isConnected)return;finish();bypass.add(button);button.click();}finally{finish();bypass.delete(button);if(!destroyed&&current===generation)setActivity('idle',!panel.hidden);}})();
      },true);
      if(categoryId)menu.showCategory(categoryId);
      auxBack.focus({preventScroll:true});
    }
    function welcome(){
      greetingShown=true;const current=generation,finish=showTyping(),wait=presentation.begin();
      queue=(async()=>{await wait;finish();if(!destroyed&&current===generation)render({kind:'greeting',text:'Dạ, Mầm chào bạn 🌱 Bạn cần in gì để Mầm hỗ trợ ạ?',suggestions:['Danh thiếp C300','Catalogue','Decal giấy','Giờ làm việc']});})();
      return queue;
    }
    function renderAiSuggestion(suggestion){
      if(suggestion.intent==='product'){
        const category=root.ThanhAnPriceMenu.buildCatalog(data).categories.find(c=>c.id===suggestion.categoryId);
        if(!category)return false;
        const block=addMessage('Dạ, bạn đang cần '+category.name.toLowerCase()+' phải không ạ? Bạn chọn để xem quy cách nhé.');
        const button=el('button','ta-chip','Xem lựa chọn '+category.name,block);button.type='button';
        button.addEventListener('click',()=>{if(destroyed)return;send(categoryQueries[category.id]);});
        addConsultChoice(block);
        log.scrollTop=log.scrollHeight;return true;
      }
      const queries={services:'Dịch vụ',hours:'Giờ làm việc',address:'Địa chỉ',contact:'Liên hệ Zalo',greeting:'Hello'};
      if(queries[suggestion.intent]){render({text:'Dạ, bạn chọn thông tin cần xem ạ. 🌱',suggestions:[queries[suggestion.intent]]});return true;}
      return false;
    }
    function send(value){
      if(destroyed)return Promise.resolve();
      const text=String(value||'').trim();
      if(!text){input.focus();return Promise.resolve();}
      if(pendingText===text)return queue;
      const requestGeneration=++generation;pendingText=text;greetingShown=true;
      presentation.cancel();cancelPaint();removeTyping();aiClient?.abort();infoClient?.abort();
      const returnFocus=shadow.activeElement||input;showChat(false);
      input.value='';alert.hidden=true;
      if(!panel.hidden)input.focus({preventScroll:true});
      addMessage(text,true);setActivity('working');
      const normalized=root.ThanhAnFAQ.normalize(text);
      const menuRequest=root.ThanhAnPriceMenu.isMenuRequest(text);
      const wholeTable=normalized==='xem toan bang gia'||(menuRequest&&normalized.includes('bang gia'));
      // Apply visitor turns in order before any presentation or network wait.
      // A newer turn can cancel an old render while retaining product context.
      let local=null,localError=null;
      try{
        if(menuRequest||wholeTable)conversation.reset();
        else{
          local=conversation.answer(text);
          if(local.kind==='unknown'&&languageMemory){
            const mapped=languageMemory.lookup(text);
            if(mapped?.intent==='product')local=conversation.answer(text,{approvedCategoryId:mapped.categoryId});
            else if(mapped?.intent==='out_of_scope')local={...local,kind:'out_of_scope'};
            else if(mapped){const queries={services:'Dịch vụ',hours:'Giờ làm việc',address:'Địa chỉ',contact:'Liên hệ Zalo',greeting:'Hello'};if(queries[mapped.intent])local=conversation.answer(queries[mapped.intent]);}
          }
        }
      }catch(error){localError=error;}
      const finishTyping=showTyping(),minimumWait=presentation.begin();
      queue=(async()=>{
        try{
          if(localError)throw localError;
          let suggestion=null;
          if(local?.informationQuery&&infoClient){
              const info=await infoClient.get(local.informationQuery.productId,local.informationQuery.field);
              if(destroyed||generation!==requestGeneration)return;
              if(info?.kind==='information')local={kind:'information',text:info.text,sources:info.sources.map(source=>({url:source.url,label:source.provider==='thanh-an'?'Quy cách trên website Thanh Ấn':'Thông tin tham khảo bổ sung'}))};
          }else if(local?.informationQuery)local=snapshotInformation(local.informationQuery)||local;
          if(local?.kind==='unknown'&&aiClient?.getState().consent){
              suggestion=await aiClient.suggest(text);
              if(destroyed||generation!==requestGeneration)return;
          }
          await minimumWait;
          if(destroyed||generation!==requestGeneration)return;
          finishTyping();
          if(wholeTable)renderPriceMenu(undefined,returnFocus);
          else if(menuRequest)renderQuoteChoices();
          else if(!suggestion||!renderAiSuggestion(suggestion))render(local.kind==='greeting'?{...local,text:'Dạ, Mầm chào bạn 🌱 Bạn cần in gì để Mầm hỗ trợ ạ?'}:local,returnFocus);
        }
        catch(_){await minimumWait;if(!destroyed&&generation===requestGeneration){finishTyping();render({text:'Dạ, thông tin này cần kiểm tra thêm. Bạn chọn tư vấn viên qua Zalo để được xác nhận ạ.',contacts:true},returnFocus);}}
        finally{finishTyping();if(!destroyed&&generation===requestGeneration){pendingText=null;setActivity('idle',!panel.hidden);}}
      })();
      return queue;
    }
    form.addEventListener('submit',event=>{event.preventDefault();send(input.value);});setActivity('idle');
    document.body.appendChild(host);
    try{await Promise.all([cssReady,launcherMascot.ready,avatarMascot.ready]);}catch(e){destroyed=true;presentation.destroy();aiClient?.destroy();infoClient?.destroy();host.remove();launcherMascot.destroy();avatarMascot.destroy();throw e;}
    host.style.visibility='visible';
    function updateAvailableHeight(){
      const viewport=root.visualViewport,height=Math.max(160,Math.round(Math.min(root.innerHeight,viewport?.height||root.innerHeight)));
      host.style.setProperty('--ta-available-height',height+'px');
      const keyboard=Boolean(viewport&&viewport.height<root.innerHeight-100);
      host.dataset.keyboardCompact=String(keyboard);host.dataset.keyboardSmall=String(keyboard&&height<320);
    }
    updateAvailableHeight();root.addEventListener('resize',updateAvailableHeight);root.visualViewport?.addEventListener('resize',updateAvailableHeight);
    if(root.ThanhAnDrag){
      dragController=root.ThanhAnDrag.create({host,handles:[header,launcherMascot.element,avatarMascot.element],margin:8,getBounds:()=>{
        const nodes=panel.hidden?[launcher]:[panel,avatar];
        const rects=nodes.map(node=>node.getBoundingClientRect()).filter(rect=>rect.width>0&&rect.height>0);
        if(!rects.length)return host.getBoundingClientRect();
        const left=Math.min(...rects.map(rect=>rect.left)),right=Math.max(...rects.map(rect=>rect.right)),top=Math.min(...rects.map(rect=>rect.top)),bottom=Math.max(...rects.map(rect=>rect.bottom));
        return{left,right,top,bottom,width:right-left,height:bottom-top};
      }});dragController.reclamp();
    }
    mounted={host,shadow,data,open:()=>setOpen(true),close:()=>setOpen(false),send,launcherMascot,avatarMascot,dragController,destroy(){if(destroyed)return;destroyed=true;pendingText=null;presentation.destroy();dragController?.destroy();root.removeEventListener('resize',updateAvailableHeight);root.visualViewport?.removeEventListener('resize',updateAvailableHeight);aiClient?.destroy();infoClient?.destroy();removeTyping();cancelPaint();clearTimeout(activityTimer);clearTimeout(deskTimer);destroyMenus();host.remove();launcherMascot.destroy();avatarMascot.destroy();if(typeof config.onStateChange==='function'){try{config.onStateChange('idle');}catch(_){}}if(mounted&&mounted.host===host)mounted=null;}};
    return mounted;
  }
  function mount(config={}) {
    if(mounted)return Promise.resolve(mounted);
    if(mounting)return mounting;
    mounting=createWidget(config).finally(()=>{mounting=null;});
    return mounting;
  }
  root.ThanhAnChat=Object.freeze({mount});
})(typeof window !== 'undefined' ? window : globalThis);
