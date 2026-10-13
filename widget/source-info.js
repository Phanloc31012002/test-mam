(function(root){
  'use strict';
  const FIELDS=Object.freeze(['size','material','sides','lamination','finishing','leadTime','fileRequirements']);
  const SUCCESS_KEYS='checkedAtUtc,field,kind,productId,reference,sources,text,version';
  const MAX_BODY_BYTES=16384;
  const ID_PATTERN=/^[a-z][a-z0-9-]{0,63}$/;
  function plainObject(value){return !!value&&typeof value==='object'&&!Array.isArray(value);}
  function officialSource(source){
    if(!plainObject(source)||Object.keys(source).sort().join(',')!=='provider,url'||!['thanh-an','vinh-phat'].includes(source.provider)||typeof source.url!=='string'||source.url.length>512)return null;
    try{
      const url=new URL(source.url);
      if(url.protocol!=='https:'||url.hostname!==(source.provider==='thanh-an'?'innhanhtphcm.com':'invinhphat.com')||url.port||url.username||url.password||url.search||url.hash)return null;
      return Object.freeze({provider:source.provider,url:url.href});
    }catch(_){return null;}
  }
  function validTime(value){
    if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value))return false;
    const date=new Date(value);
    if(!Number.isFinite(date.getTime()))return false;
    const [time,fraction='']=value.slice(0,-1).split('.');
    return date.toISOString()===time+'.'+fraction.padEnd(3,'0')+'Z';
  }
  function pricingText(value){
    const folded=value.normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[Đđ]/g,'d').replace(/\s+/g,' ');
    return /\d[\d\s.,]*(?:₫|\$|€|£|dong|vnd|usd|nghin|ngan|trieu|k|d)(?![a-z])/i.test(folded)||/\b(?:don gia|tong tien|giam gia|chiet khau)\b/i.test(folded);
  }
  function validateInformation(value,productId,field){
    if(!plainObject(value)||Object.keys(value).sort().join(',')!==SUCCESS_KEYS||value.version!==1||value.kind!=='information'||value.productId!==productId||value.field!==field||typeof value.text!=='string'||!value.text.trim()||value.text.length>2000||/[<>\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value.text)||pricingText(value.text)||typeof value.reference!=='boolean'||!validTime(value.checkedAtUtc)||!Array.isArray(value.sources)||value.sources.length<1||value.sources.length>8)return null;
    const sources=value.sources.map(officialSource);
    if(sources.some(source=>!source)||sources.some(source=>source.provider!==sources[0].provider)||value.reference!==sources.some(source=>source.provider==='vinh-phat'))return null;
    return Object.freeze({version:1,kind:'information',productId,field,text:value.text,sources:Object.freeze(sources),reference:value.reference,checkedAtUtc:value.checkedAtUtc});
  }
  function create(options={}){
    let endpoint;
    try{
      if(typeof options.endpoint!=='string'||!options.endpoint.trim())throw new Error();
      endpoint=new URL(options.endpoint,root.location.href);
      if(endpoint.origin!==root.location.origin||!['http:','https:'].includes(endpoint.protocol)||endpoint.username||endpoint.password||endpoint.search||endpoint.hash)throw new Error();
    }catch(_){throw new Error('Information endpoint must be same-origin');}
    if(!Array.isArray(options.productIds)||!options.productIds.length||options.productIds.length>100||options.productIds.some(id=>typeof id!=='string'||!ID_PATTERN.test(id))||new Set(options.productIds).size!==options.productIds.length)throw new Error('Information products must be an explicit inventory');
    const products=new Set(options.productIds);
    const request=options.fetchImpl||root.fetch?.bind(root);
    if(typeof request!=='function')throw new Error('Information fetch is unavailable');
    let destroyed=false,serial=0,active=null;
    function abort(){serial++;if(active)active.abort();active=null;}
    async function read(response,signal){
      if(!response?.ok||signal.aborted)return null;
      let text;
      if(response.body&&typeof response.body.getReader==='function'){
        const reader=response.body.getReader();
        const cancel=()=>{try{Promise.resolve(reader.cancel()).catch(()=>{});}catch(_){}};
        signal.addEventListener('abort',cancel,{once:true});
        try{
          const decoder=new TextDecoder('utf-8',{fatal:true});
          let bytes=0,chunks=0;text='';
          for(;;){
            const part=await reader.read();
            if(signal.aborted)return null;
            if(part.done){text+=decoder.decode();break;}
            if(!(part.value instanceof Uint8Array)||++chunks>256||(bytes+=part.value.byteLength)>MAX_BODY_BYTES){cancel();return null;}
            text+=decoder.decode(part.value,{stream:true});
          }
        }catch(_){cancel();return null;}
        finally{signal.removeEventListener('abort',cancel);try{reader.releaseLock();}catch(_){}}
      }else{
        text=await response.text();
        if(signal.aborted||typeof text!=='string'||text.length>MAX_BODY_BYTES||new TextEncoder().encode(text).byteLength>MAX_BODY_BYTES)return null;
      }
      if(signal.aborted)return null;
      return JSON.parse(text);
    }
    async function get(productId,field){
      if(destroyed||active||typeof productId!=='string'||!products.has(productId)||!FIELDS.includes(field))return null;
      const id=serial,controller=new AbortController();active=controller;
      const url=new URL(endpoint.href);url.searchParams.set('version','1');url.searchParams.set('productId',productId);url.searchParams.set('field',field);
      let stop;
      const boundary=new Promise(resolve=>{stop=()=>resolve(null);});
      controller.signal.addEventListener('abort',stop,{once:true});
      const timer=setTimeout(()=>controller.abort(),5000);
      try{
        const operation=(async()=>{
          const response=await request(url.href,{method:'GET',headers:{Accept:'application/json'},signal:controller.signal,credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',redirect:'error'});
          return await read(response,controller.signal);
        })().catch(()=>null);
        const value=await Promise.race([operation,boundary]);
        if(destroyed||controller.signal.aborted||id!==serial)return null;
        return validateInformation(value,productId,field);
      }catch(_){return null;}
      finally{clearTimeout(timer);controller.signal.removeEventListener('abort',stop);if(active===controller)active=null;}
    }
    return Object.freeze({get,abort,destroy(){if(destroyed)return;destroyed=true;abort();},getState:()=>({destroyed,pending:!!active})});
  }
  root.ThanhAnSourceInfo=Object.freeze({create,fields:FIELDS});
})(typeof window!=='undefined'?window:globalThis);
