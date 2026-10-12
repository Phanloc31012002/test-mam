(function(){'use strict';
const byId=id=>document.getElementById(id);
const run=byId('run'),list=byId('results'),summary=byId('summary');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const frame=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
let instance=null,clickCount=0;
byId('underlay').addEventListener('click',()=>{byId('underlay-count').textContent=++clickCount+' lượt click trang';});
async function tests(){
 run.disabled=true;list.replaceChildren();summary.textContent='Đang kiểm tra…';
 if(instance){instance.destroy();instance=null;}
 const results=[];const check=(name,condition,details='')=>{const pass=!!condition;const r={name,pass,details};results.push(r);const li=document.createElement('li');li.className=pass?'pass':'fail';li.textContent=(pass?'PASS · ':'FAIL · ')+name+(details?' — '+details:'');list.appendChild(li);};
 const options={dataUrl:'../widget/data.json',stylesheetUrl:'../widget/widget.css'};
 const startedAt=new Date().toISOString();
 const storageBefore={local:JSON.stringify({...localStorage}),session:JSON.stringify({...sessionStorage}),cookie:document.cookie};
 try{
  const [a,b]=await Promise.all([ThanhAnChat.mount(options),ThanhAnChat.mount(options)]);instance=a;
  const s=a.shadow,host=a.host,input=s.querySelector('.ta-input'),panel=s.querySelector('.ta-panel'),launcher=s.querySelector('.ta-launcher'),log=s.querySelector('.ta-log');
  const mascot=a.launcherMascot,pupils=mascot.element.querySelector('.ta-mascot-pupils');
  check('Concurrent mount creates exactly one host',a===b&&document.querySelectorAll('#ta-mam-chat-host').length===1);
  check('Widget style is isolated in Shadow DOM',host.shadowRoot===s&&s.querySelector('link[rel=stylesheet]')!==null);
  check('Dataset and nested records are frozen',Object.isFrozen(a.data)&&Object.isFrozen(a.data.products)&&Object.isFrozen(a.data.products[0]));
  check('Launcher starts closed with aria-expanded false',panel.hidden&&launcher.getAttribute('aria-expanded')==='false');
  check('Dialog is modeless and labelled',panel.getAttribute('aria-modal')==='false'&&s.getElementById(panel.getAttribute('aria-labelledby'))!==null);
  check('Input has accessible label, char limit, and no autocomplete',s.querySelector('label').htmlFor===input.id&&input.maxLength===1000&&input.autocomplete==='off');
  check('SVG mascot has two green leaves and independent pupils',mascot.element.querySelector('.ta-mascot-leaves').childElementCount>=20&&pupils.childElementCount===6&&mascot.element.querySelectorAll('rect').length>0);
  check('Pixel shapes stay on integer grid',Array.from(mascot.element.querySelectorAll('rect')).every(r=>['x','y','width','height'].every(k=>Number.isInteger(Number(r.getAttribute(k))))));
  check('Pixel SVG uses crisp edge rendering',mascot.element.getAttribute('shape-rendering')==='crispEdges');
  check('Mascot has a torso, two arms, legs, a head and laptop scene',mascot.element.querySelector('.ta-mascot-torso')&&mascot.element.querySelectorAll('.ta-mascot-arm').length===2&&mascot.element.querySelector('.ta-mascot-legs')&&mascot.element.querySelector('.ta-mascot-head')&&mascot.element.querySelector('.ta-mascot-laptop'));
  mascot.setState('greeting');check('Greeting shows a separate waving hand',mascot.getState()==='greeting'&&getComputedStyle(mascot.element.querySelector('.ta-mascot-wave')).display!=='none'&&getComputedStyle(mascot.element.querySelector('.ta-mascot-arm-right')).display==='none');
  mascot.setState('working');check('Working shows desk, laptop and typing hands',getComputedStyle(mascot.element.querySelector('.ta-mascot-work')).display!=='none'&&mascot.element.querySelectorAll('.ta-mascot-typing').length===2&&getComputedStyle(mascot.element.querySelector('.ta-mascot-legs')).display==='none');
  mascot.setState('idle');check('Idle returns to standing plant without desk',getComputedStyle(mascot.element.querySelector('.ta-mascot-work')).display==='none'&&getComputedStyle(mascot.element.querySelector('.ta-mascot-legs')).display!=='none');
  const reducedSystem=matchMedia('(prefers-reduced-motion: reduce)').matches;
  mascot.gaze(100,-100);
  check('Pupils clamp to safe grid offsets',Math.abs(Number(pupils.dataset.gazeX))<=1&&Math.abs(Number(pupils.dataset.gazeY))<=1);
  check('Head tilt and lift clamp independently of the pupils',Math.abs(Number(mascot.element.querySelector('.ta-mascot-head').dataset.headTilt))<=2&&Number(mascot.element.querySelector('.ta-mascot-head').dataset.headY)===0);
  let connected=true;
  for(const state of ['idle','greeting','working']){
    mascot.setState(state);
    for(const [dx,dy] of [[-100,-100],[-100,100],[100,-100],[100,100]]){
      mascot.gaze(dx,dy);await frame();
      const head=mascot.element.querySelector('.ta-mascot-head'),h=head.getBoundingClientRect(),n=mascot.element.querySelector('.ta-mascot-neck').getBoundingClientRect(),t=mascot.element.querySelector('.ta-mascot-torso').getBoundingClientRect();
      connected=connected&&head.dataset.headY==='0'&&Math.abs(Number(head.dataset.headTilt))<=2&&h.bottom>n.top&&h.left<n.right&&h.right>n.left&&n.bottom>t.top&&n.left<t.right&&n.right>t.left;
    }
  }
  check('Head remains attached at all extreme gaze corners and states',connected);
  mascot.setState('idle');
  mascot.gaze(0,0);
  if(!reducedSystem&&matchMedia('(hover: hover) and (pointer: fine)').matches){
   const bb=mascot.element.getBoundingClientRect();
   window.dispatchEvent(new PointerEvent('pointermove',{clientX:bb.x+bb.width/2-100,clientY:bb.y+bb.height*.57-100,pointerType:'mouse'}));await frame();
   check('Nearby pointer moves pupils independently of face',pupils.dataset.gazeX==='-1'&&pupils.dataset.gazeY==='-1',pupils.getAttribute('transform'));
   window.dispatchEvent(new PointerEvent('pointermove',{clientX:bb.x+bb.width/2+100,clientY:bb.y+bb.height*.57+100,pointerType:'touch'}));await frame();
   check('Touch pointer does not cause gaze tracking',pupils.dataset.gazeX==='-1'&&pupils.dataset.gazeY==='-1');
   window.dispatchEvent(new PointerEvent('pointermove',{clientX:bb.x-1000,clientY:bb.y-1000,pointerType:'mouse'}));await frame();
   check('Far pointer returns gaze to center',pupils.dataset.gazeX==='0'&&pupils.dataset.gazeY==='0');
   mascot.gaze(1,1);window.dispatchEvent(new Event('blur'));check('Window blur resets gaze',pupils.dataset.gazeX==='0'&&pupils.dataset.gazeY==='0');
  }else check('Fine-pointer tracking correctly disabled by device/preference',mascot.element.dataset.reducedMotion===String(reducedSystem),'Pointer fine: '+matchMedia('(pointer: fine)').matches);
  if(!reducedSystem){
   // Restart the idle scheduler so an automatic blink cannot overlap this manual timing check.
   mascot.setPaused(true);mascot.setPaused(false);
   check('Blink closes eye group and shows eyelids',mascot.blink()&&getComputedStyle(mascot.element.querySelector('.ta-mascot-eyes')).display==='none'&&getComputedStyle(mascot.element.querySelector('.ta-mascot-closed')).display!=='none');
   await delay(180);check('Blink reopens after short interval',!mascot.element.hasAttribute('data-blink')&&getComputedStyle(mascot.element.querySelector('.ta-mascot-eyes')).display!=='none');
   const body=mascot.element.querySelector('.ta-mascot-body'),leaf=mascot.element.querySelector('.ta-mascot-leaves');
   await frame();
   const before={body:getComputedStyle(body).transform,leaf:getComputedStyle(leaf).transform};let bodyMoved=false,leafMoved=false;
   for(let sample=0;sample<4&&(!bodyMoved||!leafMoved);sample++){await delay(200);await frame();bodyMoved=bodyMoved||getComputedStyle(body).transform!==before.body;leafMoved=leafMoved||getComputedStyle(leaf).transform!==before.leaf;}
   check('Idle bounce and leaf sway visibly change transforms',bodyMoved&&leafMoved,JSON.stringify({bodyAnimation:getComputedStyle(body).animationName,leafAnimation:getComputedStyle(leaf).animationName,bodyMoved,leafMoved}));
   check('Automatic blink scheduler starts within declared idle range',await new Promise(resolve=>{const obs=new MutationObserver(()=>{if(mascot.element.dataset.blink==='true'){obs.disconnect();clearTimeout(timeout);resolve(true);}});obs.observe(mascot.element,{attributes:true,attributeFilter:['data-blink']});const timeout=setTimeout(()=>{obs.disconnect();resolve(false);},6200);}));
  }
  mascot.setReducedMotion(true);mascot.setState('working');mascot.gaze(1,1);
  check('Reduced motion disables blink and gaze',!mascot.blink()&&pupils.dataset.gazeX==='0'&&pupils.dataset.gazeY==='0');
  check('Reduced motion disables bounce, sway, and shadow animation',Array.from(mascot.element.querySelectorAll('*')).every(e=>getComputedStyle(e).animationName==='none'));
  check('Reduced motion centers the head and disables typing',mascot.element.querySelector('.ta-mascot-head').dataset.headTilt==='0'&&getComputedStyle(mascot.element.querySelector('.ta-mascot-typing-left')).animationName==='none');
  mascot.setState('idle');mascot.setReducedMotion(false);
  launcher.click();check('Hidden launcher pauses while visible avatar resumes',mascot.element.dataset.paused==='true'&&a.avatarMascot.element.dataset.paused==='false');check('Launcher opens and focuses input',!panel.hidden&&s.activeElement===input&&launcher.getAttribute('aria-expanded')==='true');
  input.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,composed:true,cancelable:true}));check('Escape closes and restores focus to launcher',panel.hidden&&s.activeElement===launcher);
  launcher.click();s.querySelector('.ta-close').click();check('Close button restores launcher focus',panel.hidden&&s.activeElement===launcher);
  a.open();const box=panel.getBoundingClientRect();
  check('Panel fits current viewport',box.left>=0&&box.top>=0&&box.right<=document.documentElement.clientWidth+.5&&box.bottom<=innerHeight+.5,JSON.stringify({viewport:{width:innerWidth,height:innerHeight},panel:{left:box.left,top:box.top,right:box.right,bottom:box.bottom,width:box.width,height:box.height}}));
  check('Page remains scrollable with no modal backdrop',getComputedStyle(document.body).overflow!=='hidden'&&getComputedStyle(host).pointerEvents==='none'&&s.querySelectorAll('.backdrop').length===0);
  input.value='<img src=x onerror=alert(1)>';s.querySelector('form').requestSubmit();await frame();await delay(20);
  check('HTML/XSS input is literal text, never parsed',log.querySelector('.ta-message-user .ta-message-bubble').textContent==='<img src=x onerror=alert(1)>'&&log.querySelectorAll('img,script').length===0);
  check('Submission clears input and keeps keyboard focus',input.value===''&&s.activeElement===input);
  const row=a.data.products.flatMap(p=>p.priceFacts||[])[0];await a.send(row.lookupQuery);
  check('Exact source row renders correct data and safe external source',log.lastElementChild.textContent.includes(ThanhAnFAQ.money(row.priceVnd))&&log.lastElementChild.querySelector('.ta-source').href===row.sourceUrl&&log.lastElementChild.querySelector('.ta-source').rel.includes('noopener'));
  await a.send('gọi nhân viên');const contacts=Array.from(log.lastElementChild.querySelectorAll('.ta-contact a'));
  check('3 verified contacts render 6 exact chosen links',contacts.length===6&&a.data.contacts.every(c=>contacts.some(link=>link.getAttribute('href')===c.zalo)&&contacts.some(link=>link.getAttribute('href')==='tel:'+c.phone)));
  check('Contact links never include message text or query data',contacts.every(link=>!link.getAttribute('href').includes('?')&&!link.getAttribute('href').includes('text=')));
  const lookup=a.send('Giờ làm việc');await Promise.resolve();
  check('Local lookup paints working state with a truthful status',host.dataset.activity==='working'&&a.avatarMascot.getState()==='working'&&s.querySelector('.ta-subtitle').textContent.includes('Đang tra'));
  await lookup;check('Completed lookup returns mascot and status to idle',host.dataset.activity==='idle'&&a.avatarMascot.getState()==='idle');
  const cancelled=a.send('Catalogue A4 16 trang 500 cuốn');await Promise.resolve();s.querySelector('.ta-footnote button').click();await cancelled;
  check('Clear during local lookup cancels pending conversation work',log.childElementCount===1&&!log.textContent.includes('15.000'));
  s.querySelector('.ta-footnote button').click();check('Clear resets session to one greeting',log.childElementCount===1&&log.querySelectorAll('.ta-message-user').length===0&&s.activeElement===input);
  const last=()=>log.lastElementChild.textContent;
  await a.send('cattalouge a4 bìa C250 ruột C150 giá 16 trang');check('Real typo request retains catalogue, A4 and 16 pages',/bao nhiêu cuốn/.test(last())&&!/ấn phẩm nào/.test(last()));
  await a.send('500');check('Bare quantity reply returns catalogue 15000 per book',last().includes('15.000 ₫/cuốn')&&last().includes('16 trang')&&last().includes('500 cuốn'));
  await frame();const quotedBubble=log.lastElementChild.querySelector('.ta-message-bubble').getBoundingClientRect(),logBox=log.getBoundingClientRect();check('Long price reply starts visibly inside the chat viewport',quotedBubble.top>=logBox.top-1&&quotedBubble.top<logBox.bottom-40);
  await a.send('1000 cuốn');check('Quantity change retains catalogue page count',last().includes('9.000 ₫/cuốn')&&last().includes('16 trang')&&last().includes('1000 cuốn'));
  await a.send('giá card');await a.send('C300');await a.send('5 hộp');check('Product switch resets catalogue context and quotes C300 box tier',last().includes('80.000 ₫/hộp')&&!last().includes('16 trang'));
  s.querySelector('.ta-footnote button').click();await a.send('catalogue a5 200 cuốn');
  check('A5 200 preserves actual size and never substitutes an A4 price',last().includes('A5')&&last().includes('200')&&!last().includes('22.000')&&!last().includes('5.800')&&log.lastElementChild.querySelector('.ta-handoff')!==null);
  s.querySelector('.ta-footnote button').click();await a.send('catalogue A4 toàn bộ C150 16 trang 500 cuốn');
  check('Missing all-C150 variant uses its exact Vinh Phat source',last().includes('13.000')&&log.lastElementChild.querySelector('.ta-source').href.includes('invinhphat.com'));
  s.querySelector('.ta-footnote button').click();await a.send('500');check('Clear also forgets product and pending slots',!last().includes('₫/cuốn')&&!last().includes('₫/hộp'));
  s.querySelector('.ta-footnote button').click();
  const count=log.childElementCount;s.querySelectorAll('.ta-quick button')[1].click();await frame();await delay(20);check('Quick service button works',log.childElementCount>count&&log.lastElementChild.textContent.includes('Thanh Ấn'));
  for(let n=0;n<30;n++)await a.send('chào');check('Conversation memory is bounded to 50 blocks',log.childElementCount<=50);
  check('No persistent visitor storage or cookies',JSON.stringify({...localStorage})===storageBefore.local&&JSON.stringify({...sessionStorage})===storageBefore.session&&document.cookie===storageBefore.cookie);
  check('No external network requests while chatting',performance.getEntriesByType('resource').every(r=>new URL(r.name,location.href).origin===location.origin));
  const aborted=a.send('Giờ làm việc');await Promise.resolve();a.destroy();await aborted;check('Destroy cancels and resolves pending lookup',host.dataset.activity==='working'&&document.getElementById('ta-mam-chat-host')===null);check('Destroy removes host and all widget DOM',document.getElementById('ta-mam-chat-host')===null);instance=null;
  instance=await ThanhAnChat.mount({...options,reducedMotion:true});instance.open();
  a.destroy();a.open();const reused=await ThanhAnChat.mount(options);check('Old destroy/open cannot remove or duplicate a remounted instance',reused===instance&&document.querySelectorAll('#ta-mam-chat-host').length===1);
  check('Remount starts clean with no conversation persistence',instance.shadow.querySelectorAll('.ta-message').length===1);
  check('Forced reduced motion removes panel animation and smooth scrolling',getComputedStyle(instance.shadow.querySelector('.ta-panel')).animationName==='none'&&getComputedStyle(instance.shadow.querySelector('.ta-log')).scrollBehavior==='auto');
  instance.close();byId('underlay').click();check('Underlying page control still works',clickCount>0);
  await frame();
 }catch(error){check('Harness completes without runtime error',false,error.message);}
 const passed=results.filter(r=>r.pass).length;const report={suite:'Mầm browser interaction',startedAt,finishedAt:new Date().toISOString(),viewport:{width:innerWidth,height:innerHeight},total:results.length,passed,failed:results.length-passed,tests:results};
 byId('results-json').textContent=JSON.stringify(report,null,2);summary.textContent=passed+'/'+results.length+' PASS · '+report.failed+' FAIL';run.disabled=false;
}
run.addEventListener('click',tests);
})();
