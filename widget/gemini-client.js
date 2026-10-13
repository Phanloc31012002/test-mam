(function(root){
  'use strict';
  const PRIVACY_VERSION='google-free-v1';
  const CATEGORIES=Object.freeze(['namecard','catalogue','decal','flyer','bag','box','envelope','red-envelope','receipt','folder','tag','menu','wedding']);
  const INTENTS=Object.freeze(['product','services','hours','address','contact','greeting','out_of_scope','unknown']);
  function sensitive(value){
    const text=String(value).normalize('NFKC');
    const folded=text.replace(/[\u200B-\u200D\uFEFF]/g,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d');
    return /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(folded)||/(?:\+?84|0)[\s().-]*(?:\d[\s().-]*){8,10}\b/.test(folded)||/\b\d{9,}\b/.test(folded)||/AIza[\w-]{20,}|\b(?:sk-|ghp_|gho_|github_pat_)[\w-]{12,}/i.test(folded)||/(?:api[ _-]?key|password|mat khau|token|can cuoc|so tai khoan|dia chi nha|so dien thoai|confidential|bi mat)/i.test(folded)||/\b\d{1,5}(?:\/\d{1,5})?\s+(?:duong|nguyen|le|tran|pham|quan|phuong)\b/i.test(folded)||/(?:ignore|override|bypass|system prompt|developer message|jailbreak|bo qua|tiet lo|reveal).{0,70}(?:instructions|rules|policy|secret|key|prompt|quy tac|huong dan)/i.test(folded)||/[<>]/.test(text);
  }
  function validateSuggestion(value){
    if(!value||typeof value!=='object'||Array.isArray(value))return null;
    const keys=Object.keys(value).sort().join(',');
    if(value.kind==='fallback')return null;
    if(keys!=='categoryId,intent,kind,version'||value.version!==1||value.kind!=='suggestion'||!INTENTS.includes(value.intent))return null;
    if(value.intent==='product'?!CATEGORIES.includes(value.categoryId):value.categoryId!==null)return null;
    return Object.freeze({intent:value.intent,categoryId:value.categoryId});
  }
  function create(options={}){
    const base=new URL(options.endpoint,root.location.href);
    if(base.origin!==root.location.origin||!['http:','https:'].includes(base.protocol)||base.username||base.password||base.search||base.hash)throw new Error('AI endpoint must be same-origin');
    const request=options.fetchImpl||root.fetch.bind(root);
    const clock=options.now||Date.now;
    const gapMs=10000;
    let enabled=false,checked=false,consent=false,destroyed=false,lastCall=-Infinity,serial=0,active=null;
    function abort(){serial++;if(active)active.abort();active=null;}
    async function read(path,init,timeoutMs){
      const controller=new AbortController();active=controller;
      let stop;
      const boundary=new Promise(resolve=>{stop=()=>resolve(null);});
      controller.signal.addEventListener('abort',stop,{once:true});
      const timer=setTimeout(()=>controller.abort(),timeoutMs);
      try{
        const operation=(async()=>{
          const response=await request(path,{...init,signal:controller.signal,credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',redirect:'error'});
          if(controller.signal.aborted||!response.ok)return null;
          const text=await response.text();
          if(controller.signal.aborted||text.length>2048)return null;
          return JSON.parse(text);
        })().catch(()=>null);
        return await Promise.race([operation,boundary]);
      }catch(_){return null;}
      finally{clearTimeout(timer);controller.signal.removeEventListener('abort',stop);if(active===controller)active=null;}
    }
    async function check(){
      if(destroyed||checked)return enabled;
      checked=true;const id=serial;
      const value=await read(base.href,{method:'GET',headers:{Accept:'application/json'}},5000);
      if(destroyed||id!==serial)return false;
      enabled=!!(value&&Object.keys(value).sort().join(',')==='enabled,privacyVersion,version'&&value.version===1&&value.enabled===true&&value.privacyVersion===PRIVACY_VERSION);
      return enabled;
    }
    function setConsent(value){abort();consent=!destroyed&&enabled&&value===true;return consent;}
    async function suggest(message){
      const text=String(message||'').trim();
      if(destroyed||!enabled||!consent||active||!text||text.length>500||sensitive(text)||clock()-lastCall<gapMs)return null;
      lastCall=clock();const id=serial;
      const value=await read(base.href,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({version:1,message:text,consent:PRIVACY_VERSION,adult:true})},7000);
      if(destroyed||id!==serial||!consent)return null;
      return validateSuggestion(value);
    }
    return Object.freeze({check,setConsent,suggest,abort,destroy(){destroyed=true;enabled=false;consent=false;abort();},getState:()=>({enabled,checked,consent,destroyed,pending:!!active})});
  }
  root.ThanhAnGemini=Object.freeze({create,validateSuggestion,sensitive,privacyVersion:PRIVACY_VERSION,categories:CATEGORIES});
})(typeof window!=='undefined'?window:globalThis);
