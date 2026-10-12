(function (root) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const COLORS = {o:'#645346',c:'#fff1d5',s:'#e8d4af',h:'#fff9e9',b:'#f3b4a1',g:'#91bf64',d:'#508d4b',l:'#c6df88',w:'#fffdf4',e:'#423d35'};
  function node(tag, attrs, parent) { const e = document.createElementNS(NS,tag); for (const [k,v] of Object.entries(attrs)) e.setAttribute(k,v); if(parent)parent.appendChild(e); return e; }
  function rect(parent,x,y,w,h,fill) { return node('rect',{x,y,width:w,height:h,fill:COLORS[fill] || fill},parent); }
  function create(options = {}) {
    const svg = node('svg',{viewBox:'0 0 40 44',class:'ta-mascot',role:'img','aria-label':'Mầm, chậu cây pixel màu kem có hai lá non','shape-rendering':'crispEdges'});
    const shadow = node('g',{class:'ta-mascot-shadow'},svg);
    rect(shadow,8,41,24,1,'#dde5c9');rect(shadow,11,42,18,1,'#e9eddc');
    const body = node('g',{class:'ta-mascot-body'},svg);
    // Every colored piece sits on an integer pixel grid. No raster reference is embedded.
    const leaf = node('g',{class:'ta-mascot-leaves'},body);
    rect(leaf,19,9,2,7,'d');rect(leaf,17,8,2,3,'d');rect(leaf,21,7,2,4,'d');
    [[9,4,6,2,'d'],[7,6,11,2,'d'],[8,8,11,2,'d'],[10,10,9,2,'d'],[12,12,6,1,'d'],[9,5,5,2,'g'],[9,7,7,2,'g'],[11,9,6,2,'g'],[10,6,3,1,'l'],[12,8,3,1,'l'],[25,1,5,2,'d'],[23,3,9,2,'d'],[22,5,9,2,'d'],[21,7,8,2,'d'],[22,9,5,1,'d'],[25,2,4,2,'g'],[24,4,6,2,'g'],[23,6,5,2,'g'],[26,3,3,1,'l'],[24,5,3,1,'l']].forEach(r=>rect(leaf,...r));
    // Tiny woodland feet and stepped, softly rounded cream planter.
    rect(body,11,35,5,5,'o');rect(body,24,35,5,5,'o');rect(body,10,38,7,2,'o');rect(body,23,38,7,2,'o');
    rect(body,12,36,3,3,'s');rect(body,25,36,3,3,'s');
    rect(body,9,14,22,1,'o');rect(body,7,15,26,2,'o');rect(body,6,17,28,15,'o');rect(body,7,32,26,3,'o');rect(body,9,35,22,2,'o');
    rect(body,9,15,22,2,'h');rect(body,8,17,24,15,'c');rect(body,7,19,26,11,'c');rect(body,8,32,24,2,'c');rect(body,10,34,20,2,'s');
    rect(body,8,17,24,2,'s');rect(body,9,17,22,1,'h');rect(body,8,19,2,11,'h');rect(body,30,19,2,13,'s');rect(body,28,32,3,2,'s');
    rect(body,8,28,4,2,'b');rect(body,28,28,4,2,'b');
    const eyes = node('g',{class:'ta-mascot-eyes'},body);
    [11,23].forEach(x=>{rect(eyes,x+1,21,5,1,'o');rect(eyes,x,22,7,6,'o');rect(eyes,x+1,28,5,1,'o');rect(eyes,x+1,22,5,6,'w');});
    const pupils = node('g',{class:'ta-mascot-pupils','data-gaze-x':'0','data-gaze-y':'0'},eyes);
    [13,25].forEach(x=>{rect(pupils,x,23,3,4,'e');rect(pupils,x,23,1,1,'w');rect(pupils,x+2,26,1,1,'#777268');});
    const closed = node('g',{class:'ta-mascot-closed'},body);
    rect(closed,11,25,7,1,'o');rect(closed,23,25,7,1,'o');
    rect(body,18,30,1,1,'o');rect(body,21,30,1,1,'o');rect(body,19,31,2,1,'o');
    let reduced = false, blinkTimer = 0, reopenTimer = 0, stopped = false, pointerAttached = false, raf = 0;
    const mql = root.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = root.matchMedia('(hover: hover) and (pointer: fine)');
    function gaze(dx,dy) {
      const x = reduced ? 0 : Math.max(-1,Math.min(1,Math.round(dx)));
      const y = reduced ? 0 : Math.max(-1,Math.min(1,Math.round(dy)));
      pupils.setAttribute('transform',`translate(${x} ${y})`);
      pupils.dataset.gazeX = String(x);pupils.dataset.gazeY=String(y);
    }
    function blink() {
      if(reduced || stopped || document.hidden)return false;
      svg.dataset.blink = 'true';
      clearTimeout(reopenTimer);reopenTimer = root.setTimeout(()=>{delete svg.dataset.blink;},140);
      return true;
    }
    function scheduleBlink() {
      clearTimeout(blinkTimer);
      if(!reduced&&!stopped)blinkTimer=root.setTimeout(()=>{blink();scheduleBlink();},3400+Math.random()*2400);
    }
    function pointer(event) {
      if(event.pointerType === 'touch' || reduced || !svg.isConnected)return;
      cancelAnimationFrame(raf);
      const x=event.clientX,y=event.clientY;
      raf=requestAnimationFrame(()=>{
        const b=svg.getBoundingClientRect(),cx=b.x+b.width/2,cy=b.y+b.height*0.57;
        if(!b.width || Math.hypot(x-cx,y-cy)>480){gaze(0,0);return;}
        gaze((x-cx)/90,(y-cy)/100);
      });
    }
    function reset(){gaze(0,0);}
    function syncPointer(){
      const wanted=!reduced&&fine.matches&&!stopped;
      if(wanted&&!pointerAttached){root.addEventListener('pointermove',pointer,{passive:true});root.addEventListener('blur',reset);document.addEventListener('pointerleave',reset);pointerAttached=true;}
      if(!wanted&&pointerAttached){root.removeEventListener('pointermove',pointer);root.removeEventListener('blur',reset);document.removeEventListener('pointerleave',reset);pointerAttached=false;reset();}
    }
    function setReducedMotion(value){reduced=!!value||mql.matches;svg.dataset.reducedMotion=String(reduced);clearTimeout(reopenTimer);delete svg.dataset.blink;gaze(0,0);syncPointer();scheduleBlink();}
    const preference=()=>setReducedMotion(options.reducedMotion===true);
    const visibility=()=>{if(document.hidden){clearTimeout(blinkTimer);gaze(0,0);}else scheduleBlink();};
    mql.addEventListener('change',preference);fine.addEventListener('change',syncPointer);document.addEventListener('visibilitychange',visibility);
    preference();
    return {element:svg,gaze,blink,setReducedMotion,destroy(){stopped=true;clearTimeout(blinkTimer);clearTimeout(reopenTimer);cancelAnimationFrame(raf);syncPointer();mql.removeEventListener('change',preference);fine.removeEventListener('change',syncPointer);document.removeEventListener('visibilitychange',visibility);}};
  }
  root.ThanhAnMascot=Object.freeze({create});
})(typeof window !== 'undefined' ? window : globalThis);
