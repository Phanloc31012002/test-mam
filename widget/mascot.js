/* Mầm uses unmodified official Seedy v10/v2 sprite cells. No added artwork.
 * Source: https://chatgpt.com/cdn/assets/seedy-spritesheet-v10.c613f3fce1.webp
 * SHA256: 4cc6c9f4bc61882379472dfa7fa91ca128b90933b0ae3cda9fff3da91dc6d1f8
 * Preview timing is local; look poses are the original sixteen cells.
 */
(function(root){
  'use strict';
  const WIDTH=192,HEIGHT=208,COLUMNS=8,ROWS=11;
  const script=document.currentScript;
  const defaultSpriteUrl=root.ThanhAnMascotSpriteUrl||new URL('seedy-spritesheet-v10.webp',script&&script.src?script.src:document.baseURI).href;
  const imageCache=new Map();
  const STATES=Object.freeze({
    idle:Object.freeze({row:0,name:'idle',durations:Object.freeze([1400,80,80,1400,80,80])}),
    'running-right':Object.freeze({row:1,name:'running-right',durations:Object.freeze([100,100,100,100,100,100,100,100])}),
    'running-left':Object.freeze({row:2,name:'running-left',durations:Object.freeze([100,100,100,100,100,100,100,100])}),
    waving:Object.freeze({row:3,name:'waving',durations:Object.freeze([160,180,180,260])}),
    jumping:Object.freeze({row:4,name:'jumping',durations:Object.freeze([110,120,120,120,220])}),
    failed:Object.freeze({row:5,name:'failed',spiralFrame:2,durations:Object.freeze([140,140,140,140,140,140,140,260])}),
    waiting:Object.freeze({row:6,name:'waiting',durations:Object.freeze([200,200,200,200,200,300])}),
    running:Object.freeze({row:7,name:'running',durations:Object.freeze([120,120,120,120,120,220])}),
    review:Object.freeze({row:8,name:'review',durations:Object.freeze([180,180,180,180,180,280])})
  });
  const aliases=Object.freeze({greeting:'waving',working:'running'});
  const canonical=value=>aliases[value]||value;
  const validState=value=>typeof value==='string'&&Object.prototype.hasOwnProperty.call(STATES,canonical(value));
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const lookDurations=Object.freeze([0,0,0,0,0,0,0,0]);
  const idleExpressionSequence=Object.freeze(['waiting','review','failed']);
  function loadSprite(url){
    if(imageCache.has(url))return imageCache.get(url);
    const promise=new Promise((resolve,reject)=>{
      const image=new root.Image();
      image.onload=()=>{
        if(image.naturalWidth!==WIDTH*COLUMNS||image.naturalHeight!==HEIGHT*ROWS){reject(new Error('Kích thước sprite Seedy v2 không hợp lệ'));return;}
        resolve(image);
      };
      image.onerror=()=>reject(new Error('Không tải được hình Mầm'));
      image.src=url;
    });
    imageCache.set(url,promise);
    promise.catch(()=>imageCache.delete(url));
    return promise;
  }
  function create(options={}){
    let state=options.state===undefined?'idle':options.state;
    if(!validState(state))throw new TypeError('Trạng thái Mầm không hợp lệ');
    const element=document.createElement('canvas');
    element.width=WIDTH;element.height=HEIGHT;element.className='ta-mascot';
    element.setAttribute('role','img');
    element.dataset.state=state;element.dataset.ready='false';element.dataset.spriteSource='official-seedy-v10';
    element.dataset.spriteSha256='4cc6c9f4bc61882379472dfa7fa91ca128b90933b0ae3cda9fff3da91dc6d1f8';
    element.dataset.attention='false';element.dataset.lookSupported='true';
    const context=element.getContext('2d',{alpha:true});
    if(!context)throw new Error('Trình duyệt không hỗ trợ canvas cho Mầm');
    context.imageSmoothingEnabled=false;
    const spriteUrl=new URL(options.spriteUrl||defaultSpriteUrl,document.baseURI).href;
    const attentionValue=Number(options.attentionDurationMs),hopValue=Number(options.idleHopIntervalMs);
    const attentionDuration=Number.isFinite(attentionValue)?clamp(Math.round(attentionValue),500,30000):6000;
    const hopInterval=Number.isFinite(hopValue)?clamp(Math.round(hopValue),500,60000):7200;
    const expressionValue=Number(options.idleExpressionIntervalMs);
    const expressionInterval=Number.isFinite(expressionValue)?clamp(Math.round(expressionValue),1000,60000):18000;
    const autoIdleExpressions=options.autoIdleExpressions!==false;
    element.dataset.attentionDurationMs=String(attentionDuration);element.dataset.idleHopIntervalMs=String(hopInterval);
    element.dataset.autoIdleExpressions=String(autoIdleExpressions);element.dataset.idleExpressionIntervalMs=String(expressionInterval);element.dataset.idleExpressionScheduled='false';element.dataset.idleExpressionDeferred='false';
    const media=root.matchMedia('(prefers-reduced-motion: reduce)');
    const fine=root.matchMedia('(hover: hover) and (pointer: fine)');
    let requestedReduced=options.reducedMotion===true,reduced=requestedReduced||media.matches;
    let stopped=false,manualPause=false,image=null,phase=state,frame=0,attention=false,lookIndex=null,pointerAttached=false;
    let frameTimer=0,hopTimer=0,blinkTimer=0,attentionTimer=0,tapTimer=0,tapGreeting=false,raf=0,expressionTimer=0,expression=null,expressionIndex=0;
    const paused=()=>manualPause||document.hidden;
    const canAnimate=()=>!!image&&!stopped&&!reduced&&!paused();
    const current=()=>phase==='looking'?{row:lookIndex<8?9:10,name:'looking',durations:lookDurations}:STATES[canonical(phase)];
    function label(){
      const labels={idle:'Mầm, bé cây màu kem có hai lá xanh','running-right':'Mầm di chuyển sang phải theo sprite gốc','running-left':'Mầm di chuyển sang trái theo sprite gốc',waving:'Mầm vẫy tay theo sprite gốc',jumping:'Mầm nhảy theo sprite gốc',failed:'Mầm phản ứng buồn và choáng theo hoạt cảnh gốc',waiting:'Mầm chờ theo sprite gốc',running:'Mầm ngồi gõ laptop theo sprite gốc',review:'Mầm kiểm tra theo sprite gốc'};
      element.setAttribute('aria-label',expression?'Mầm, biểu cảm lúc rảnh: '+labels[expression]:labels[canonical(state)]);
    }
    function draw(){
      const spec=current();
      element.dataset.state=state;element.dataset.spriteState=spec.name;element.dataset.spriteRow=String(spec.row);element.dataset.spriteFrame=String(frame);element.dataset.spriteFrameCount=String(spec.durations.length);
      element.dataset.idleExpression=expression||'';
      if(phase==='looking'){element.dataset.lookDirection=String(lookIndex);element.dataset.lookAngle=String(lookIndex*22.5);}else{delete element.dataset.lookDirection;delete element.dataset.lookAngle;}
      if(!image||stopped)return;
      context.clearRect(0,0,WIDTH,HEIGHT);
      context.drawImage(image,frame*WIDTH,spec.row*HEIGHT,WIDTH,HEIGHT,0,0,WIDTH,HEIGHT);
    }
    function stopAnimation(){
      root.clearTimeout(frameTimer);root.clearTimeout(hopTimer);root.clearTimeout(blinkTimer);
      frameTimer=0;hopTimer=0;blinkTimer=0;delete element.dataset.blink;
    }
    function stopExpressionClock(){
      root.clearTimeout(expressionTimer);expressionTimer=0;element.dataset.idleExpressionScheduled='false';element.dataset.idleExpressionDeferred='false';
    }
    function cancelExpression(){
      if(!expression)return;
      stopAnimation();expression=null;phase=state;frame=0;lookIndex=null;label();draw();
    }
    function scheduleExpression(delay=expressionInterval,deferred=false){
      stopExpressionClock();
      if(!autoIdleExpressions||!canAnimate()||state!=='idle'||attention||phase==='looking'||expression)return;
      element.dataset.idleExpressionScheduled='true';element.dataset.idleExpressionDeferred=String(deferred);
      expressionTimer=root.setTimeout(()=>{
        expressionTimer=0;element.dataset.idleExpressionScheduled='false';element.dataset.idleExpressionDeferred='false';
        if(!canAnimate()||state!=='idle'||attention||phase==='looking')return;
        // Ambient hops/blinks must not restart the quiet interval and starve expressions.
        if(phase!=='idle'||blinkTimer){scheduleExpression(500,true);return;}
        if(react(idleExpressionSequence[expressionIndex]))expressionIndex=(expressionIndex+1)%idleExpressionSequence.length;
      },delay);
    }
    function react(gesture){
      if(!idleExpressionSequence.includes(gesture))throw new TypeError('Biểu cảm Mầm không hợp lệ');
      if(!canAnimate()||state!=='idle'||phase!=='idle'||attention||blinkTimer||expression)return false;
      stopExpressionClock();stopAnimation();expression=gesture;phase=gesture;frame=0;lookIndex=null;label();draw();scheduleFrame();return true;
    }
    function scheduleFrame(){
      root.clearTimeout(frameTimer);frameTimer=0;
      if(!canAnimate()||blinkTimer||phase==='looking')return;
      frameTimer=root.setTimeout(()=>{
        frameTimer=0;if(!canAnimate())return;
        if(frame+1>=current().durations.length){
          frame=0;
          if(expression&&state==='idle'){expression=null;phase='idle';label();scheduleHop();scheduleExpression();}
          else if(phase==='jumping'&&state==='idle'){phase='idle';scheduleHop();}
        }else frame++;
        draw();scheduleFrame();
      },current().durations[frame]);
    }
    function scheduleHop(){
      root.clearTimeout(hopTimer);hopTimer=0;
      if(!canAnimate()||state!=='idle'||phase==='jumping'||phase==='looking'||expression)return;
      hopTimer=root.setTimeout(()=>{
        hopTimer=0;if(!canAnimate()||state!=='idle')return;
        if(attention||blinkTimer){scheduleHop();return;}jump();
      },hopInterval);
    }
    function stopAttention(){
      root.clearTimeout(attentionTimer);attentionTimer=0;attention=false;element.dataset.attention='false';
      root.cancelAnimationFrame(raf);raf=0;syncPointer();
      if(expression){cancelExpression();scheduleFrame();scheduleHop();}
      if(phase==='looking'){stopAnimation();phase=state;frame=0;lookIndex=null;draw();scheduleFrame();scheduleHop();}
      scheduleExpression();
    }
    function activateAttention(){
      if(stopped||reduced||paused())return false;
      stopExpressionClock();if(expression){cancelExpression();scheduleFrame();scheduleHop();}
      root.clearTimeout(attentionTimer);attention=true;element.dataset.attention='true';
      syncPointer();
      attentionTimer=root.setTimeout(()=>{attentionTimer=0;stopAttention();},attentionDuration);return true;
    }
    function gaze(dx,dy){
      if(!canAnimate()||state!=='idle'||expression)return false;
      const x=Number.isFinite(Number(dx))?Number(dx):0,y=Number.isFinite(Number(dy))?Number(dy):0;
      stopExpressionClock();stopAnimation();
      if(Math.hypot(x,y)<.15){phase='idle';frame=0;lookIndex=null;draw();scheduleFrame();scheduleHop();scheduleExpression();return true;}
      lookIndex=((Math.round(Math.atan2(x,-y)/(Math.PI/8))%16)+16)%16;phase='looking';frame=lookIndex%8;draw();return true;
    }
    function pointer(event){
      if(event.pointerType==='touch'||!attention||!canAnimate()||!fine.matches||state!=='idle'||!element.isConnected)return;
      root.cancelAnimationFrame(raf);const x=event.clientX,y=event.clientY;
      raf=root.requestAnimationFrame(()=>{
        raf=0;if(!attention||!canAnimate()||!fine.matches||state!=='idle')return;
        const b=element.getBoundingClientRect(),cx=b.x+b.width/2,cy=b.y+b.height*.59;
        if(!b.width||!b.height||Math.hypot(x-cx,y-cy)>480){gaze(0,0);return;}gaze((x-cx)/90,(y-cy)/100);
      });
    }
    function syncPointer(){
      const wanted=attention&&!stopped&&!reduced&&!paused()&&fine.matches&&state==='idle';
      if(wanted&&!pointerAttached){root.addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerleave',stopAttention);pointerAttached=true;}
      if(!wanted&&pointerAttached){root.removeEventListener('pointermove',pointer);document.removeEventListener('pointerleave',stopAttention);pointerAttached=false;root.cancelAnimationFrame(raf);raf=0;}
    }
    function jump(){
      if(!canAnimate()||state!=='idle'||phase==='jumping'||blinkTimer||expression)return false;
      stopAnimation();phase='jumping';frame=0;lookIndex=null;draw();scheduleFrame();return true;
    }
    function blink(){
      if(!canAnimate()||state!=='idle'||phase!=='idle'||expression)return false;
      stopAnimation();frame=1;element.dataset.blink='true';draw();
      blinkTimer=root.setTimeout(()=>{
        blinkTimer=0;delete element.dataset.blink;if(stopped)return;
        phase=state;frame=0;draw();scheduleFrame();scheduleHop();
      },140);return true;
    }
    function setState(value){
      if(stopped)return false;
      if(!validState(value))throw new TypeError('Trạng thái Mầm không hợp lệ');
      // Repeated input keeps the active work loop moving instead of restarting frame zero.
      if(value===state&&phase===state){if(value==='idle'&&!expressionTimer)scheduleExpression();return true;}
      root.clearTimeout(tapTimer);tapTimer=0;tapGreeting=false;stopExpressionClock();stopAnimation();expression=null;
      state=value;phase=value;frame=0;lookIndex=null;label();draw();syncPointer();scheduleFrame();scheduleHop();scheduleExpression();return true;
    }
    function syncPause(){
      element.dataset.paused=String(paused()||stopped);element.dataset.reducedMotion=String(reduced);
      stopExpressionClock();stopAnimation();
      if(stopped||reduced||paused()){
        stopAttention();root.clearTimeout(tapTimer);tapTimer=0;
        if(tapGreeting){tapGreeting=false;state='idle';phase='idle';frame=0;label();}
        if(reduced){phase=state;frame=0;}
        draw();return;
      }
      syncPointer();scheduleFrame();scheduleHop();scheduleExpression();
    }
    function setReducedMotion(value){if(stopped)return;requestedReduced=!!value;reduced=requestedReduced||media.matches;syncPause();}
    function setPaused(value){if(stopped)return;manualPause=!!value;syncPause();}
    const preference=()=>{reduced=requestedReduced||media.matches;syncPause();};
    const pointerPreference=()=>{if(!fine.matches)stopAttention();else syncPointer();};
    const visibility=()=>syncPause();
    const enter=event=>{if(event.pointerType!=='touch')activateAttention();};
    const touch=event=>{
      if(!activateAttention())return;
      if(event.pointerType==='touch'&&state==='idle'){
        setState('greeting');tapGreeting=true;
        tapTimer=root.setTimeout(()=>{tapTimer=0;if(!stopped&&tapGreeting){tapGreeting=false;setState('idle');}},900);
      }
    };
    label();draw();syncPause();
    element.addEventListener('pointerenter',enter);element.addEventListener('pointerdown',touch);
    root.addEventListener('blur',stopAttention);document.addEventListener('visibilitychange',visibility);media.addEventListener('change',preference);fine.addEventListener('change',pointerPreference);
    const ready=loadSprite(spriteUrl).then(loaded=>{
      if(stopped)return element;
      image=loaded;element.dataset.ready='true';draw();syncPause();return element;
    }).catch(error=>{element.dataset.error='sprite-load';throw error;});
    ready.catch(()=>{});
    return {
      element,ready,setState,getState:()=>state,blink,jump,react,setReducedMotion,setPaused,activateAttention,stopAttention,
      gaze,
      getPose:()=>({supported:true,source:'official-v2-cells',active:phase==='looking',directionIndex:lookIndex,angleDegrees:lookIndex===null?null:lookIndex*22.5,row:current().row,frame}),
      getAttention:()=>({active:attention,durationMs:attentionDuration}),
      getIdleExpressions:()=>({enabled:autoIdleExpressions,intervalMs:expressionInterval,sequence:idleExpressionSequence,active:expression,scheduled:!!expressionTimer,deferred:element.dataset.idleExpressionDeferred==='true'}),
      getFrame:()=>({row:current().row,frame,frameCount:current().durations.length,durationMs:current().durations[frame],spriteState:current().name,state,expression,transient:expression!==null,directionIndex:lookIndex,angleDegrees:lookIndex===null?null:lookIndex*22.5,width:WIDTH,height:HEIGHT,ready:!!image,assetUrl:spriteUrl}),
      destroy(){
        if(stopped)return;stopExpressionClock();stopAnimation();
        if(state==='idle'&&phase!=='idle'){expression=null;phase='idle';frame=0;lookIndex=null;label();draw();}
        stopped=true;stopAttention();root.clearTimeout(tapTimer);tapTimer=0;tapGreeting=false;element.dataset.paused='true';
        element.removeEventListener('pointerenter',enter);element.removeEventListener('pointerdown',touch);root.removeEventListener('blur',stopAttention);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',preference);fine.removeEventListener('change',pointerPreference);
      }
    };
  }
  root.ThanhAnMascot=Object.freeze({create,assetUrl:defaultSpriteUrl,sprite:Object.freeze({width:WIDTH,height:HEIGHT,columns:COLUMNS,rows:ROWS,version:2,states:STATES,aliases,lookDirections:16})});
})(typeof window!=='undefined'?window:globalThis);
