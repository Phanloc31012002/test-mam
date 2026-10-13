(function(root){
  'use strict';
  const THRESHOLD=6;
  function create(options={}){
    const {host,getBounds}=options;
    const handles=[...new Set(options.handles||[])];
    const view=host?.ownerDocument?.defaultView||root;
    if(!host?.style||!host.classList||!handles.length||handles.some(handle=>!handle?.addEventListener||!handle.classList)||typeof getBounds!=='function'||!view.addEventListener)throw new Error('Drag requires a host, handles and visible bounds');
    const margin=options.margin===undefined?8:options.margin;
    if(!Number.isFinite(margin)||margin<0||margin>40)throw new Error('Drag margin is invalid');
    const originalTranslate=host.style.translate||'';
    const originalDragging=host.classList.contains('ta-dragging');
    const originalSurfaces=new Map(handles.map(handle=>[handle,handle.classList.contains('ta-drag-surface')]));
    let x=0,y=0,gesture=null,suppression=null,destroyed=false;
    function state(){return {x,y,pressed:!!gesture,dragging:!!gesture?.dragging,destroyed};}
    function rectangle(){
      try{
        const rect=getBounds();
        if(!rect||![rect.left,rect.top,rect.right,rect.bottom].every(Number.isFinite)||rect.right<=rect.left||rect.bottom<=rect.top)return null;
        return {left:rect.left-x,top:rect.top-y,right:rect.right-x,bottom:rect.bottom-y};
      }catch(_){return null;}
    }
    function viewport(){
      const vv=view.visualViewport;
      const width=vv?.width||view.innerWidth,height=vv?.height||view.innerHeight;
      const left=vv?.offsetLeft||0,top=vv?.offsetTop||0;
      if(![width,height,left,top].every(Number.isFinite)||width<=0||height<=0)return null;
      return {left:left+margin,top:top+margin,right:left+width-margin,bottom:top+height-margin};
    }
    function clampAxis(value,min,max){
      // A larger union cannot fit; keep its leading edge and drag surface reachable.
      if(min>max)return Math.round(min);
      const low=Math.ceil(min),high=Math.floor(max);
      if(low>high)return (min+max)/2;
      return Math.min(high,Math.max(low,Math.round(value)));
    }
    function position(nextX,nextY){
      const rect=rectangle(),vp=viewport();
      if(!rect||!vp)return false;
      const newX=clampAxis(nextX,vp.left-rect.left,vp.right-rect.right);
      const newY=clampAxis(nextY,vp.top-rect.top,vp.bottom-rect.bottom);
      if(newX===x&&newY===y)return false;
      x=newX;y=newY;host.style.translate=x+'px '+y+'px';
      if(typeof options.onMove==='function'){try{options.onMove(Object.freeze({x,y}));}catch(_){}}
      return true;
    }
    function restoreCursor(){if(!originalDragging)host.classList.remove('ta-dragging');}
    function release(current){
      if(current?.captured){try{current.handle.releasePointerCapture(current.id);}catch(_){}}
    }
    function cancel(){const current=gesture;gesture=null;suppression=null;restoreCursor();release(current);}
    function interactive(node){
      const tag=String(node.tagName||'').toLowerCase();
      return /^(?:button|input|textarea|select|a|summary)$/.test(tag)||node.isContentEditable===true||node.getAttribute?.('contenteditable')==='true'||node.getAttribute?.('role')==='button';
    }
    function allowedTarget(target,handle){
      let node=target;
      while(node){
        if(interactive(node)&&!node.classList?.contains('ta-drag-handle'))return false;
        if(node===handle)return true;
        node=node.parentNode;
      }
      return false;
    }
    function down(event){
      if(destroyed||gesture||event.isPrimary===false||(typeof event.button==='number'&&event.button!==0)||!Number.isFinite(event.clientX)||!Number.isFinite(event.clientY))return;
      suppression=null;
      const handle=event.currentTarget;
      if(!allowedTarget(event.target,handle))return;
      gesture={id:event.pointerId,handle,startX:event.clientX,startY:event.clientY,x,y,dragging:false,captured:false};
    }
    function move(event){
      const current=gesture;
      if(destroyed||!current||event.pointerId!==current.id||!Number.isFinite(event.clientX)||!Number.isFinite(event.clientY))return;
      const dx=event.clientX-current.startX,dy=event.clientY-current.startY;
      if(!current.dragging){
        if(dx*dx+dy*dy<THRESHOLD*THRESHOLD||!rectangle()||!viewport())return;
        current.dragging=true;host.classList.add('ta-dragging');
        try{current.handle.setPointerCapture(current.id);current.captured=true;}catch(_){}
      }
      if(event.cancelable!==false)event.preventDefault();
      position(current.x+dx,current.y+dy);
    }
    function up(event){
      const current=gesture;
      if(!current||event.pointerId!==current.id)return;
      gesture=null;restoreCursor();release(current);
      if(current.dragging){
        suppression={handle:current.handle,id:current.id,until:Date.now()+500};
        if(event.cancelable!==false)event.preventDefault();
      }
    }
    function pointerCancel(event){if(gesture&&event.pointerId===gesture.id)cancel();}
    function lost(event){if(gesture&&event.pointerId===gesture.id)cancel();}
    function click(event){
      const block=suppression;
      if(!block)return;
      if(Date.now()>block.until){suppression=null;return;}
      if(event.detail===0||(typeof event.pointerId==='number'&&event.pointerId!==block.id))return;
      const path=typeof event.composedPath==='function'?event.composedPath():null;
      const matches=path?path.includes(block.handle):(event.target===block.handle||block.handle.contains?.(event.target));
      if(!matches)return;
      suppression=null;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();
    }
    function reclamp(){if(destroyed)return false;cancel();return position(x,y);}
    function reset(){if(destroyed)return;cancel();x=0;y=0;host.style.translate=originalTranslate;}
    for(const handle of handles){handle.classList.add('ta-drag-surface');handle.addEventListener('pointerdown',down);handle.addEventListener('lostpointercapture',lost);}
    view.addEventListener('pointermove',move,{capture:true,passive:false});
    view.addEventListener('pointerup',up,true);view.addEventListener('pointercancel',pointerCancel,true);view.addEventListener('click',click,true);
    view.addEventListener('blur',cancel);view.addEventListener('resize',reclamp);
    const visual=view.visualViewport;
    visual?.addEventListener('resize',reclamp);visual?.addEventListener('scroll',reclamp);
    return Object.freeze({reclamp,reset,getState:state,destroy(){
      if(destroyed)return;reset();destroyed=true;
      for(const handle of handles){handle.removeEventListener('pointerdown',down);handle.removeEventListener('lostpointercapture',lost);if(!originalSurfaces.get(handle))handle.classList.remove('ta-drag-surface');}
      view.removeEventListener('pointermove',move,true);view.removeEventListener('pointerup',up,true);view.removeEventListener('pointercancel',pointerCancel,true);view.removeEventListener('click',click,true);
      view.removeEventListener('blur',cancel);view.removeEventListener('resize',reclamp);visual?.removeEventListener('resize',reclamp);visual?.removeEventListener('scroll',reclamp);
    }});
  }
  root.ThanhAnDrag=Object.freeze({create});
})(typeof window!=='undefined'?window:globalThis);
