(function(root){
  'use strict';
  function create(options={}){
    const delayMs=options.delayMs===undefined?320:options.delayMs;
    const timers=options.timers||root;
    if(!Number.isFinite(delayMs)||delayMs<0||delayMs>5000)throw new Error('Presentation delay is invalid');
    if(typeof timers.setTimeout!=='function'||typeof timers.clearTimeout!=='function')throw new Error('Presentation timers are required');
    const schedule=timers.setTimeout.bind(timers),clear=timers.clearTimeout.bind(timers);
    let pending=null,destroyed=false;
    function finish(record){
      if(record.settled)return;
      record.settled=true;
      const timer=record.timer;record.timer=null;
      if(timer!==null){try{clear(timer);}catch(_){}}
      if(pending===record)pending=null;
      record.resolve();
    }
    function cancel(){if(pending)finish(pending);}
    function begin(){
      cancel();
      if(destroyed)return Promise.resolve();
      let resolve;
      const promise=new Promise(done=>{resolve=done;});
      const record={resolve,timer:null,settled:false};pending=record;
      try{
        const timer=schedule(()=>finish(record),delayMs);
        if(record.settled){try{clear(timer);}catch(_){}}
        else record.timer=timer;
      }catch(_){finish(record);}
      return promise;
    }
    return Object.freeze({begin,cancel,destroy(){if(destroyed)return;destroyed=true;cancel();},getState:()=>({pending:pending!==null,destroyed,delayMs})});
  }
  root.ThanhAnPresentation=Object.freeze({create});
})(typeof window!=='undefined'?window:globalThis);
