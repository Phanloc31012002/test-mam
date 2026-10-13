import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../widget/drag.js',import.meta.url),'utf8');
class Target{
  constructor(){this.listeners=new Map();}
  addEventListener(name,fn){const list=this.listeners.get(name)||[];list.push(fn);this.listeners.set(name,list);}
  removeEventListener(name,fn){this.listeners.set(name,(this.listeners.get(name)||[]).filter(item=>item!==fn));}
  emit(name,values={}){const event={target:this,currentTarget:this,pointerId:1,button:0,isPrimary:true,clientX:0,clientY:0,cancelable:true,detail:1,preventDefault(){this.defaultPrevented=true;},stopPropagation(){this.stopped=true;},stopImmediatePropagation(){this.immediate=true;},...values};for(const fn of [...(this.listeners.get(name)||[])]){fn(event);if(event.immediate)break;}return event;}
  count(){return [...this.listeners.values()].reduce((n,list)=>n+list.length,0);}
}
class Element extends Target{
  constructor(tag='div',parent=null){super();this.tagName=tag.toUpperCase();this.parentNode=parent;this.style={translate:'',color:'green',right:'24px',bottom:'20px',transform:'rotate(0deg)'};this.classes=new Set();this.classList={add:name=>this.classes.add(name),remove:name=>this.classes.delete(name),contains:name=>this.classes.has(name)};this.captures=[];this.releases=[];this.attributes={};}
  setPointerCapture(id){this.captures.push(id);}
  releasePointerCapture(id){this.releases.push(id);}
  getAttribute(name){return this.attributes[name]??null;}
  contains(target){for(let node=target;node;node=node.parentNode)if(node===this)return true;return false;}
}
const plain=value=>JSON.parse(JSON.stringify(value));
function fixture({visual=true,rect={left:600,top:200,right:900,bottom:700}}={}){
  const view=new Target();view.innerWidth=1000;view.innerHeight=800;
  const vv=new Target();Object.assign(vv,{width:1000,height:800,offsetLeft:0,offsetTop:0});if(visual)view.visualViewport=vv;
  const host=new Element();host.ownerDocument={defaultView:view};host.getBoundingClientRect=()=>({left:900,top:700,right:900,bottom:700,height:0});
  const header=new Element('div',host),launcher=new Element('button',host),mascot=new Element('div',launcher),canvas=new Element('canvas',mascot);
  let layout={...rect},boundsCalls=0,now=0;
  function getBounds(){boundsCalls++;const match=host.style.translate.match(/^(-?[\d.]+)px (-?[\d.]+)px$/),x=match?Number(match[1]):0,y=match?Number(match[2]):0;return {left:layout.left+x,top:layout.top+y,right:layout.right+x,bottom:layout.bottom+y};}
  const context=vm.createContext({window:view,Date:{now:()=>now}});vm.runInContext(source,context,{filename:'drag.js'});
  const create=(options={})=>view.ThanhAnDrag.create({host,handles:[header,mascot],getBounds,...options});
  const down=(handle=header,target=handle,values={})=>handle.emit('pointerdown',{target,...values});
  const move=values=>view.emit('pointermove',values),up=values=>view.emit('pointerup',values);
  const click=(handle=header,values={})=>view.emit('click',{target:handle,composedPath:()=>[handle,host,view],...values});
  return {view,vv,host,header,launcher,mascot,canvas,create,down,move,up,click,getBounds,setRect:value=>{layout={...value};},advance:ms=>{now+=ms;},boundsCalls:()=>boundsCalls};
}
test('module/controller are frozen and use visible union bounds instead of the zero-height host',()=>{
  const f=fixture(),controller=f.create();assert.ok(Object.isFrozen(f.view.ThanhAnDrag));assert.ok(Object.isFrozen(controller));assert.deepEqual(plain(controller.getState()),{x:0,y:0,pressed:false,dragging:false,destroyed:false});
  assert.equal(controller.reclamp(),false);assert.ok(f.boundsCalls()>0);assert.equal(f.host.style.translate,'');
});
test('configuration requires a host, handles, bounds and a finite margin',()=>{
  const f=fixture();for(const options of [{host:null},{handles:[]},{getBounds:null},{margin:-1},{margin:Infinity},{margin:41}])assert.throws(()=>f.create(options));assert.doesNotThrow(()=>f.create({margin:12}));
});
test('a tap or movement below six pixels retains the normal click and never moves',()=>{
  const f=fixture(),controller=f.create();f.down();const move=f.move({clientX:5,clientY:0});assert.equal(move.defaultPrevented,undefined);f.up();const click=f.click();assert.equal(click.defaultPrevented,undefined);assert.equal(f.host.style.translate,'');assert.equal(controller.getState().pressed,false);
});
test('six pixels activates pointer drag and moves the whole host without touching existing layout/transforms',()=>{
  const f=fixture(),controller=f.create();f.down();const moved=f.move({clientX:6,clientY:0});assert.equal(moved.defaultPrevented,true);assert.equal(f.host.style.translate,'6px 0px');assert.equal(f.host.style.transform,'rotate(0deg)');assert.equal(f.host.style.right,'24px');assert.equal(f.host.style.bottom,'20px');assert.deepEqual(f.header.captures,[1]);assert.equal(controller.getState().dragging,true);
});
test('threshold is distance-based and subpixel pointer movements snap to CSS pixels',()=>{
  const f=fixture();f.create();f.down();f.move({clientX:4.3,clientY:4.3});assert.equal(f.host.style.translate,'4px 4px');
});
test('mouse, touch and pen all drag with matching primary pointer identifiers',()=>{
  for(const pointerType of ['mouse','touch','pen']){const f=fixture(),controller=f.create();f.down(f.header,f.header,{pointerType,pointerId:7});f.move({pointerType,pointerId:7,clientX:40,clientY:20});assert.deepEqual(plain(controller.getState()).x,40);f.up({pointerId:7});assert.deepEqual(f.header.releases,[7]);}
});
test('right click, secondary touch and mismatched pointers are ignored',()=>{
  const f=fixture(),controller=f.create();f.down(f.header,f.header,{button:2});f.move({clientX:50});assert.equal(controller.getState().pressed,false);f.down(f.header,f.header,{isPrimary:false});assert.equal(controller.getState().pressed,false);
  f.down();f.move({pointerId:2,clientX:50});f.up({pointerId:2});assert.equal(controller.getState().dragging,false);assert.equal(controller.getState().pressed,true);f.up();
});
test('header interactive descendants keep their click/input behavior unless explicitly designated',()=>{
  for(const tag of ['button','input','textarea','select','a','summary']){const f=fixture(),controller=f.create(),control=new Element(tag,f.header),child=new Element('span',control);f.down(f.header,child);f.move({clientX:50});assert.equal(controller.getState().pressed,false,tag);assert.equal(f.host.style.translate,'');}
  const f=fixture(),controller=f.create(),editable=new Element('div',f.header);editable.isContentEditable=true;f.down(f.header,editable);assert.equal(controller.getState().pressed,false);
});
test('an explicitly designated header button may drag but a tap still works',()=>{
  const f=fixture(),controller=f.create(),button=new Element('button',f.header);button.classList.add('ta-drag-handle');f.down(f.header,button);f.up();assert.equal(f.click(f.header).defaultPrevented,undefined);
  f.down(f.header,button);f.move({clientX:30});assert.equal(controller.getState().x,30);
});
test('the mascot remains draggable inside a launcher button ancestor outside its handle',()=>{
  const f=fixture(),controller=f.create();f.down(f.mascot,f.canvas);f.move({clientX:-40});assert.equal(controller.getState().x,-40);assert.deepEqual(f.mascot.captures,[1]);
});
test('a real drag suppresses its click exactly once without blocking keyboard activation',()=>{
  const f=fixture();f.create();f.down();f.move({clientX:30});f.up();assert.equal(f.click(f.header,{detail:0}).defaultPrevented,undefined);
  const blocked=f.click();assert.equal(blocked.defaultPrevented,true);assert.equal(blocked.stopped,true);assert.equal(blocked.immediate,true);assert.equal(f.click().defaultPrevented,undefined);
});
test('a later independent click or a click elsewhere on the website is not suppressed',()=>{
  const f=fixture();f.create();f.down();f.move({clientX:30});f.up();const outside=new Element('button');assert.equal(f.click(outside).defaultPrevented,undefined);f.advance(501);assert.equal(f.click().defaultPrevented,undefined);
});
test('a fresh tap on an excluded header control clears the old drag suppression',()=>{
  const f=fixture(),controller=f.create(),close=new Element('button',f.header);f.down();f.move({clientX:30});f.up();
  f.down(f.header,close);assert.equal(controller.getState().pressed,false);
  const click=f.view.emit('click',{target:close,composedPath:()=>[close,f.header,f.host,f.view]});assert.equal(click.defaultPrevented,undefined);
});
test('visible union clamps to all four viewport edges with an eight-pixel margin',()=>{
  const f=fixture();f.create();f.down();f.move({clientX:10000,clientY:10000});assert.deepEqual(f.getBounds(),{left:692,top:292,right:992,bottom:792});f.move({clientX:-10000,clientY:-10000});assert.deepEqual(f.getBounds(),{left:8,top:8,right:308,bottom:508});
});
test('opening or closing changes the union and reclamp uses the new dimensions',()=>{
  const f=fixture({rect:{left:850,top:650,right:990,bottom:790}}),controller=f.create();controller.reclamp();f.setRect({left:550,top:100,right:1050,bottom:780});controller.reclamp();assert.equal(f.getBounds().right,992);assert.equal(f.getBounds().left,492);
  f.setRect({left:850,top:650,right:990,bottom:790});controller.reclamp();assert.ok(f.getBounds().left>=8);assert.ok(f.getBounds().right<=992);
});
test('window resize reclamps and safely ends an active pointer gesture',()=>{
  const f=fixture({visual:false}),controller=f.create();f.down();f.move({clientX:20});f.view.innerWidth=320;f.view.innerHeight=600;f.view.emit('resize');assert.equal(controller.getState().pressed,false);assert.equal(controller.getState().dragging,false);assert.equal(f.getBounds().right,312);assert.equal(f.getBounds().bottom,592);assert.deepEqual(f.header.releases,[1]);
});
test('visual viewport keyboard resize and scroll include the viewport offset',()=>{
  const f=fixture({rect:{left:200,top:100,right:500,bottom:400}});f.create();Object.assign(f.vv,{width:400,height:320,offsetLeft:50,offsetTop:150});f.vv.emit('resize');assert.ok(f.getBounds().left>=58);assert.ok(f.getBounds().right<=442);assert.ok(f.getBounds().top>=158);assert.ok(f.getBounds().bottom<=462);
  f.vv.offsetTop=250;f.vv.emit('scroll');assert.equal(f.getBounds().top,258);
});
test('an oversized union keeps its leading edge reachable without scaling or changing its size',()=>{
  const f=fixture({rect:{left:200,top:200,right:1400,bottom:1200}}),controller=f.create();controller.reclamp();assert.deepEqual(f.getBounds(),{left:8,top:8,right:1208,bottom:1008});assert.equal(f.host.style.transform,'rotate(0deg)');
});
test('cancel, lost capture and blur clear gesture/capture/click suppression while preserving position',()=>{
  for(const kind of ['pointercancel','lostpointercapture','blur']){const f=fixture(),controller=f.create();f.down();f.move({clientX:25});(kind==='lostpointercapture'?f.header:f.view).emit(kind);assert.equal(controller.getState().pressed,false);assert.equal(controller.getState().dragging,false);assert.equal(controller.getState().x,25);assert.equal(f.host.classList.contains('ta-dragging'),false);assert.equal(f.click().defaultPrevented,undefined);assert.deepEqual(f.header.releases,[1]);}
});
test('reset clears only the translation and restores the original CSS anchor',()=>{
  const f=fixture(),controller=f.create();const before={...f.host.style};f.down();f.move({clientX:25,clientY:-20});controller.reset();assert.deepEqual(f.host.style,before);assert.deepEqual(plain(controller.getState()),{x:0,y:0,pressed:false,dragging:false,destroyed:false});
});
test('invalid visible bounds never move the host or prevent an ordinary click',()=>{
  for(const getBounds of [()=>null,()=>({left:0,top:0,right:0,bottom:0}),()=>({left:NaN,top:0,right:10,bottom:10}),()=>{throw new Error('Detached fake node');}]){const f=fixture(),controller=f.create({getBounds});assert.equal(controller.reclamp(),false);f.down();f.move({clientX:50});f.up();assert.equal(f.host.style.translate,'');assert.equal(f.click().defaultPrevented,undefined);}
});
test('pointer capture failure still uses window pointer events and releases cleanly',()=>{
  const f=fixture(),controller=f.create();f.header.setPointerCapture=()=>{throw new Error('Fake capture unavailable');};f.down();f.move({clientX:25});assert.equal(controller.getState().x,25);f.up();assert.equal(controller.getState().pressed,false);
});
test('destroy restores styles/classes, removes all listeners and disables subsequent events',()=>{
  const f=fixture();f.mascot.classList.add('ta-drag-surface');const controller=f.create();f.down();f.move({clientX:25});controller.destroy();controller.destroy();
  assert.equal(f.host.style.translate,'');assert.equal(f.header.classList.contains('ta-drag-surface'),false);assert.equal(f.mascot.classList.contains('ta-drag-surface'),true);assert.equal(f.view.count(),0);assert.equal(f.vv.count(),0);assert.equal(f.header.count(),0);assert.equal(f.mascot.count(),0);
  f.down();f.move({clientX:50});assert.equal(f.host.style.translate,'');assert.equal(controller.reclamp(),false);assert.equal(controller.getState().destroyed,true);
});
test('dragging adds no typing/activity events or persistent visitor data',()=>{
  assert.doesNotMatch(source,/dispatchEvent|localStorage|sessionStorage|fetch\(|setActivity|keepWorking/);
});
