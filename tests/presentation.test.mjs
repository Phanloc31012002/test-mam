import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../widget/presentation.js',import.meta.url),'utf8');
const plain=value=>JSON.parse(JSON.stringify(value));
const microtasks=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
function fixture(){
  let now=0,id=0;
  const active=new Map(),history=new Map(),cleared=[];
  const timers={setTimeout(fn,ms){const key=id++;const record={fn,ms,at:now+ms};active.set(key,record);history.set(key,record);return key;},clearTimeout(key){cleared.push(key);active.delete(key);}};
  const root={setTimeout:timers.setTimeout.bind(timers),clearTimeout:timers.clearTimeout.bind(timers)};
  vm.runInContext(source,vm.createContext({window:root}),{filename:'presentation.js'});
  const create=(options={})=>root.ThanhAnPresentation.create({timers,...options});
  async function advance(ms){const end=now+ms;for(;;){const next=[...active].filter(([,timer])=>timer.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;now=next[1].at;active.delete(next[0]);next[1].fn();await microtasks();}now=end;await microtasks();}
  return {api:root.ThanhAnPresentation,create,timers,active,history,cleared,advance};
}
test('module and controller are frozen and default to one 320ms presentation wait',()=>{
  const f=fixture(),controller=f.create();assert.ok(Object.isFrozen(f.api));assert.ok(Object.isFrozen(controller));assert.deepEqual(plain(controller.getState()),{pending:false,destroyed:false,delayMs:320});assert.equal(f.active.size,0);
});
test('invalid delay or timer configurations fail before creating a pending wait',()=>{
  const f=fixture();for(const delayMs of [-1,NaN,Infinity,5001,'320'])assert.throws(()=>f.create({delayMs}),/delay/);
  for(const timers of [{},{setTimeout(){}},{clearTimeout(){}}])assert.throws(()=>f.create({timers}),/timers/);assert.equal(f.active.size,0);
});
test('begin waits at least 320ms and then resolves once with no remaining timer',async()=>{
  const f=fixture(),controller=f.create();let resolved=0;const pending=controller.begin().then(value=>{assert.equal(value,undefined);resolved++;});
  assert.equal(controller.getState().pending,true);assert.equal(f.active.size,1);assert.equal([...f.active.values()][0].ms,320);
  await f.advance(319);assert.equal(resolved,0);assert.equal(controller.getState().pending,true);
  await f.advance(1);await pending;assert.equal(resolved,1);assert.equal(controller.getState().pending,false);assert.equal(f.active.size,0);await f.advance(1000);assert.equal(resolved,1);
});
test('custom delay and a zero-delay timer retain the same asynchronous contract',async()=>{
  for(const delayMs of [0,100,500]){const f=fixture(),controller=f.create({delayMs});let done=false;const pending=controller.begin().then(()=>{done=true;});assert.equal(done,false);await f.advance(delayMs);await pending;assert.equal(done,true);assert.equal(f.active.size,0);}
});
test('cancel clears timer zero and resolves the pending promise immediately without waiting',async()=>{
  const f=fixture(),controller=f.create();let resolved=0;const pending=controller.begin().then(()=>resolved++);assert.equal([...f.active.keys()][0],0);
  controller.cancel();assert.equal(controller.getState().pending,false);assert.equal(f.active.size,0);assert.deepEqual(f.cleared,[0]);await pending;assert.equal(resolved,1);await f.advance(320);assert.equal(resolved,1);
});
test('a new begin resolves the previous wait and starts the minimum from the latest begin',async()=>{
  const f=fixture(),controller=f.create();let first=0,latest=0;
  const old=controller.begin().then(()=>first++);await f.advance(100);const current=controller.begin().then(()=>latest++);await old;assert.equal(first,1);assert.equal(latest,0);assert.equal(f.active.size,1);
  await f.advance(220);assert.equal(latest,0);assert.equal(controller.getState().pending,true);await f.advance(100);await current;assert.equal(latest,1);assert.equal(f.active.size,0);
});
test('an already queued stale callback cannot finish or clear the latest wait',async()=>{
  const f=fixture(),controller=f.create();let oldCount=0,newCount=0;
  const old=controller.begin().then(()=>oldCount++),stale=f.history.get(0).fn;const latest=controller.begin().then(()=>newCount++);await old;
  stale();await microtasks();assert.equal(oldCount,1);assert.equal(newCount,0);assert.equal(controller.getState().pending,true);assert.equal(f.active.size,1);assert.ok(f.active.has(1));await f.advance(320);await latest;assert.equal(newCount,1);
});
test('repeated cancellation with no pending work is harmless and schedules nothing',async()=>{
  const f=fixture(),controller=f.create();controller.cancel();controller.cancel();const pending=controller.begin();controller.cancel();controller.cancel();await pending;assert.equal(f.active.size,0);assert.equal(f.history.size,1);assert.equal(f.cleared.length,1);
});
test('destroy resolves pending work immediately and prevents all future timers',async()=>{
  const f=fixture(),controller=f.create();const pending=controller.begin(),stale=f.history.get(0).fn;controller.destroy();controller.destroy();await pending;
  assert.deepEqual(plain(controller.getState()),{pending:false,destroyed:true,delayMs:320});assert.equal(f.active.size,0);await controller.begin();controller.cancel();stale();assert.equal(f.history.size,1);assert.equal(f.cleared.length,1);
});
test('reduced-motion preferences do not skip or lengthen the fixed presentation wait',async()=>{
  for(const reducedMotion of [false,true]){const f=fixture(),controller=f.create({reducedMotion});let done=false;const pending=controller.begin().then(()=>{done=true;});await f.advance(319);assert.equal(done,false);await f.advance(1);await pending;assert.equal(done,true);assert.equal(controller.getState().delayMs,320);}
});
test('a fast lookup runs in parallel but its presentation still waits until 320ms',async()=>{
  const f=fixture(),controller=f.create();let shown=false;
  const minimum=controller.begin(),lookup=new Promise(resolve=>f.timers.setTimeout(()=>resolve('fact'),40));
  const combined=Promise.all([minimum,lookup]).then(([,fact])=>{assert.equal(fact,'fact');shown=true;});await f.advance(40);assert.equal(shown,false);await f.advance(279);assert.equal(shown,false);await f.advance(1);await combined;assert.equal(shown,true);assert.equal(f.active.size,0);
});
test('a slow lookup finishes after the existing wait without an additional 320ms delay',async()=>{
  const f=fixture(),controller=f.create();let shown=false;
  const minimum=controller.begin(),lookup=new Promise(resolve=>f.timers.setTimeout(()=>resolve('fact'),900));
  const combined=Promise.all([minimum,lookup]).then(()=>{shown=true;});await f.advance(320);assert.equal(controller.getState().pending,false);assert.equal(shown,false);assert.equal(f.active.size,1);await f.advance(580);await combined;assert.equal(shown,true);assert.equal(f.history.size,2);assert.equal(f.active.size,0);
});
test('scheduler or cancellation failures cannot leave the returned promise hanging',async()=>{
  const f=fixture(),failed=f.create({timers:{setTimeout(){throw new Error('Fake scheduler failure');},clearTimeout(){}}});await failed.begin();assert.equal(failed.getState().pending,false);
  let stale;const brokenClear=f.create({timers:{setTimeout(fn){stale=fn;return 0;},clearTimeout(){throw new Error('Fake cleanup failure');}}});const pending=brokenClear.begin();brokenClear.cancel();await pending;stale();assert.equal(brokenClear.getState().pending,false);
});
test('synchronous injected schedulers settle and clear their returned handle without leaking',async()=>{
  const f=fixture();let clears=0;const controller=f.create({timers:{setTimeout(fn){fn();return 0;},clearTimeout(){clears++;}}});await controller.begin();assert.equal(controller.getState().pending,false);assert.equal(clears,1);
});
test('presentation does not touch DOM, perform requests or store visitor data',()=>{
  assert.doesNotMatch(source,/document|fetch\(|XMLHttpRequest|localStorage|sessionStorage|navigator|console\./);
});
