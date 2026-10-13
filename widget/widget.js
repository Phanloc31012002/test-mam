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
    if(!root.ThanhAnFAQ||!root.ThanhAnMascot||!root.ThanhAnPriceMenu)throw new Error('Thiếu thành phần widget');
    let data=config.data;
    if(!data){const r=await fetch(assetUrl(config.dataUrl),{credentials:'omit',cache:'no-cache',referrerPolicy:'no-referrer'});if(!r.ok)throw new Error('Không tải được dữ liệu FAQ');data=await r.json();}
    root.ThanhAnFAQ.validateData(data);
    // Preserve source truth against changes from visitor messages.
    data=JSON.parse(JSON.stringify(data));
    function freeze(value){Object.freeze(value);Object.values(value).forEach(v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v))freeze(v);});}freeze(data);
    const conversation=root.ThanhAnFAQ.createSession?root.ThanhAnFAQ.createSession(data):{answer:text=>root.ThanhAnFAQ.answer(text,data),reset(){}};
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
    const close=el('button','ta-close','×',header);close.type='button';close.setAttribute('aria-label','Đóng trò chuyện');
    const scope=el('div','ta-scope',undefined,panel);el('strong','','FAQ & giá website',scope);el('span','',' · Dữ liệu '+data.snapshotLabel+' · Cần xác nhận báo giá',scope);
    const aiClient=config.aiEndpoint&&root.ThanhAnGemini?root.ThanhAnGemini.create({endpoint:assetUrl(config.aiEndpoint),fetchImpl:config.aiFetch}):null;
    let aiConsent=null;
    if(aiClient){
      const details=el('details','ta-ai-options',undefined,panel);
      const summary=el('summary','','Gemini thử nghiệm · đang kiểm tra',details);
      el('p','ta-ai-notice','Khi bật AI, câu chưa hiểu được Google xử lý. Bản miễn phí có thể dùng nội dung để cải thiện sản phẩm và có người xét duyệt. Đừng nhập thông tin cá nhân hoặc bí mật.',details);
      const consentLabel=el('label','ta-ai-label',undefined,details);
      aiConsent=el('input','ta-ai-consent',undefined,consentLabel);aiConsent.type='checkbox';aiConsent.disabled=true;
      el('span','','Tôi từ 18 tuổi, đang tại Việt Nam và đồng ý gửi câu chưa hiểu cho Google.',consentLabel);
      aiConsent.addEventListener('change',()=>{aiConsent.checked=aiClient.setConsent(aiConsent.checked);});
      aiClient.check().then(enabled=>{if(destroyed)return;aiConsent.disabled=!enabled;summary.textContent=enabled?'Gemini thử nghiệm · tùy chọn':'Gemini chưa kết nối · đang dùng FAQ';});
    }
    const log=el('div','ta-log',undefined,panel);log.setAttribute('role','log');log.setAttribute('aria-live','polite');log.setAttribute('aria-relevant','additions');log.setAttribute('aria-label','Cuộc trò chuyện với Mầm');
    const quick=el('div','ta-quick',undefined,panel);
    [['↗ Báo giá','Xem giá'],['▦ Xem bảng giá','Xem bảng giá'],['♡ Zalo','Liên hệ Zalo']].forEach(([label,query])=>{const b=el('button','ta-chip',label,quick);b.type='button';b.addEventListener('click',()=>send(query));});
    const form=el('form','ta-form',undefined,panel);
    const label=el('label','ta-sr-only','Câu hỏi cho Mầm',form);label.htmlFor='ta-mam-input';
    const input=el('input','ta-input',undefined,form);input.id='ta-mam-input';input.type='text';input.placeholder='Bạn đang cần in gì?';input.maxLength=1000;input.autocomplete='off';input.setAttribute('enterkeyhint','send');
    const submit=el('button','ta-send',undefined,form);submit.type='submit';submit.setAttribute('aria-label','Gửi câu hỏi');icon(submit);
    const alert=el('p','ta-alert','',panel);alert.setAttribute('role','status');alert.hidden=true;
    const foot=el('p','ta-footnote',undefined,panel);el('span','','Chat chỉ lưu trong phiên mở trang. ',foot);const clear=el('button','','Làm mới',foot);clear.type='button';clear.style.cssText='border:0;background:transparent;color:#596c50;font-size:10px;padding:3px;text-decoration:underline;min-height:24px';clear.addEventListener('click',()=>{if(destroyed)return;generation++;cancelPaint();aiClient?.setConsent(false);if(aiConsent)aiConsent.checked=false;destroyMenus();setActivity('greeting');conversation.reset();log.replaceChildren();welcome();input.value='';input.focus();});
    const launcher=el('button','ta-launcher',undefined,shell);launcher.type='button';launcher.setAttribute('aria-expanded','false');launcher.setAttribute('aria-controls',panel.id);launcher.setAttribute('aria-label','Mở trò chuyện với Mầm');
    const launcherLabel=el('span','ta-launcher-label','Mầm giúp bạn nhé?',launcher);el('small','','Tìm giá & thông tin in ấn',launcherLabel);
    const launcherPlant=el('span','ta-launcher-plant',undefined,launcher);const launcherMascot=root.ThanhAnMascot.create({reducedMotion:config.reducedMotion,attentionDurationMs:config.attentionDurationMs});launcherPlant.appendChild(launcherMascot.element);el('span','ta-collapse-icon','⌄',launcherPlant);
    let destroyed=false,activityTimer=null,deskTimer=null,generation=0,queue=Promise.resolve();
    const activityIdleMs=Number.isFinite(config.activityIdleMs)?Math.max(100,Math.min(60000,config.activityIdleMs)):10000;
    const paintWaits=new Set();
    const priceMenus=new Map();
    function destroyMenus(){for(const menu of priceMenus.values())menu.destroy();priceMenus.clear();}
    function removeMessage(block){const menu=priceMenus.get(block);if(menu){menu.destroy();priceMenus.delete(block);}block.remove();}
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
      statusLabel.textContent=state==='working'?'Đang tra bảng giá & FAQ':state==='greeting'?'Chào bạn, Mầm đây!':'Trợ lý thông tin in ấn';
      if(state==='working'||(state==='idle'&&keepDesk)){keepWorking();return;}
      clearTimeout(deskTimer);deskTimer=null;setMascotState(state);
      if(state==='greeting')activityTimer=setTimeout(()=>{if(!destroyed)setActivity('idle');},900);
    }
    input.addEventListener('input',()=>{if(input.value.length||host.dataset.mascotState==='working')keepWorking();});
    function setOpen(value){if(destroyed)return;panel.hidden=!value;panelWrap.hidden=!value;avatarMascot.setPaused(!value);launcherMascot.setPaused(value);launcher.setAttribute('aria-expanded',String(value));launcher.setAttribute('aria-label',value?'Thu gọn trò chuyện với Mầm':'Mở trò chuyện với Mầm');if(value){setActivity('greeting');input.focus({preventScroll:true});}else{aiClient?.abort();setActivity('idle');launcher.focus({preventScroll:true});}}
    launcher.addEventListener('click',()=>setOpen(panel.hidden));close.addEventListener('click',()=>setOpen(false));
    shadow.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){event.preventDefault();setOpen(false);}});
    function addMessage(text,user=false){const block=el('div','ta-message'+(user?' ta-message-user':''),undefined,log);el('p','ta-message-name',user?'Bạn':'Mầm · Thanh Ấn',block);el('div','ta-message-bubble',text,block);while(log.childElementCount>50)removeMessage(log.firstElementChild);return block;}
    function addSource(parent,source){const url=root.ThanhAnFAQ.safeLink(source.url);if(!url)return;const a=el('a','ta-source',source.label,parent);a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.referrerPolicy='no-referrer';}
    function addContacts(parent){for(const c of data.contacts){const row=el('div','ta-contact',undefined,parent);const name=el('div','ta-contact-person',c.name,row);el('small','',c.phone.replace(/(\d{4})(\d{3})(\d{3})/,'$1 $2 $3'),name);const zalo=el('a','ta-zalo','Zalo ↗',row);zalo.href=c.zalo;zalo.target='_blank';zalo.rel='noopener noreferrer';zalo.referrerPolicy='no-referrer';zalo.setAttribute('aria-label','Mở Zalo của '+c.name);const tel=el('a','ta-tel','Gọi',row);tel.href='tel:'+c.phone;tel.setAttribute('aria-label','Gọi '+c.name);}}
    function render(result){const block=addMessage(result.compactText||result.text);if(result.quote?.conditions?.length){const details=el('details','ta-quote-details',undefined,block);el('summary','','Quy cách & điều kiện',details);const list=el('ul','',undefined,details);result.quote.conditions.forEach(condition=>el('li','',condition,list));}if(result.sources){const links=el('div','ta-source-links',undefined,block);result.sources.forEach(s=>addSource(links,s));}if(result.suggestions){const buttons=el('div','ta-suggestions',undefined,block);result.suggestions.forEach(query=>{const b=el('button','ta-chip',query,buttons);b.type='button';b.addEventListener('click',()=>send(query));});}if(result.contacts)addContacts(block);if(result.handoff&&!result.contacts){const handoff=el('div','ta-handoff',undefined,block);const b=el('button','','Nhắn Zalo để tư vấn →',handoff);b.type='button';b.addEventListener('click',()=>send('Liên hệ Zalo'));}if(log.clientHeight&&block.offsetHeight>log.clientHeight){log.scrollTop+=block.getBoundingClientRect().top-log.getBoundingClientRect().top-12;}else log.scrollTop=log.scrollHeight;}
    const categoryQueries=Object.freeze({namecard:'Danh thiếp',catalogue:'Catalogue',decal:'Decal',flyer:'Tờ rơi',bag:'Túi giấy',box:'Hộp giấy',envelope:'Bao thư', 'red-envelope':'Lì xì',receipt:'Phiếu thu',folder:'Folder',tag:'Tag treo',menu:'Menu',wedding:'Thiệp cưới'});
    function renderQuoteChoices(){
      conversation.reset();const block=addMessage('Bạn cần in gì? 🌱');
      const choices=el('div','ta-suggestions ta-quote-products',undefined,block);
      root.ThanhAnPriceMenu.buildCatalog(data).categories.forEach(category=>{const b=el('button','ta-chip',category.name,choices);b.type='button';b.addEventListener('click',()=>send(categoryQueries[category.id]));});
      if(log.clientHeight&&block.offsetHeight>log.clientHeight)log.scrollTop+=block.getBoundingClientRect().top-log.getBoundingClientRect().top-12;
      else log.scrollTop=log.scrollHeight;
    }
    function renderPriceMenu(categoryId){
      conversation.reset();const block=addMessage('Bạn cần in gì?');
      const menu=root.ThanhAnPriceMenu.create({data,onActivity:()=>{
        if(destroyed)return;keepWorking();
        if(log.clientHeight)log.scrollTo({top:log.scrollTop+block.getBoundingClientRect().top-log.getBoundingClientRect().top-12,behavior:'instant'});
      }});
      block.querySelector('.ta-message-bubble').replaceChildren(menu.element);priceMenus.set(block,menu);
      if(categoryId)menu.showCategory(categoryId);
      if(log.clientHeight)log.scrollTo({top:log.scrollTop+block.getBoundingClientRect().top-log.getBoundingClientRect().top-12,behavior:'instant'});
    }
    function welcome(){render({text:'Hello, mình là Mầm nè 🌱\nBạn cần in gì? Mầm tra giá đúng quy cách từ bảng đã đăng. Giá bổ sung là giá tham khảo; quy cách riêng thì mình kết nối Zalo nhé.',suggestions:['Danh thiếp C300','Catalogue','Decal giấy','Giờ làm việc']});}
    function renderAiSuggestion(suggestion){
      if(suggestion.intent==='product'){
        const category=root.ThanhAnPriceMenu.buildCatalog(data).categories.find(c=>c.id===suggestion.categoryId);
        if(!category)return false;
        const block=addMessage('Mầm đoán bạn đang cần '+category.name.toLowerCase()+' 🌱 Bạn chọn để xem quy cách nhé.');
        const button=el('button','ta-chip','Xem lựa chọn '+category.name,block);button.type='button';
        button.addEventListener('click',()=>{if(destroyed)return;send(categoryQueries[category.id]);});
        log.scrollTop=log.scrollHeight;return true;
      }
      const queries={services:'Dịch vụ',hours:'Giờ làm việc',address:'Địa chỉ',contact:'Liên hệ Zalo',greeting:'Hello'};
      if(queries[suggestion.intent]){render({text:'Mầm hiểu ý rồi 🌱 Bạn chọn thông tin cần xem nhé.',suggestions:[queries[suggestion.intent]]});return true;}
      return false;
    }
    function send(value){
      if(destroyed)return Promise.resolve();
      const text=String(value||'').trim();
      if(!text){input.focus();return Promise.resolve();}
      const requestGeneration=generation;
      input.value='';alert.hidden=true;
      if(!panel.hidden)input.focus({preventScroll:true});
      queue=queue.then(async()=>{
        if(destroyed||generation!==requestGeneration)return;
        addMessage(text,true);setActivity('working');
        // Let the browser paint the local lookup state. No artificial AI delay.
        await nextPaint();
        if(destroyed||generation!==requestGeneration)return;
        try{
          if(root.ThanhAnFAQ.normalize(text)==='xem toan bang gia'||(root.ThanhAnPriceMenu.isMenuRequest(text)&&root.ThanhAnFAQ.normalize(text).includes('bang gia')))renderPriceMenu();
          else if(root.ThanhAnPriceMenu.isMenuRequest(text))renderQuoteChoices();
          else{
            const local=conversation.answer(text);let usedAI=false;
            if(local.kind==='unknown'&&aiClient?.getState().consent){
              statusLabel.textContent='Mầm đang nhờ Gemini hiểu ý…';
              const suggestion=await aiClient.suggest(text);
              if(destroyed||generation!==requestGeneration)return;
              if(suggestion)usedAI=renderAiSuggestion(suggestion);
            }
            if(!usedAI)render(local.kind==='greeting'?{...local,text:'Hello, mình là Mầm nè 🌱 Bạn cần in gì để mình giúp nha?'}:local);
          }
        }
        catch(_){render({text:'Dữ liệu đang cần kiểm tra. Bạn liên hệ trực tiếp Thanh Ấn để được xác nhận nhé.',contacts:true});}
        finally{if(!destroyed&&generation===requestGeneration)setActivity('idle',!panel.hidden);}
      });
      return queue;
    }
    form.addEventListener('submit',event=>{event.preventDefault();send(input.value);});setActivity('idle');welcome();
    document.body.appendChild(host);
    try{await Promise.all([cssReady,launcherMascot.ready,avatarMascot.ready]);}catch(e){destroyed=true;aiClient?.destroy();host.remove();launcherMascot.destroy();avatarMascot.destroy();throw e;}
    host.style.visibility='visible';
    mounted={host,shadow,data,open:()=>setOpen(true),close:()=>setOpen(false),send,launcherMascot,avatarMascot,destroy(){if(destroyed)return;destroyed=true;aiClient?.destroy();cancelPaint();clearTimeout(activityTimer);clearTimeout(deskTimer);destroyMenus();host.remove();launcherMascot.destroy();avatarMascot.destroy();if(typeof config.onStateChange==='function'){try{config.onStateChange('idle');}catch(_){}}if(mounted&&mounted.host===host)mounted=null;}};
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
