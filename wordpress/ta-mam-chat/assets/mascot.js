(function (root) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const COLORS = {o:'#70694b',c:'#fff1d2',s:'#e3d9b1',h:'#fffbea',b:'#efb5a5',g:'#91bf64',d:'#508d4b',l:'#c6df88',w:'#fffdf4',e:'#423d35'};
  function node(tag, attrs, parent) { const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);if(parent)parent.appendChild(e);return e; }
  function rect(parent,x,y,w,h,fill) { return node('rect',{x,y,width:w,height:h,fill:COLORS[fill]||fill},parent); }
  function pieces(parent,values) { values.forEach(value=>rect(parent,...value)); }
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  function create(options={}) {
    const initialState=options.state===undefined?'idle':options.state;
    if(!['idle','greeting','working'].includes(initialState))throw new TypeError('Trạng thái Mầm không hợp lệ');
    const svg=node('svg',{viewBox:'0 0 64 72',class:'ta-mascot',role:'img','aria-label':'Mầm, bé chibi màu kem có hai lá xanh, tay và chân','shape-rendering':'crispEdges','data-state':'idle'},null);
    const shadow=node('g',{class:'ta-mascot-shadow'},svg);
    pieces(shadow,[[17,63,30,1,'#d9e2c6'],[21,64,22,1,'#e7ebd9']]);
    const body=node('g',{class:'ta-mascot-body'},svg);
    // Original integer-grid chibi artwork follows the supplied reference description.
    const legs=node('g',{class:'ta-mascot-legs'},body);
    pieces(legs,[[25,52,5,7,'o'],[35,52,5,7,'o'],[23,58,8,3,'o'],[34,58,8,3,'o'],[26,53,3,5,'s'],[36,53,3,5,'s'],[24,59,6,1,'c'],[35,59,6,1,'c'],[23,61,8,1,'#cfb68f'],[34,61,8,1,'#cfb68f']]);
    // The cream bridge overlaps both head and belly through every allowed neck rotation.
    const neck=node('g',{class:'ta-mascot-neck'},body);
    pieces(neck,[[25,40,14,9,'o'],[27,40,10,9,'c']]);
    const torso=node('g',{class:'ta-mascot-torso'},body);
    pieces(torso,[[25,42,14,2,'o'],[23,44,18,8,'o'],[24,52,16,2,'o'],[26,54,12,1,'o'],[25,44,14,8,'c'],[24,46,16,5,'c'],[26,52,12,1,'s'],[25,45,2,6,'h'],[38,46,1,5,'s'],[30,47,4,4,'#d5dfa9'],[29,48,6,2,'#d5dfa9'],[31,47,2,3,'g']]);
    const leftArm=node('g',{class:'ta-mascot-arm ta-mascot-arm-left'},body);
    pieces(leftArm,[[19,45,5,3,'o'],[17,47,6,5,'o'],[16,50,6,3,'o'],[20,46,3,2,'c'],[18,48,4,3,'c'],[17,51,4,1,'h']]);
    const rightArm=node('g',{class:'ta-mascot-arm ta-mascot-arm-right'},body);
    pieces(rightArm,[[40,45,5,3,'o'],[42,47,6,5,'o'],[43,50,6,3,'o'],[41,46,3,2,'c'],[43,48,4,3,'c'],[44,51,4,1,'h']]);
    const wave=node('g',{class:'ta-mascot-wave'},body);
    pieces(wave,[[41,44,5,4,'o'],[45,40,5,6,'o'],[47,35,6,6,'o'],[48,33,4,3,'o'],[42,45,3,2,'c'],[46,41,3,4,'c'],[48,36,4,4,'c'],[49,34,2,3,'h']]);
    const head=node('g',{class:'ta-mascot-head','data-head-tilt':'0','data-head-y':'0'},body);
    const leaves=node('g',{class:'ta-mascot-leaves'},head);
    pieces(leaves,[[31,14,2,4,'o'],[30,11,2,4,'o'],[31,9,2,3,'o'],[33,8,2,2,'o'],[28,11,3,2,'o'],[33,8,3,2,'o'],[16,6,7,2,'d'],[14,8,12,2,'d'],[15,10,14,2,'d'],[18,12,11,2,'d'],[22,14,6,1,'d'],[17,7,5,2,'g'],[17,9,8,2,'g'],[20,11,7,2,'g'],[18,8,4,1,'l'],[22,10,3,1,'l'],[38,2,6,2,'d'],[36,4,11,2,'d'],[34,6,13,2,'d'],[35,8,10,2,'d'],[36,10,5,1,'d'],[38,3,5,2,'g'],[37,5,8,2,'g'],[35,7,8,2,'g'],[36,9,5,1,'g'],[39,4,4,1,'l'],[37,6,4,1,'l']]);
    pieces(head,[[22,17,20,1,'o'],[18,18,28,2,'o'],[16,20,32,2,'o'],[15,22,34,18,'o'],[16,40,32,3,'o'],[18,43,28,2,'o'],[22,45,20,1,'o'],[22,18,20,2,'h'],[19,20,26,2,'c'],[17,22,30,18,'c'],[18,40,28,2,'c'],[20,42,24,2,'s'],[23,44,18,1,'s'],[17,22,2,17,'h'],[45,22,2,18,'s'],[21,23,22,1,'#d5d1ad'],[20,24,1,15,'#d5d1ad'],[43,24,1,15,'#d5d1ad'],[21,39,1,1,'#d5d1ad'],[42,39,1,1,'#d5d1ad'],[22,40,20,1,'#d5d1ad'],[21,24,22,15,'#fff6df'],[22,39,20,1,'#fff6df'],[18,36,4,2,'b'],[43,36,4,2,'b']]);
    const eyes=node('g',{class:'ta-mascot-eyes'},head);
    const pupils=node('g',{class:'ta-mascot-pupils','data-gaze-x':'0','data-gaze-y':'0'},eyes);
    // Each tiny square eye uses three integer rectangles; no oversized white eye sockets.
    [22,40].forEach(x=>pieces(pupils,[[x,34,2,1,'e'],[x,35,1,1,'e'],[x+1,35,1,1,'e']]));
    const closed=node('g',{class:'ta-mascot-closed'},head);
    pieces(closed,[[22,35,3,1,'e'],[39,35,3,1,'e']]);
    pieces(head,[[30,37,1,1,'o'],[34,37,1,1,'o'],[31,38,3,1,'o']]);
    const work=node('g',{class:'ta-mascot-work','aria-hidden':'true'},svg);
    pieces(work,[[7,55,50,1,'#714e37'],[5,56,54,3,'#714e37'],[7,56,50,2,'#c28d5b'],[8,59,48,5,'#9b6847'],[10,64,4,5,'#714e37'],[50,64,4,5,'#714e37'],[11,64,2,4,'#ad7b50'],[51,64,2,4,'#ad7b50'],[10,60,44,1,'#b88256']]);
    const laptop=node('g',{class:'ta-mascot-laptop'},work);
    pieces(laptop,[[33,42,22,1,'#566052'],[32,43,24,12,'#566052'],[34,44,20,9,'#dce7d2'],[35,44,18,1,'#edf3e8'],[37,47,12,1,'#a3bc8e'],[37,50,9,1,'#a3bc8e'],[50,47,1,4,'#bfd0ae'],[23,55,34,2,'#566052'],[25,55,30,1,'#edf0e6'],[27,57,28,1,'#99a18d'],[30,55,4,1,'#a2ae97']]);
    const typingLeft=node('g',{class:'ta-mascot-typing ta-mascot-typing-left'},work);
    pieces(typingLeft,[[23,50,5,3,'o'],[25,52,5,3,'o'],[24,51,3,2,'c'],[26,53,3,1,'h']]);
    const typingRight=node('g',{class:'ta-mascot-typing ta-mascot-typing-right'},work);
    pieces(typingRight,[[30,51,4,3,'o'],[29,53,6,2,'o'],[31,52,2,2,'c'],[30,54,4,1,'h']]);

    let reduced=false,stopped=false,manualPause=false,pointerAttached=false,blinkTimer=0,reopenTimer=0,raf=0,state='idle';
    const mql=root.matchMedia('(prefers-reduced-motion: reduce)');
    const fine=root.matchMedia('(hover: hover) and (pointer: fine)');
    const paused=()=>manualPause||document.hidden;
    function gaze(dx,dy) {
      const neutral=reduced||stopped||paused();
      const safeX=Number.isFinite(Number(dx))?Number(dx):0,safeY=Number.isFinite(Number(dy))?Number(dy):0;
      const x=neutral?0:clamp(Math.round(safeX),-1,1),y=neutral?0:clamp(Math.round(safeY),-1,1);
      const tilt=neutral?0:clamp(Math.round(safeX*2),-2,2);
      pupils.setAttribute('transform',`translate(${x} ${y})`);pupils.dataset.gazeX=String(x);pupils.dataset.gazeY=String(y);
      head.setAttribute('transform',`rotate(${tilt} 32 43)`);head.dataset.headTilt=String(tilt);head.dataset.headY='0';
    }
    function reset(){root.cancelAnimationFrame(raf);raf=0;gaze(0,0);}
    function blink(){
      if(reduced||stopped||paused()||!svg.isConnected)return false;
      svg.dataset.blink='true';root.clearTimeout(reopenTimer);reopenTimer=root.setTimeout(()=>{delete svg.dataset.blink;reopenTimer=0;},140);return true;
    }
    function scheduleBlink(){
      root.clearTimeout(blinkTimer);blinkTimer=0;
      if(!reduced&&!stopped&&!paused())blinkTimer=root.setTimeout(()=>{blink();scheduleBlink();},3400+Math.random()*2400);
    }
    function pointer(event){
      if(event.pointerType==='touch'||reduced||stopped||paused()||!svg.isConnected)return;
      root.cancelAnimationFrame(raf);const x=event.clientX,y=event.clientY;
      raf=root.requestAnimationFrame(()=>{raf=0;if(stopped||paused())return;const b=svg.getBoundingClientRect(),cx=b.x+b.width/2,cy=b.y+b.height*.45;
        if(!b.width||!b.height||Math.hypot(x-cx,y-cy)>480){reset();return;}gaze((x-cx)/90,(y-cy)/100);});
    }
    function syncPointer(){
      const wanted=!reduced&&fine.matches&&!stopped&&!paused();
      if(wanted&&!pointerAttached){root.addEventListener('pointermove',pointer,{passive:true});root.addEventListener('blur',reset);document.addEventListener('pointerleave',reset);pointerAttached=true;}
      if(!wanted&&pointerAttached){root.removeEventListener('pointermove',pointer);root.removeEventListener('blur',reset);document.removeEventListener('pointerleave',reset);pointerAttached=false;reset();}
    }
    function syncPause(){
      svg.dataset.paused=String(paused()||stopped);root.clearTimeout(reopenTimer);reopenTimer=0;delete svg.dataset.blink;reset();syncPointer();scheduleBlink();
    }
    function setReducedMotion(value){
      if(stopped)return;reduced=!!value||mql.matches;svg.dataset.reducedMotion=String(reduced);syncPause();
    }
    function setPaused(value){if(stopped)return;manualPause=!!value;syncPause();}
    function setState(value){
      if(stopped)return false;if(!['idle','greeting','working'].includes(value))throw new TypeError('Trạng thái Mầm không hợp lệ');
      state=value;svg.dataset.state=value;svg.setAttribute('aria-label',value==='working'?'Mầm ngồi sau bàn gỗ, tra cứu trên laptop':value==='greeting'?'Mầm, bé chibi có hai lá xanh đang vẫy tay chào':'Mầm, bé chibi màu kem có hai lá xanh, tay và chân');return true;
    }
    const preference=()=>setReducedMotion(options.reducedMotion===true);
    const visibility=()=>syncPause();
    mql.addEventListener('change',preference);fine.addEventListener('change',syncPointer);document.addEventListener('visibilitychange',visibility);
    preference();setState(initialState);
    // State timing belongs to the widget: no artificial delay or model/network activity here.
    return {element:svg,gaze,blink,setReducedMotion,setPaused,setState,getState:()=>state,destroy(){
      if(stopped)return;stopped=true;root.clearTimeout(blinkTimer);root.clearTimeout(reopenTimer);blinkTimer=0;reopenTimer=0;delete svg.dataset.blink;reset();syncPointer();svg.dataset.paused='true';
      mql.removeEventListener('change',preference);fine.removeEventListener('change',syncPointer);document.removeEventListener('visibilitychange',visibility);
    }};
  }
  root.ThanhAnMascot=Object.freeze({create});
})(typeof window!=='undefined'?window:globalThis);
