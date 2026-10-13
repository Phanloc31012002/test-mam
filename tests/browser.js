(function(){'use strict';
const byId=id=>document.getElementById(id);
const run=byId('run'),list=byId('results'),summary=byId('summary');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const frame=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
const pointerFrame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
function compactPrice(block,quantity,unit,total,specs=[]){const text=block.querySelector('.ta-message-bubble').textContent,lines=text.split('\n'),amount=quantity.toLocaleString('vi-VN')+' '+unit+': '+total.toLocaleString('vi-VN')+' ₫';return lines.length===2&&specs.every(spec=>lines[0].includes(spec))&&(lines[1]===amount||lines[1]===amount+' (chưa VAT)')&&!/Tổng tham khảo|Nguồn giá|mức nguồn|quy tắc chủ|đơn thực tế|cần tư vấn viên/i.test(text);}
function textContrast(element){const rgb=value=>{const match=value.match(/^rgba?\(([^)]+)\)$/);if(!match)return null;const values=match[1].split(/[\s,\/]+/).filter(Boolean).map(Number);return {r:values[0]/255,g:values[1]/255,b:values[2]/255,a:values[3]??1};},over=(top,bottom)=>{const a=top.a+bottom.a*(1-top.a);return {r:(top.r*top.a+bottom.r*bottom.a*(1-top.a))/a,g:(top.g*top.a+bottom.g*bottom.a*(1-top.a))/a,b:(top.b*top.a+bottom.b*bottom.a*(1-top.a))/a,a};};const chain=[];for(let node=element;node;node=node.parentElement)chain.push(node);let background={r:1,g:1,b:1,a:1};for(const node of chain.reverse()){const color=rgb(getComputedStyle(node).backgroundColor);if(color)background=over(color,background);}const foreground=rgb(getComputedStyle(element).color);if(!foreground)return 0;const luminance=color=>[color.r,color.g,color.b].map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0),a=luminance(over(foreground,background)),b=luminance(background);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);}
function verticalScrollers(panel,log,aux){return [...panel.querySelectorAll('*')].filter(element=>{const style=getComputedStyle(element);return element.getClientRects().length>0&&element.clientHeight>0&&['auto','scroll'].includes(style.overflowY)&&(element===log||element===aux||element.scrollHeight>element.clientHeight+1);});}
function oneScroller(panel,log,aux,expected){const found=verticalScrollers(panel,log,aux);return {pass:found.length===1&&found[0]===expected,details:found.map(element=>({className:element.className,clientHeight:element.clientHeight,scrollHeight:element.scrollHeight,overflowY:getComputedStyle(element).overflowY}))};}
const SPRITE_SHA='4cc6c9f4bc61882379472dfa7fa91ca128b90933b0ae3cda9fff3da91dc6d1f8';
const EARRING_SOURCE='https://invinhphat.com/san-pham/in-tag-treo-khuyen-tai/';
const NATIVE_STATES=[['idle',0,6],['running-right',1,8],['running-left',2,8],['waving',3,4],['jumping',4,5],['failed',5,8],['waiting',6,6],['running',7,6],['review',8,6]];
function pixels(canvas){return canvas.getContext('2d',{willReadFrequently:true}).getImageData(0,0,192,208).data;}
function pixelHash(rgba){let hash=2166136261;for(const value of rgba)hash=Math.imul((hash^value)>>>0,16777619)>>>0;return hash.toString(16).padStart(8,'0');}
async function originalSprite(url){
 const response=await fetch(url,{credentials:'omit',cache:'no-cache',referrerPolicy:'no-referrer'});if(!response.ok)throw new Error('Original sprite could not be loaded');
 const bytes=await response.arrayBuffer(),digest=await crypto.subtle.digest('SHA-256',bytes),sha=[...new Uint8Array(digest)].map(value=>value.toString(16).padStart(2,'0')).join('');
 if(sha!==SPRITE_SHA)throw new Error('Original sprite bytes do not match the pinned SHA-256');
 // The local preview CSP allows same-origin images, not blob URLs. Decode a separate image.
 const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('Independent original sprite image could not be decoded'));image.src=url;});
 const canvas=document.createElement('canvas');canvas.width=192;canvas.height=208;const context=canvas.getContext('2d',{willReadFrequently:true});context.imageSmoothingEnabled=false;const cache=new Map();
 return {sha,width:image.naturalWidth,height:image.naturalHeight,cell(row,column){const key=row+':'+column;if(!cache.has(key)){context.clearRect(0,0,192,208);context.drawImage(image,column*192,row*208,192,208,0,0,192,208);cache.set(key,context.getImageData(0,0,192,208).data);}return cache.get(key);}};
}
function cellProof(mascot,reference,row,column){
 const actual=pixels(mascot.element),expected=reference.cell(row,column);let mismatches=0,alphaMismatches=0,transparent=0,ghosts=0;
 for(let index=0;index<actual.length;index+=4){if(actual[index]!==expected[index]||actual[index+1]!==expected[index+1]||actual[index+2]!==expected[index+2]||actual[index+3]!==expected[index+3])mismatches++;if(actual[index+3]!==expected[index+3])alphaMismatches++;if(expected[index+3]===0){transparent++;if(actual[index+3]!==0)ghosts++;}}
 return {row,frame:column,mismatches,alphaMismatches,transparent,ghosts,hash:pixelHash(actual)};
}
async function playbackProof(mascot,reference,state,row,count,timeoutMs=8000){
 mascot.setState(state);mascot.setPaused(false);const seen=new Map(),unexpected=[],start=performance.now();let previous='',cycled=false,seenNonzero=false;
 while(performance.now()-start<timeoutMs&&(!cycled||seen.size<count)){
  const info=mascot.getFrame(),key=info.row+':'+info.frame;
  if(key!==previous){previous=key;const proof=cellProof(mascot,reference,info.row,info.frame);if(info.row===row&&info.frame>=0&&info.frame<count){if(info.frame===0&&seenNonzero&&seen.size===count)cycled=true;seen.set(info.frame,proof);seenNonzero=seenNonzero||info.frame>0;}else unexpected.push({row:info.row,frame:info.frame,spriteState:info.spriteState});}
  if(!cycled||seen.size<count)await delay(20);
 }
 mascot.setPaused(true);return {state,row,count,cycled,seen:[...seen.keys()].sort((a,b)=>a-b),proofs:[...seen.values()],unexpected,elapsedMs:performance.now()-start};
}
async function quietCycleProof(mascot,reference,sequence,timeoutMs=12000){
 const cycles=[],unexpected=[],started=performance.now();let current=null,last='';
 // Start the quiet clock after this known boundary, independently of creation/check overhead.
 mascot.setPaused(true);mascot.setPaused(false);
 while(performance.now()-started<timeoutMs&&cycles.length<sequence.length){
  const info=mascot.getFrame();
  if(info.expression){
   if(!current)current={expression:info.expression,startedAfterMs:performance.now()-started,seen:new Map(),order:[],logicalIdle:true};
   if(current.expression!==info.expression)unexpected.push({previous:current.expression,next:info.expression});
   current.logicalIdle=current.logicalIdle&&info.state==='idle'&&info.transient===true;
   const key=info.row+':'+info.frame;
   if(key!==last){last=key;current.order.push(info.frame);current.seen.set(info.frame,cellProof(mascot,reference,info.row,info.frame));}
  }else if(current){
   cycles.push({...current,seen:[...current.seen.keys()].sort((a,b)=>a-b),proofs:[...current.seen.values()],returned:info.state==='idle'&&info.spriteState==='idle'&&info.row===0&&info.frame===0&&info.transient===false,returnProof:cellProof(mascot,reference,0,0)});current=null;last='';
  }
  if(cycles.length<sequence.length)await delay(20);
 }
 return {sequence,cycles,unexpected,elapsedMs:performance.now()-started,documentHidden:document.hidden};
}
async function idleExpressionTests(check,reference,mainMascot){
 const probes=[];
 const make=async(extra={})=>{const value=ThanhAnMascot.create({spriteUrl:mainMascot.getFrame().assetUrl,autoIdleExpressions:true,idleExpressionIntervalMs:1000,idleHopIntervalMs:60000,...extra});probes.push(value);await value.ready;return value;};
 try{
  const automatic=await make(),defaults=mainMascot.getIdleExpressions(),fast=automatic.getIdleExpressions();
  check('Idle expressions use an eighteen-second production interval and a bounded fast probe',defaults.enabled&&defaults.intervalMs===18000&&defaults.sequence.join(',')==='waiting,review,failed'&&fast.enabled&&fast.intervalMs===1000,JSON.stringify({production:defaults,probe:fast}));
  const autoProof=await quietCycleProof(automatic,reference,['waiting','review','failed']);
  const expected={waiting:{row:6,count:6},review:{row:8,count:6},failed:{row:5,count:8}};
  const complete=autoProof.cycles.length===3&&autoProof.unexpected.length===0&&autoProof.cycles.every((cycle,index)=>{const spec=expected[cycle.expression],frames=spec?Array.from({length:spec.count},(_,frame)=>frame).join(','):'';return cycle.expression===autoProof.sequence[index]&&spec&&cycle.logicalIdle&&cycle.seen.join(',')===frames&&cycle.order.join(',')===frames&&cycle.proofs.every(proof=>proof.row===spec.row&&proof.mismatches===0&&proof.alphaMismatches===0)&&cycle.returned&&cycle.returnProof.mismatches===0;});
  check('Automatic quiet-idle variations play three complete original rows once and return to idle',complete&&autoProof.cycles[0].startedAfterMs>=fast.intervalMs-2,JSON.stringify(autoProof));
  const failedCycle=autoProof.cycles.find(cycle=>cycle.expression==='failed'),spiral=failedCycle?.proofs.find(proof=>proof.frame===2),wideEyes=failedCycle?.proofs.find(proof=>proof.frame===4);
  check('Automatic wide-eye and spiral gestures remain the exact original failed source cells',spiral&&wideEyes&&spiral.row===5&&wideEyes.row===5&&spiral.mismatches===0&&wideEyes.mismatches===0&&spiral.alphaMismatches===0&&wideEyes.alphaMismatches===0&&failedCycle.returned,JSON.stringify({spiral,wideEyes,returned:failedCycle?.returned}));
  automatic.destroy();
  const [working,attention,paused,reduced,destroyed,optOut,hopping]=await Promise.all([make(),make({attentionDurationMs:30000}),make(),make(),make(),make({autoIdleExpressions:false}),make({idleHopIntervalMs:500})]);
  const reactions={working:working.react('review'),attention:attention.react('waiting'),paused:paused.react('review'),reduced:reduced.react('failed'),destroyed:destroyed.react('waiting')};
  await delay(250);
  const activeStarts=[working,attention,paused,reduced,destroyed].map(probe=>{const info=probe.getFrame();return {expression:info.expression,frame:info.frame,transient:info.transient,...cellProof(probe,reference,info.row,info.frame)};});
  working.setState('working');const workingRejects=working.react('failed')===false;
  const attentionArmed=attention.activateAttention(),attentionRejects=attention.react('failed')===false,attentionLook=attention.gaze(1,0);
  paused.setPaused(true);reduced.setReducedMotion(true);destroyed.destroy();
  const pausedHash=pixelHash(pixels(paused.element)),reducedHash=pixelHash(pixels(reduced.element)),destroyedHash=pixelHash(pixels(destroyed.element));
  const traces={working:[],attention:[],paused:[],reduced:[],destroyed:[],optOut:[],hopping:[]},subjects={working,attention,paused,reduced,destroyed,optOut,hopping},lastFrames={};
  const blockedStart=performance.now();
  while(performance.now()-blockedStart<2500){
   for(const [name,probe] of Object.entries(subjects)){
    const info=probe.getFrame(),key=[info.row,info.frame,info.expression,info.state].join(':');
    if(lastFrames[name]!==key){lastFrames[name]=key;traces[name].push({state:info.state,expression:info.expression,transient:info.transient,elapsedMs:performance.now()-blockedStart,...cellProof(probe,reference,info.row,info.frame)});}
    if(['paused','reduced','destroyed'].includes(name)&&pixelHash(pixels(probe.element))!==({paused:pausedHash,reduced:reducedHash,destroyed:destroyedHash})[name])traces[name].push({lateRedraw:true,elapsedMs:performance.now()-blockedStart});
   }
   await delay(20);
  }
  const original=trace=>trace.length>0&&trace.every(proof=>!proof.lateRedraw&&proof.mismatches===0&&proof.alphaMismatches===0);
  const idleOnly=trace=>original(trace)&&trace.every(proof=>proof.state==='idle'&&proof.row===0&&proof.expression===null&&proof.transient===false);
  const started=Object.values(reactions).every(Boolean)&&activeStarts.every(info=>info.expression&&info.transient&&info.frame>0&&info.mismatches===0);
  check('Working immediately preempts an idle gesture and never runs a queued expression',started&&workingRejects&&original(traces.working)&&traces.working.every(proof=>proof.state==='working'&&proof.row===7&&proof.expression===null&&proof.transient===false),JSON.stringify({reactions,activeStarts,trace:traces.working,observedMs:performance.now()-blockedStart}));
  check('Idle-expression opt-out preserves native idle without extra gestures',!optOut.getIdleExpressions().enabled&&idleOnly(traces.optOut),JSON.stringify(traces.optOut));
  check('Idle hopping cannot starve a due automatic quiet-idle expression',original(traces.hopping)&&traces.hopping.some(proof=>proof.row===4)&&traces.hopping.some(proof=>proof.expression==='waiting'&&proof.row===6),JSON.stringify(traces.hopping));
  check('Destroy cancels idle-expression callbacks and rejects later gesture activation',idleOnly(traces.destroyed)&&destroyed.react('failed')===false&&destroyed.activateAttention()===false&&destroyed.gaze(1,0)===false&&pixelHash(pixels(destroyed.element))===destroyedHash,JSON.stringify(traces.destroyed));
  const pauseCancelled=idleOnly(traces.paused)&&paused.react('failed')===false&&pixelHash(pixels(paused.element))===pausedHash;
  const reducedCancelled=idleOnly(traces.reduced)&&reduced.react('failed')===false&&pixelHash(pixels(reduced.element))===reducedHash;
  const attentionBlocked=attentionArmed&&attentionRejects&&attentionLook&&attention.getAttention().active&&original(traces.attention)&&traces.attention.every(proof=>proof.state==='idle'&&proof.row===9&&proof.frame===4&&proof.expression===null&&proof.transient===false);
  const resumeStarts={attention:performance.now()};attention.stopAttention();resumeStarts.paused=performance.now();paused.setPaused(false);resumeStarts.reduced=performance.now();reduced.setReducedMotion(false);
  const resumed={attention:null,paused:null,reduced:null},early=[],resumeSubjects={attention,paused,reduced},resumeStart=performance.now();
  while(performance.now()-resumeStart<1800&&Object.values(resumed).some(value=>value===null)){
   for(const [name,probe] of Object.entries(resumeSubjects))if(resumed[name]===null){const info=probe.getFrame(),elapsedMs=performance.now()-resumeStarts[name];if(info.expression){resumed[name]={expression:info.expression,elapsedMs,...cellProof(probe,reference,info.row,info.frame)};if(elapsedMs<probe.getIdleExpressions().intervalMs-2)early.push(name);}}
   if(Object.values(resumed).some(value=>value===null))await delay(20);
  }
  const restarts=name=>resumed[name]&&resumed[name].elapsedMs>=1000-2&&resumed[name].mismatches===0&&!early.includes(name);
  check('Armed attention cancels idle gestures and restarts a full quiet interval afterward',attentionBlocked&&restarts('attention'),JSON.stringify({blocked:traces.attention,resumed:resumed.attention,early}));
  check('Pausing cancels idle gestures and resumes only after a fresh quiet interval',pauseCancelled&&restarts('paused'),JSON.stringify({blocked:traces.paused,resumed:resumed.paused,early}));
  check('Reduced motion cancels idle gestures and resumes only after a fresh quiet interval',reducedCancelled&&restarts('reduced'),JSON.stringify({blocked:traces.reduced,resumed:resumed.reduced,early}));
 }finally{for(const probe of probes)probe.destroy();}
}
let instance=null,clickCount=0;
byId('underlay').addEventListener('click',()=>{byId('underlay-count').textContent=++clickCount+' lượt click trang';});
async function tests(){
 run.disabled=true;list.replaceChildren();summary.textContent='Đang kiểm tra…';
 if(instance){instance.destroy();instance=null;}
 const results=[];const check=(name,condition,details='')=>{const pass=!!condition;const r={name,pass,details};results.push(r);const li=document.createElement('li');li.className=pass?'pass':'fail';li.textContent=(pass?'PASS · ':'FAIL · ')+name+(details?' — '+details:'');list.appendChild(li);};
 const options={dataUrl:'../widget/data.json',stylesheetUrl:'../widget/widget.css',activityIdleMs:350};
 const startedAt=new Date().toISOString();
 const storageBefore={local:JSON.stringify({...localStorage}),session:JSON.stringify({...sessionStorage}),cookie:document.cookie};
 try{
  const [a,b]=await Promise.all([ThanhAnChat.mount(options),ThanhAnChat.mount(options)]);instance=a;
  const s=a.shadow,host=a.host,input=s.querySelector('.ta-input'),panel=s.querySelector('.ta-panel'),launcher=s.querySelector('.ta-launcher'),log=s.querySelector('.ta-log'),content=s.querySelector('.ta-content'),aux=s.querySelector('.ta-aux-view'),auxBody=s.querySelector('.ta-aux-body');
  const mascot=a.launcherMascot;await Promise.all([mascot.ready,a.avatarMascot.ready]);
  check('Concurrent mount creates exactly one host',a===b&&document.querySelectorAll('#ta-mam-chat-host').length===1);
  check('Widget style is isolated in Shadow DOM',host.shadowRoot===s&&s.querySelector('link[rel=stylesheet]')!==null);
  check('Dataset and nested records are frozen',Object.isFrozen(a.data)&&Object.isFrozen(a.data.products)&&Object.isFrozen(a.data.products[0]));
  check('Launcher starts closed with aria-expanded false',panel.hidden&&launcher.getAttribute('aria-expanded')==='false');
  check('Dialog is modeless and labelled',panel.getAttribute('aria-modal')==='false'&&s.getElementById(panel.getAttribute('aria-labelledby'))!==null);
  check('Input has accessible label, char limit, and no autocomplete',s.querySelector('label').htmlFor===input.id&&input.maxLength===1000&&input.autocomplete==='off');
  const reference=await originalSprite(mascot.getFrame().assetUrl),nativeCanvas=mascot.element,reducedSystem=matchMedia('(prefers-reduced-motion: reduce)').matches;
  check('Original Seedy v10 asset has the independently pinned lossless source SHA and dimensions',reference.sha===SPRITE_SHA&&reference.width===1536&&reference.height===2288,JSON.stringify({sha256:reference.sha,width:reference.width,height:reference.height}));
  const nativeStyle=getComputedStyle(nativeCanvas),nativeBox=nativeCanvas.getBoundingClientRect();
  check('Mascot uses one native-sized transparent canvas without manual artwork or visual filters',nativeCanvas.tagName==='CANVAS'&&nativeCanvas.width===192&&nativeCanvas.height===208&&mascot.getFrame().row===0&&nativeCanvas.childElementCount===0&&nativeStyle.filter==='none'&&Number(nativeStyle.opacity)===1&&nativeStyle.animationName==='none'&&nativeStyle.transform==='none'&&nativeStyle.imageRendering==='pixelated'&&Math.abs(nativeBox.height/nativeBox.width-208/192)<.001&&getComputedStyle(nativeCanvas,'::before').content==='none'&&getComputedStyle(nativeCanvas,'::after').content==='none',JSON.stringify({width:nativeCanvas.width,height:nativeCanvas.height,displayWidth:nativeBox.width,displayHeight:nativeBox.height,displayAspect:nativeBox.height/nativeBox.width,originalAspect:208/192,row:mascot.getFrame().row,imageRendering:nativeStyle.imageRendering}));
  mascot.setPaused(true);const stateProofs=[];
  for(const [state,row,spriteState] of [['idle',0,'idle'],['greeting',3,'waving'],['working',7,'running']]){mascot.setState(state);const info=mascot.getFrame();stateProofs.push({state,row:spriteState,...cellProof(mascot,reference,row,0),mapped:info.row===row&&info.frame===0&&info.state===state&&info.spriteState===spriteState});}
  check('Idle, greeting and working map to exact unmodified original source frame-zero cells',stateProofs.every(proof=>proof.mapped&&proof.mismatches===0&&proof.alphaMismatches===0),JSON.stringify(stateProofs));
  check('State transitions preserve original alpha and clear transparent padding without frame ghosts',stateProofs.every(proof=>proof.transparent>1000&&proof.ghosts===0&&proof.alphaMismatches===0),JSON.stringify(stateProofs.map(({state,transparent,ghosts,alphaMismatches})=>({state,transparent,ghosts,alphaMismatches}))));
  const nativeFirstFrames=[];for(const [state,row,count] of NATIVE_STATES){mascot.setState(state);const info=mascot.getFrame();nativeFirstFrames.push({state,mapped:info.ready&&info.width===192&&info.height===208&&info.state===state&&info.row===row&&info.frame===0&&info.frameCount===count,...cellProof(mascot,reference,row,0)});}
  check('All nine original preview states map to their exact source rows and first cells',nativeFirstFrames.every(proof=>proof.mapped&&proof.mismatches===0&&proof.alphaMismatches===0),JSON.stringify(nativeFirstFrames));
  check('Original stock extra idle column remains in the immutable sheet and is excluded from runtime idle playback',reference.sha===SPRITE_SHA&&ThanhAnMascot.sprite.states.idle.durations.length===6&&ThanhAnMascot.sprite.lookDirections===16,JSON.stringify({originalExtraCellHash:pixelHash(reference.cell(0,6)),runtimeIdleFrames:ThanhAnMascot.sprite.states.idle.durations.length}));
  mascot.setState('idle');mascot.setPaused(false);
  if(!reducedSystem){
   const playback=[];for(const [state,row,count] of NATIVE_STATES)playback.push(await playbackProof(mascot,reference,state,row,count));
   check('All nine native animations display all 57 original frames and complete a full cycle',playback.every(result=>result.cycled&&result.seen.length===result.count&&result.unexpected.length===0&&result.proofs.every(proof=>proof.mismatches===0&&proof.alphaMismatches===0)),JSON.stringify(playback));
   const originalSpiral=playback.find(result=>result.state==='failed').proofs.find(proof=>proof.frame===2);
   check('Spiral-eye preview is the exact original failed frame rather than fabricated face artwork',originalSpiral&&originalSpiral.row===5&&originalSpiral.mismatches===0&&originalSpiral.alphaMismatches===0,JSON.stringify(originalSpiral));
   mascot.setState('idle');mascot.setPaused(false);const jumped=mascot.jump(),jumpSeen=new Map(),jumpStarted=performance.now(),jumpInvalid=[];
   while(performance.now()-jumpStarted<2000&&jumpSeen.size<5){const info=mascot.getFrame();if(info.row===4&&!jumpSeen.has(info.frame)){if(info.frame<0||info.frame>4)jumpInvalid.push(info.frame);jumpSeen.set(info.frame,cellProof(mascot,reference,4,info.frame));}if(jumpSeen.size<5)await delay(20);}
   check('Idle jump plays all five original jump cells without added geometry',jumped&&[...jumpSeen.keys()].sort((a,b)=>a-b).join(',')==='0,1,2,3,4'&&jumpInvalid.length===0&&[...jumpSeen.values()].every(proof=>proof.mismatches===0&&proof.alphaMismatches===0),JSON.stringify([...jumpSeen.values()]));
   await delay(260);check('Native jump returns to original idle playback',mascot.getState()==='idle'&&mascot.getFrame().row===0&&cellProof(mascot,reference,0,mascot.getFrame().frame).mismatches===0);
   mascot.setState('working');await delay(150);mascot.setPaused(true);const pausedInfo=mascot.getFrame(),pausedHash=pixelHash(pixels(nativeCanvas));await delay(500);
   check('Pausing freezes the actual native animation frame and original pixels',mascot.getFrame().frame===pausedInfo.frame&&pixelHash(pixels(nativeCanvas))===pausedHash&&nativeCanvas.dataset.paused==='true');
   mascot.setState('idle');mascot.setPaused(false);const nativeBlink=mascot.blink(),blinkProof=cellProof(mascot,reference,0,1);await delay(180);
   check('Blink uses the original idle sprite cell and restores original frame zero',nativeBlink&&blinkProof.mismatches===0&&mascot.getFrame().row===0&&mascot.getFrame().frame===0&&cellProof(mascot,reference,0,0).mismatches===0);
   mascot.setState('idle');mascot.setPaused(false);const looks=[];
   for(let index=0;index<16;index++){const angle=index*Math.PI/8,accepted=mascot.gaze(Math.sin(angle),-Math.cos(angle)),info=mascot.getFrame(),pose=mascot.getPose();looks.push({index,accepted,mapped:info.ready&&info.width===192&&info.height===208&&info.frameCount===8&&info.row===9+Math.floor(index/8)&&info.frame===index%8&&info.directionIndex===index&&info.angleDegrees===index*22.5&&pose.supported&&pose.active&&pose.directionIndex===index&&pose.angleDegrees===index*22.5&&pose.row===info.row&&pose.frame===info.frame,...cellProof(mascot,reference,9+Math.floor(index/8),index%8)});}
   check('All sixteen native look directions use the exact original clockwise source cells',looks.every(proof=>proof.accepted&&proof.mapped&&proof.mismatches===0&&proof.alphaMismatches===0),JSON.stringify(looks));
   mascot.gaze(100,-100);const scaled=mascot.getFrame();mascot.gaze(1,-1);const small=mascot.getFrame();
   check('Native look selection is scale independent and neutral restores original idle frame zero',scaled.directionIndex===small.directionIndex&&scaled.directionIndex===2&&mascot.gaze(0,0)&&mascot.getFrame().row===0&&mascot.getFrame().frame===0&&!mascot.getPose().active&&mascot.getPose().directionIndex===null&&cellProof(mascot,reference,0,0).mismatches===0);
   const stateGaze=[];for(const [state,row] of [...NATIVE_STATES.filter(([state])=>state!=='idle'),['working',7],['greeting',3]]){mascot.setState(state);const before=pixelHash(pixels(nativeCanvas)),accepted=mascot.gaze(1,0);stateGaze.push({state,rejected:accepted===false&&!mascot.getPose().active&&mascot.getPose().directionIndex===null,row:mascot.getFrame().row,unchanged:pixelHash(pixels(nativeCanvas))===before,proof:cellProof(mascot,reference,row,0)});}
   check('Every non-idle state including working blocks gaze and preserves original artwork',stateGaze.every(result=>result.rejected&&result.unchanged&&result.proof.mismatches===0),JSON.stringify(stateGaze));
   mascot.setState('idle');mascot.gaze(1,0);mascot.setPaused(true);
   check('Pausing a native look restores original idle and rejects further gaze',mascot.getFrame().row===0&&mascot.getFrame().frame===0&&!mascot.getPose().active&&mascot.getPose().directionIndex===null&&mascot.gaze(-1,0)===false&&cellProof(mascot,reference,0,0).mismatches===0);
   mascot.setPaused(false);mascot.gaze(1,0);window.dispatchEvent(new Event('blur'));
   check('Window blur clears native look and attention even for direct gaze',!mascot.getAttention().active&&mascot.getFrame().row===0&&mascot.getFrame().frame===0&&!mascot.getPose().active&&mascot.getPose().directionIndex===null&&cellProof(mascot,reference,0,0).mismatches===0);
  }
  if(!reducedSystem)await idleExpressionTests(check,reference,mascot);
  else check('Automatic idle expressions respect the system reduced-motion preference',mascot.getIdleExpressions().active===null&&mascot.react('failed')===false);
  mascot.setState('idle');mascot.setPaused(false);mascot.setReducedMotion(true);mascot.setState('working');const reducedProof=cellProof(mascot,reference,7,0),reducedHash=pixelHash(pixels(nativeCanvas));await delay(350);
  check('Reduced motion freezes the original state frame without synthetic blink, jump or gaze',reducedProof.mismatches===0&&mascot.getFrame().row===7&&mascot.getFrame().frame===0&&pixelHash(pixels(nativeCanvas))===reducedHash&&mascot.gaze(1,1)===false&&mascot.jump()===false&&mascot.blink()===false&&mascot.activateAttention()===false&&getComputedStyle(nativeCanvas).animationName==='none');
  const reducedStates=[];for(const [state,row] of NATIVE_STATES){mascot.setState(state);reducedStates.push({state,frame:mascot.getFrame().frame,...cellProof(mascot,reference,row,0)});}
  check('Reduced motion preserves all nine original state first frames exactly',reducedStates.every(proof=>proof.frame===0&&proof.mismatches===0&&proof.alphaMismatches===0),JSON.stringify(reducedStates));
  mascot.setState('idle');check('Reduced motion returns to the exact original idle cell',cellProof(mascot,reference,0,0).mismatches===0&&mascot.getFrame().row===0&&mascot.getFrame().frame===0);
  mascot.setReducedMotion(false);
  if(!reducedSystem&&matchMedia('(hover: hover) and (pointer: fine)').matches){
   const bb=nativeCanvas.getBoundingClientRect(),pointer=(dx,dy,type='mouse')=>window.dispatchEvent(new PointerEvent('pointermove',{clientX:bb.x+bb.width/2+dx,clientY:bb.y+bb.height*.59+dy,pointerType:type}));
   pointer(120,0);await pointerFrame();check('Global pointer cannot select a look before hover or tap activates attention',!mascot.getAttention().active&&mascot.getFrame().row<9);
   nativeCanvas.dispatchEvent(new PointerEvent('pointerenter',{pointerType:'mouse'}));const cardinal=[];
   for(const [dx,dy,index] of [[0,-120,0],[120,0,4],[0,120,8],[-120,0,12]]){pointer(dx,dy);await pointerFrame();const info=mascot.getFrame();cardinal.push({index,actual:info.directionIndex,...cellProof(mascot,reference,9+Math.floor(index/8),index%8)});}
   check('Armed pointer cardinal directions display the four exact original native look cells',mascot.getAttention().active&&cardinal.every(proof=>proof.index===proof.actual&&proof.mismatches===0),JSON.stringify(cardinal));
   const beforeTouch=pixelHash(pixels(nativeCanvas));pointer(120,120,'touch');check('Touch motion does not change the native mouse-look cell',pixelHash(pixels(nativeCanvas))===beforeTouch&&mascot.getFrame().directionIndex===12);
   pointer(-1000,-1000);await pointerFrame();check('Far pointer returns to the original idle frame',mascot.getFrame().row===0&&mascot.getFrame().frame===0&&cellProof(mascot,reference,0,0).mismatches===0);
   nativeCanvas.dispatchEvent(new PointerEvent('pointerenter',{pointerType:'mouse'}));const attentionStarted=performance.now(),attentionDeadline=attentionStarted+mascot.getAttention().durationMs+160;
   while(performance.now()<attentionDeadline){pointer(120,0);await delay(100);}
   pointer(120,0);await pointerFrame();check('Attention expires after six seconds despite continuing global pointer motion',!mascot.getAttention().active&&mascot.getFrame().row<9,JSON.stringify({durationMs:mascot.getAttention().durationMs,elapsedMs:performance.now()-attentionStarted}));
   nativeCanvas.dispatchEvent(new PointerEvent('pointerdown',{pointerType:'touch',bubbles:true}));
   check('A mascot tap arms attention and plays the original native greeting cells',mascot.getAttention().active&&mascot.getState()==='greeting'&&mascot.getFrame().row===3&&cellProof(mascot,reference,3,mascot.getFrame().frame).mismatches===0);
   await delay(980);check('Brief native tap greeting returns to idle without extending the attention timer',mascot.getState()==='idle'&&mascot.getFrame().row===0&&mascot.getAttention().active);
   window.dispatchEvent(new Event('blur'));check('Blur ends armed native attention and restores original idle',!mascot.getAttention().active&&mascot.getFrame().row===0);
  }else check('Fine-pointer native tracking correctly follows device and reduced-motion preferences',nativeCanvas.dataset.reducedMotion===String(reducedSystem));
  launcher.click();check('Hidden launcher pauses while visible avatar resumes',mascot.element.dataset.paused==='true'&&a.avatarMascot.element.dataset.paused==='false');check('Launcher opens and focuses input',!panel.hidden&&s.activeElement===input&&launcher.getAttribute('aria-expanded')==='true');
  const greetingBubble=log.querySelector('.ta-message-bubble'),clearControl=s.querySelector('.ta-clear');
  const readableSizes={message:parseFloat(getComputedStyle(greetingBubble).fontSize),input:parseFloat(getComputedStyle(input).fontSize),clear:parseFloat(getComputedStyle(clearControl).fontSize)};
  check('Customer message and input fonts are readable with large quick and header reset controls',readableSizes.message>=16&&readableSizes.input>=16&&readableSizes.clear>=14&&clearControl.getBoundingClientRect().height>=44&&[...s.querySelectorAll('.ta-quick button')].every(button=>button.getBoundingClientRect().height>=44),JSON.stringify(readableSizes));
  const readableContrast={message:textContrast(greetingBubble),input:textContrast(input),clear:textContrast(clearControl)};
  check('Rendered customer message, input and clear colors meet a 4.5 to 1 contrast target',Object.values(readableContrast).every(value=>value>=4.5),JSON.stringify(readableContrast));
  const chatScroller=oneScroller(panel,log,aux,log);
  check('Conversation has one visible vertical scroller and reset stays in the header',content&&getComputedStyle(content).overflowY==='hidden'&&aux&&aux.hidden&&!log.hidden&&chatScroller.pass&&s.querySelector('.ta-header').contains(clearControl)&&!s.querySelector('.ta-ai-options'),JSON.stringify(chatScroller.details));
  const panelWrap=s.querySelector('.ta-panel-wrap'),outerAvatar=s.querySelector('.ta-avatar'),avatarBox=a.avatarMascot.element.getBoundingClientRect(),openedPanelBox=panel.getBoundingClientRect();
  const compactAvatarLayout=matchMedia('(max-width: 560px)').matches;
  const avatarApart=compactAvatarLayout?avatarBox.bottom<=openedPanelBox.top+.5:avatarBox.right<=openedPanelBox.left+.5;
  const avatarUnion={left:Math.min(avatarBox.left,openedPanelBox.left),right:Math.max(avatarBox.right,openedPanelBox.right),top:Math.min(avatarBox.top,openedPanelBox.top),bottom:Math.max(avatarBox.bottom,openedPanelBox.bottom)};
  check('Open mascot stays outside the dialog header at native 96px size and fits the viewport',panel.parentElement===panelWrap&&outerAvatar.parentElement===panelWrap&&outerAvatar.contains(a.avatarMascot.element)&&!panel.contains(outerAvatar)&&s.querySelector('.ta-header').querySelector('.ta-mascot')===null&&Math.abs(nativeBox.width-96)<.5&&Math.abs(avatarBox.width-96)<.5&&Math.abs(avatarBox.height/avatarBox.width-208/192)<.001&&avatarApart&&avatarUnion.left>=0&&avatarUnion.top>=0&&avatarUnion.right<=document.documentElement.clientWidth+.5&&avatarUnion.bottom<=document.documentElement.clientHeight+.5,JSON.stringify({compact:compactAvatarLayout,avatar:{left:avatarBox.left,right:avatarBox.right,top:avatarBox.top,bottom:avatarBox.bottom,width:avatarBox.width,height:avatarBox.height},panel:{left:openedPanelBox.left,right:openedPanelBox.right,top:openedPanelBox.top,bottom:openedPanelBox.bottom},union:avatarUnion}));
  input.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,composed:true,cancelable:true}));check('Escape closes and restores focus to launcher',panel.hidden&&s.activeElement===launcher);
  launcher.click();s.querySelector('.ta-close').click();check('Close button restores launcher focus',panel.hidden&&s.activeElement===launcher);
  a.open();const box=panel.getBoundingClientRect();
  check('Panel fits current viewport',box.left>=0&&box.top>=0&&box.right<=document.documentElement.clientWidth+.5&&box.bottom<=document.documentElement.clientHeight+.5,JSON.stringify({viewport:{width:innerWidth,height:innerHeight,clientWidth:document.documentElement.clientWidth,clientHeight:document.documentElement.clientHeight},panel:{left:box.left,top:box.top,right:box.right,bottom:box.bottom,width:box.width,height:box.height}}));
  check('Page remains scrollable with no modal backdrop',getComputedStyle(document.body).overflow!=='hidden'&&getComputedStyle(host).pointerEvents==='none'&&s.querySelectorAll('.backdrop').length===0);
  input.value='<img src=x onerror=alert(1)>';s.querySelector('form').requestSubmit();await frame();await delay(20);
  check('HTML/XSS input is literal text, never parsed',log.querySelector('.ta-message-user .ta-message-bubble').textContent==='<img src=x onerror=alert(1)>'&&log.querySelectorAll('img,script').length===0);
  check('Submission clears input and keeps keyboard focus',input.value===''&&s.activeElement===input);
  const row=a.data.products.flatMap(p=>p.priceFacts||[])[0];await a.send(row.lookupQuery);
  const exactRowResult=ThanhAnFAQ.answer(row.lookupQuery,a.data);
  const exactTotal=log.lastElementChild.querySelector('.ta-quote-total');
  check('Exact source row renders a compact readable total with verified unit basis and safe optional source',compactPrice(log.lastElementChild,row.quantity,row.quantityUnit,exactRowResult.quote.totalVnd)&&exactTotal&&Number(getComputedStyle(exactTotal).fontWeight)>=600&&textContrast(exactTotal)>=4.5&&exactRowResult.quote.unitPriceVnd===row.priceVnd&&log.lastElementChild.querySelector('.ta-source').href===row.sourceUrl&&log.lastElementChild.querySelector('.ta-source').rel.includes('noopener')&&log.lastElementChild.querySelector('.ta-source').closest('details')?.open===false);
  const consultControl=s.querySelector('.ta-quick button[aria-label="Tư vấn qua Zalo"]'),pageBeforeConsult=location.href,openNormally=window.open;
  const externalBeforeConsult=performance.getEntriesByType('resource').filter(resource=>new URL(resource.name,location.href).origin!==location.origin).length;
  let automaticContactOpens=0;
  try{window.open=()=>{automaticContactOpens++;return null;};consultControl?.focus();consultControl?.click();await frame();await delay(20);}finally{window.open=openNormally;}
  const contacts=Array.from(auxBody.querySelectorAll('.ta-contact a')),consultScroller=oneScroller(panel,log,aux,aux);
  check('Visible Tư vấn opens one auxiliary view with three verified advisers and six chosen links',consultControl&&consultControl.textContent==='Tư vấn'&&consultControl.getAttribute('aria-label')==='Tư vấn qua Zalo'&&!aux.hidden&&log.hidden&&aux.dataset.view==='contacts'&&s.querySelector('.ta-aux-title').textContent==='Tư vấn qua Zalo'&&auxBody.querySelector('.ta-contact-intro').textContent.includes('chưa có đủ')&&auxBody.querySelectorAll('.ta-contact').length===3&&log.querySelectorAll('.ta-contact').length===0&&contacts.length===6&&consultScroller.pass&&a.data.contacts.every(c=>contacts.some(link=>link.getAttribute('href')===c.zalo)&&contacts.some(link=>link.getAttribute('href')==='tel:'+c.phone)),JSON.stringify(consultScroller.details));
  const consultMessageCount=log.childElementCount,contactLinksClean=contacts.every(link=>!link.getAttribute('href').includes('?')&&!link.getAttribute('href').includes('text='))&&contacts.filter(link=>link.classList.contains('ta-zalo')).every(link=>link.target==='_blank'&&link.rel.includes('noopener')&&link.referrerPolicy==='no-referrer');
  const noAutomaticContactNavigation=automaticContactOpens===0&&location.href===pageBeforeConsult&&performance.getEntriesByType('resource').filter(resource=>new URL(resource.name,location.href).origin!==location.origin).length===externalBeforeConsult;
  s.querySelector('.ta-view-back').click();
  check('Consultation links stay clean and Back restores the trigger without automatic external navigation',contactLinksClean&&noAutomaticContactNavigation&&aux.hidden&&!log.hidden&&s.activeElement===consultControl&&log.childElementCount===consultMessageCount&&oneScroller(panel,log,aux,log).pass);
  const lookup=a.send('Giờ làm việc');await Promise.resolve();
  check('Immediate local lookup uses the working pose without fabricated loading status or dots',a.avatarMascot.getState()==='working'&&host.dataset.mascotState==='working'&&!s.querySelector('.ta-subtitle').textContent.includes('Mầm đang tìm giúp bạn')&&log.querySelector('.ta-message-typing,.ta-typing-dots')===null&&ThanhAnFAQ.normalize(log.lastElementChild.querySelector('.ta-message-bubble').textContent).includes(ThanhAnFAQ.normalize(a.data.faq.hours)));
  await lookup;check('Completed lookup ends loading immediately while the working pose lingers',host.dataset.activity==='idle'&&a.avatarMascot.getState()==='working'&&host.dataset.mascotState==='working'&&!s.querySelector('.ta-subtitle').textContent.includes('Mầm đang tìm giúp bạn'));
  const faqSourceDetails=log.lastElementChild.querySelector('.ta-source-details');
  check('Ordinary FAQ sources stay inside a collapsed optional source disclosure',faqSourceDetails&&faqSourceDetails.tagName==='DETAILS'&&!faqSourceDetails.open&&faqSourceDetails.querySelector('summary')&&faqSourceDetails.querySelector('.ta-source').href===a.data.faq.sourceUrl);
  await delay(420);check('Inactivity returns the working mascot to standing',host.dataset.activity==='idle'&&a.avatarMascot.getState()==='idle'&&host.dataset.mascotState==='idle');
  input.value='Catalogue';input.dispatchEvent(new Event('input',{bubbles:true}));
  check('Typing a question starts native working without a loading claim',host.dataset.activity==='idle'&&a.avatarMascot.getState()==='working'&&!s.querySelector('.ta-subtitle').textContent.includes('Mầm đang tìm giúp bạn'));
  await delay(250);const workingFrameBefore=a.avatarMascot.getFrame(),workingPixelsBefore=pixelHash(pixels(a.avatarMascot.element));input.value+=' A4';input.dispatchEvent(new Event('input',{bubbles:true}));
  check('Further typing preserves the progressing native working frame instead of restarting it',a.avatarMascot.getFrame().row===7&&a.avatarMascot.getFrame().frame===workingFrameBefore.frame&&pixelHash(pixels(a.avatarMascot.element))===workingPixelsBefore);
  await delay(200);
  check('Further typing refreshes the inactivity window',a.avatarMascot.getState()==='working');
  input.value='';await delay(200);check('Typing stops at the refreshed inactivity deadline',a.avatarMascot.getState()==='idle'&&host.dataset.mascotState==='idle');
  const cancelled=a.send('Catalogue A4 16 trang 500 cuốn');await Promise.resolve();s.querySelector('.ta-clear').click();await cancelled;
  check('Clear during local lookup cancels pending conversation work',log.childElementCount===1&&!log.textContent.includes('15.000'));
  s.querySelector('.ta-clear').click();check('Clear resets session to one greeting',log.childElementCount===1&&log.querySelectorAll('.ta-message-user').length===0&&s.activeElement===input);
  const last=()=>log.lastElementChild.textContent;
  await a.send('cattalouge a4 bìa C250 ruột C150 giá 16 trang');check('Real typo request retains catalogue, A4 and 16 pages',/bao nhiêu cuốn/.test(last())&&!/ấn phẩm nào/.test(last()));
  await a.send('500');check('Bare quantity reply returns a two-line catalogue total and preserves the hidden per-book basis',compactPrice(log.lastElementChild,500,'cuốn',7500000,['A4','16 trang','C250','C150'])&&log.lastElementChild.querySelector('.ta-quote-details').textContent.includes('15.000'));
  await frame();const quotedBubble=log.lastElementChild.querySelector('.ta-message-bubble').getBoundingClientRect(),logBox=log.getBoundingClientRect();check('Long price reply starts visibly inside the chat viewport',quotedBubble.top>=logBox.top-1&&quotedBubble.top<logBox.bottom-40);
  await a.send('1000 cuốn');check('Quantity change retains catalogue page count in its compact total',compactPrice(log.lastElementChild,1000,'cuốn',9000000,['A4','16 trang'])&&log.lastElementChild.querySelector('.ta-quote-details').textContent.includes('9.000'));
  await a.send('giá card in nhanh kỹ thuật số');await a.send('C300');await a.send('5 hộp');check('Product switch resets catalogue context and quotes the compact digital C300 total',compactPrice(log.lastElementChild,5,'hộp',400000,['C300'])&&log.lastElementChild.querySelector('.ta-quote-details').textContent.includes('80.000')&&!last().includes('16 trang'));
  s.querySelector('.ta-clear').click();await a.send('catalogue a5 200 cuốn');
  check('A5 200 preserves actual size and never substitutes an A4 price or duplicate handoff',last().includes('A5')&&last().includes('200')&&!last().includes('22.000')&&!last().includes('5.800')&&log.lastElementChild.querySelector('.ta-message-bubble').textContent.includes('Zalo')&&log.lastElementChild.querySelector('.ta-handoff')===null);
  s.querySelector('.ta-clear').click();await a.send('catalogue A4 toàn bộ C150 16 trang 500 cuốn');
  check('Missing all-C150 variant shows a compact total and retains its exact optional source',compactPrice(log.lastElementChild,500,'cuốn',6500000,['A4','16 trang','C150'])&&log.lastElementChild.querySelector('.ta-quote-details').textContent.includes('13.000')&&log.lastElementChild.querySelector('.ta-source').href.includes('invinhphat.com'));
  check('Supplemental details preserve the reference label and source without adding branding to the compact bubble',last().includes('Giá tham khảo')&&!log.lastElementChild.querySelector('.ta-message-bubble').textContent.includes('Nguồn')&&!/\bV[ĩi]nh[\s-]*Ph[áa]t\b|invinhphat\.com/iu.test(log.lastElementChild.textContent)&&log.lastElementChild.querySelector('.ta-source').href===a.data.products.find(product=>product.id==='catalogue').priceFacts.find(fact=>fact.id==='catalogue-a4-all-c150-16-500').sourceUrl);
  s.querySelector('.ta-clear').click();await a.send('500');check('Clear also forgets product and pending slots',!last().includes('₫/cuốn')&&!last().includes('₫/hộp'));
  s.querySelector('.ta-clear').click();await a.send('Xem giá');
  const quoteChoices=log.lastElementChild.querySelector('.ta-quote-products');
  await a.send('Xem bảng giá');
  let menu=auxBody.querySelector('.ta-price-menu');
  check('Generic price asks for a product and explicit full-table request opens source categories',quoteChoices&&quoteChoices.querySelectorAll('.ta-chip').length===13&&quoteChoices.querySelectorAll('.ta-price-menu,.ta-price-table').length===0&&menu&&menu.dataset.screen==='categories'&&menu.querySelector('[data-category-id="catalogue"]')&&menu.querySelectorAll('.ta-price-category').length>=10&&menu.querySelectorAll('.ta-price-table').length===0);
  const priceScroller=oneScroller(panel,log,aux,aux),chatBlocksBeforeBack=log.childElementCount;
  check('Price categories use one auxiliary vertical scroller while the conversation is hidden',!aux.hidden&&log.hidden&&menu.parentElement===auxBody&&priceScroller.pass&&getComputedStyle(content).overflowY==='hidden',JSON.stringify(priceScroller.details));
  s.querySelector('.ta-view-back').click();
  const backScroller=oneScroller(panel,log,aux,log);
  check('Auxiliary Back restores the conversation and input focus without losing messages',!panel.hidden&&aux.hidden&&!log.hidden&&s.activeElement===input&&log.childElementCount===chatBlocksBeforeBack&&backScroller.pass,JSON.stringify(backScroller.details));
  await a.send('Xem bảng giá');menu=auxBody.querySelector('.ta-price-menu');
  s.querySelector('.ta-view-back').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,composed:true,cancelable:true}));
  const escapeBack=!panel.hidden&&aux.hidden&&!log.hidden&&s.activeElement===input;
  input.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,composed:true,cancelable:true}));
  const escapeClosed=panel.hidden&&s.activeElement===launcher&&launcher.getAttribute('aria-expanded')==='false';
  a.open();await a.send('Xem bảng giá');const closeFromAuxiliary=!aux.hidden&&log.hidden;s.querySelector('.ta-close').click();
  check('Escape returns from auxiliary before closing while Close dismisses the whole dialog',escapeBack&&escapeClosed&&closeFromAuxiliary&&panel.hidden&&aux.hidden&&!log.hidden&&s.activeElement===launcher&&launcher.getAttribute('aria-expanded')==='false');
  a.open();await a.send('Xem bảng giá');menu=auxBody.querySelector('.ta-price-menu');
  menu.querySelector('[data-category-id="catalogue"]').click();
  check('Category selection exposes separate source and material variants',menu.dataset.screen==='variants'&&menu.querySelector('[data-variant-id="table-catalogue-a4-12-200"]')&&menu.querySelector('[data-variant-id="table-catalogue-a4-all-c150-12-200"]')&&menu.querySelector('[data-variant-id="table-catalogue-a4-cover-c250-offset-12-200"]'));
  menu.querySelector('[data-variant-id="table-catalogue-a4-12-200"]').click();
  const exactTable=(facts)=>{const rows=[...menu.querySelectorAll('.ta-price-table tbody tr')];return rows.length===facts.length&&facts.every(fact=>{const row=rows.find(row=>row.dataset.factId===fact.id),conditions=[...menu.querySelectorAll('.ta-price-row-condition')].find(section=>section.dataset.factId===fact.id);return row&&row.querySelector('.ta-price-amount').textContent===ThanhAnFAQ.money(fact.priceVnd)&&row.querySelector('.ta-price-quantity').dataset.quantity===String(fact.quantity)&&(!fact.specs.pages||row.querySelector('th').textContent===String(fact.specs.pages))&&conditions&&fact.conditions.every(condition=>[...conditions.querySelectorAll('li')].some(li=>li.textContent===ThanhAnPriceMenu.displayText(condition)));});};
  const taCatalogue=a.data.products.find(product=>product.id==='catalogue').priceFacts.filter(fact=>fact.provider==='thanh-an');
  check('Catalogue menu shows all 21 literal Thanh An rows and their complete conditions',exactTable(taCatalogue)&&[...menu.querySelectorAll('.ta-price-source')].some(link=>link.href===taCatalogue[0].sourceUrl)&&menu.querySelector('.ta-price-date').textContent.includes('2026')&&menu.querySelector('[data-fact-id="catalogue-a4-16-500"] .ta-price-amount').textContent===ThanhAnFAQ.money(15000));
  const menuHeadingBox=menu.querySelector('.ta-price-title').getBoundingClientRect(),menuFirstRow=menu.querySelector('.ta-price-table tbody tr'),menuRowBox=menuFirstRow.getBoundingClientRect(),auxBox=aux.getBoundingClientRect(),auxHeadBox=s.querySelector('.ta-aux-head').getBoundingClientRect(),menuViewport={top:Math.max(auxBox.top,auxHeadBox.bottom),bottom:auxBox.bottom},menuInitialScroll=aux.scrollTop;
  const rowNeedsScroll=menuRowBox.top<menuViewport.top||menuRowBox.bottom>menuViewport.bottom;
  if(rowNeedsScroll)aux.scrollTo({top:aux.scrollTop+menuRowBox.top-menuViewport.top-4,behavior:'instant'});
  const readableRow=menuFirstRow.getBoundingClientRect();
  check('Selecting a table shows its heading and lets the first row be read in the auxiliary scroller',menuHeadingBox.top>=menuViewport.top-1&&menuHeadingBox.bottom<=menuViewport.bottom+1&&readableRow.top>=menuViewport.top-1&&readableRow.bottom<=menuViewport.bottom+1&&oneScroller(panel,log,aux,aux).pass,JSON.stringify({headingInitially:{top:menuHeadingBox.top,bottom:menuHeadingBox.bottom},firstRowInitially:{top:menuRowBox.top,bottom:menuRowBox.bottom},firstRowReadable:{top:readableRow.top,bottom:readableRow.bottom},scrollUsed:rowNeedsScroll,auxiliary:menuViewport}));
  aux.scrollTo({top:menuInitialScroll,behavior:'instant'});
  const menuContacts=[...menu.querySelectorAll('.ta-price-zalo')],cta=menu.querySelector('.ta-price-footer > strong');
  check('Price table ends with bold advice and exactly three verified Zalo links',cta&&cta.textContent==='Nếu bảng chưa có quy cách bạn cần, hãy nhắn Zalo để được tư vấn.'&&Number(getComputedStyle(cta).fontWeight)>=600&&menuContacts.length===3&&a.data.contacts.every(contact=>menuContacts.some(link=>link.getAttribute('href')===contact.zalo))&&menuContacts.every(link=>link.target==='_blank'&&link.rel.includes('noopener')&&link.referrerPolicy==='no-referrer'&&!link.href.includes('?')));
  menu.querySelector('.ta-price-back').click();
  check('Back from a table returns to the chosen category and keyboard heading',menu.dataset.screen==='variants'&&menu.querySelectorAll('.ta-price-table').length===0&&s.activeElement===menu.querySelector('.ta-price-title'));
  menu.querySelector('[data-variant-id="table-catalogue-a4-all-c150-12-200"]').click();
  const vpCatalogue=a.data.products.find(product=>product.id==='catalogue').priceFacts.filter(fact=>fact.provider==='vinh-phat'&&fact.specs.material==='all-c150');
  check('Supplemental all-C150 menu preserves all 18 rows and the 13000 book tier',exactTable(vpCatalogue)&&[...menu.querySelectorAll('.ta-price-source')].some(link=>link.href===vpCatalogue[0].sourceUrl)&&[...menu.querySelectorAll('.ta-price-table tbody tr')].some(row=>row.querySelector('th').textContent==='16'&&row.querySelector('.ta-price-quantity').dataset.quantity==='500'&&row.querySelector('.ta-price-amount').textContent===ThanhAnFAQ.money(13000)));
  check('Supplemental menu hides supplier branding and keeps original provenance links',menu.textContent.includes('Giá tham khảo')&&!/\bV[ĩi]nh[\s-]*Ph[áa]t\b|invinhphat\.com/iu.test(menu.textContent)&&[...menu.querySelectorAll('.ta-price-source')].every(link=>link.textContent==='Xem bảng giá gốc'&&link.hostname==='invinhphat.com'&&link.rel.includes('noopener')));
  menu.querySelector('.ta-price-back').click();menu.querySelector('[data-variant-id="table-catalogue-a4-cover-c250-offset-12-200"]').click();
  const ownerC300=a.data.products.find(product=>product.id==='catalogue').priceFacts.filter(fact=>fact.specs.material==='cover-c300'&&fact.specs.printing==='offset4');
  check('Owner-confirmed C300 offset catalogue preserves all 28 updated rows without changing the historical source',ownerC300.length===28&&exactTable(ownerC300)&&menu.textContent.includes('C300')&&ownerC300.every(fact=>fact.ownerPriceRevision?.websitePublicationVerified===false)&&[...menu.querySelectorAll('.ta-price-source')].every(link=>link.hostname==='invinhphat.com'));
  menu.querySelector('.ta-price-back').click();menu.querySelector('[data-variant-id="estimate-catalogue-a5-all-c150-12-1000-estimate"]').click();
  check('A5 menu keeps its estimate separate from a fixed table and preserves the 200-book warning',menu.querySelectorAll('.ta-price-table').length===0&&menu.querySelector('.ta-price-estimate').textContent.includes('5.800')&&menu.querySelector('.ta-price-estimate').textContent.includes('1.000')&&menu.textContent.includes('A5 200')&&menu.querySelectorAll('.ta-price-warning').length>=2);
  menu.querySelector('.ta-price-back').click();menu.querySelector('.ta-price-back').click();
  check('Back from variants returns to product categories',menu.dataset.screen==='categories'&&menu.querySelector('[data-category-id="namecard"]')&&menu.querySelectorAll('.ta-price-variant').length===0);
  menu.querySelector('[data-category-id="namecard"]').click();menu.querySelector('[data-variant-id="table-namecard-vp-2"]').click();
  const vpCards=a.data.products.find(product=>product.id==='namecard-vp').priceFacts;
  check('Offset namecard table retains 90/120/160 thousand package totals without per-box conversion',exactTable(vpCards)&&[...menu.querySelectorAll('.ta-price-meaning')].every(cell=>ThanhAnFAQ.normalize(cell.textContent).includes('tong goi'))&&[...menu.querySelectorAll('.ta-price-source')].every(link=>link.hostname==='invinhphat.com'&&link.rel.includes('noopener')));
  menu.querySelector('.ta-price-back').click();menu.querySelector('.ta-price-back').click();menu.querySelector('[data-category-id="tag"]').click();
  for(const [variantId,size] of [['table-owner-earring-tag-50x40-1000','50x40'],['table-owner-earring-tag-85x50-500','85x50']]){
   menu.querySelector('[data-variant-id="'+variantId+'"]').click();const earringRows=a.data.products.find(product=>product.id==='earring-tag-vp').priceFacts.filter(fact=>fact.specs.size===size);
   const referenceLinks=[...menu.querySelectorAll('.ta-price-source')];
   check('Owner earring '+size+' menu preserves unit amounts, exact secondary source and incomplete-lamination handoff',earringRows.length===3&&exactTable(earringRows)&&referenceLinks.length===1&&referenceLinks[0].href===EARRING_SOURCE&&referenceLinks[0].target==='_blank'&&referenceLinks[0].rel.includes('noopener')&&referenceLinks[0].referrerPolicy==='no-referrer'&&menu.querySelectorAll('.ta-price-zalo').length===3&&earringRows.every(fact=>fact.sourceUrl===null&&fact.secondarySourceUrls?.length===1&&fact.secondarySourceUrls[0]===EARRING_SOURCE&&fact.specs.material==='c300'&&fact.specs.sides===2&&fact.rawSourceFlags.ownerRecipeIncomplete&&fact.specs.finishing===undefined));
   menu.querySelector('.ta-price-back').click();
  }
  const incompleteOwner=a.data.products.find(product=>product.id==='earring-tag-vp').priceFacts[0];await a.send(incompleteOwner.lookupQuery);
  check('Incomplete owner earring specifications require compact local handoff without a calculated quote or duplicate CTA',!log.lastElementChild.classList.contains('ta-message-quote')&&log.lastElementChild.querySelector('.ta-message-bubble').textContent.includes('Zalo')&&log.lastElementChild.querySelector('.ta-handoff')===null&&ThanhAnFAQ.answer(incompleteOwner.lookupQuery,a.data).handoff===true&&!log.hidden&&aux.hidden);
  await a.send('giá card in nhanh kỹ thuật số');await a.send('C300');await a.send('5 hộp');
  check('Typed conversation remains available after price-menu navigation with the compact Thanh An total',compactPrice(log.lastElementChild,5,'hộp',400000,['C300'])&&log.lastElementChild.querySelector('.ta-quote-details').textContent.includes('80.000')&&log.lastElementChild.querySelector('.ta-source').hostname==='innhanhtphcm.com'&&!last().includes('120.000'));
  await a.send('Xem bảng giá');const mountedMenuBeforeClear=auxBody.querySelector('.ta-price-menu'),auxiliaryBeforeClear=!aux.hidden&&log.hidden&&mountedMenuBeforeClear?.isConnected;
  s.querySelector('.ta-clear').click();
  check('Clear removes mounted price menus as well as conversation state',auxiliaryBeforeClear&&!mountedMenuBeforeClear.isConnected&&!menu.isConnected&&s.querySelectorAll('.ta-price-menu').length===0&&log.childElementCount===1&&aux.hidden&&!log.hidden&&s.activeElement===input);
  const sourceRow=a.data.products.find(product=>product.id==='catalogue').priceFacts.find(fact=>fact.id==='catalogue-a4-all-c150-16-500');
  await a.send(sourceRow.lookupQuery);
  const generatedUser=log.lastElementChild.previousElementSibling;
  check('Canonical source-row echo hides branding while preserving compact total, hidden basis and source',generatedUser.classList.contains('ta-message-user')&&!/\bV[ĩi]nh[\s-]*Ph[áa]t\b|invinhphat\.com/iu.test(generatedUser.textContent+log.lastElementChild.textContent)&&compactPrice(log.lastElementChild,500,'cuốn',6500000,['A4','16 trang','C150'])&&log.lastElementChild.querySelector('.ta-quote-details').textContent.includes('13.000')&&log.lastElementChild.querySelector('.ta-source').href===sourceRow.sourceUrl);
  s.querySelector('.ta-clear').click();
  const count=log.childElementCount;s.querySelectorAll('.ta-quick button')[1].click();await frame();await delay(20);check('Quick full-table button opens the auxiliary product categories',log.childElementCount>=count&&!aux.hidden&&log.hidden&&auxBody.querySelector('.ta-price-menu')?.dataset.screen==='categories');
  for(let n=0;n<30;n++)await a.send('chào');check('Conversation memory is bounded to 50 blocks',log.childElementCount<=50);
  check('No persistent visitor storage or cookies',JSON.stringify({...localStorage})===storageBefore.local&&JSON.stringify({...sessionStorage})===storageBefore.session&&document.cookie===storageBefore.cookie);
  check('No external network requests while chatting',performance.getEntriesByType('resource').every(r=>new URL(r.name,location.href).origin===location.origin));
  const aborted=a.send('Giờ làm việc');await Promise.resolve();a.destroy();await aborted;check('Destroy resolves local work and leaves no connected host or orphaned typing UI',!host.isConnected&&document.getElementById('ta-mam-chat-host')===null&&s.querySelectorAll('.ta-message-typing,.ta-typing-dots').length===0&&nativeCanvas.dataset.paused==='true');check('Destroy removes host and all widget DOM',document.getElementById('ta-mam-chat-host')===null);
  const destroyedSpriteHash=pixelHash(pixels(nativeCanvas));await delay(200);nativeCanvas.dispatchEvent(new PointerEvent('pointerenter',{pointerType:'mouse'}));check('Destroy cancels native frame and attention timers without later redraw',pixelHash(pixels(nativeCanvas))===destroyedSpriteHash&&!mascot.getAttention().active&&nativeCanvas.dataset.paused==='true');instance=null;
  const {activityIdleMs:shortActivityInterval,...defaultOptions}=options;
  instance=await ThanhAnChat.mount({...defaultOptions,reducedMotion:true});instance.open();
  a.destroy();a.open();const reused=await ThanhAnChat.mount(options);check('Old destroy/open cannot remove or duplicate a remounted instance',reused===instance&&document.querySelectorAll('#ta-mam-chat-host').length===1);
  check('Remount starts clean with no conversation persistence',instance.shadow.querySelectorAll('.ta-message').length===1);
  check('Forced reduced motion removes panel animation and smooth scrolling',getComputedStyle(instance.shadow.querySelector('.ta-panel')).animationName==='none'&&getComputedStyle(instance.shadow.querySelector('.ta-log')).scrollBehavior==='auto');
  const productionInput=instance.shadow.querySelector('.ta-input'),productionStarted=performance.now();productionInput.value='Catalogue';productionInput.dispatchEvent(new Event('input',{bubbles:true}));await delay(500);
  check('Production defaults keep attention at six seconds and working beyond the short harness interval',instance.launcherMascot.getAttention().durationMs===6000&&instance.host.dataset.activity==='idle'&&instance.avatarMascot.getState()==='working',JSON.stringify({elapsedMs:performance.now()-productionStarted,attentionMs:instance.launcherMascot.getAttention().durationMs}));
  await delay(Math.max(0,10150-(performance.now()-productionStarted)));
  check('Production working pose returns to standing after ten seconds of inactivity',instance.host.dataset.activity==='idle'&&instance.avatarMascot.getState()==='idle'&&instance.host.dataset.mascotState==='idle',JSON.stringify({elapsedMs:performance.now()-productionStarted}));
  instance.close();byId('underlay').click();check('Underlying page control still works',clickCount>0);
  await frame();
 }catch(error){check('Harness completes without runtime error',false,error.message);}
 const passed=results.filter(r=>r.pass).length;const report={suite:'Mầm browser interaction',startedAt,finishedAt:new Date().toISOString(),viewport:{width:innerWidth,height:innerHeight},total:results.length,passed,failed:results.length-passed,tests:results};
 byId('results-json').textContent=JSON.stringify(report,null,2);summary.textContent=passed+'/'+results.length+' PASS · '+report.failed+' FAIL';run.disabled=false;
}
run.addEventListener('click',tests);
})();
