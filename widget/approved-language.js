(function(root){
  'use strict';
  // Reviewed language routes only. This module never stores prices, slots or visitor messages.
  const CATEGORIES=Object.freeze(['namecard','catalogue','decal','flyer','bag','box','envelope','red-envelope','receipt','folder','tag','menu','wedding']);
  const INTENTS=Object.freeze(['product','services','hours','address','contact','greeting','out_of_scope','unknown']);
  const LIMITS=Object.freeze({entries:250,phraseChars:120,inputChars:500,words:20});
  const ownRecord=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.prototype.toString.call(value)==='[object Object]';
  function exactKeys(value,keys){
    if(!ownRecord(value))return false;
    const actual=Reflect.ownKeys(value);
    return actual.length===keys.length&&actual.every(key=>typeof key==='string'&&keys.includes(key)&&Object.getOwnPropertyDescriptor(value,key)?.enumerable===true&&!Object.getOwnPropertyDescriptor(value,key)?.get&&!Object.getOwnPropertyDescriptor(value,key)?.set);
  }
  function normalize(value){
    if(typeof value!=='string')return '';
    return value.normalize('NFKC').normalize('NFD').replace(/\p{M}/gu,'').replace(/đ/gi,'d').toLowerCase().replace(/[^\p{L}]+/gu,' ').trim();
  }
  function safePhrase(value,maxLength=LIMITS.phraseChars){
    if(typeof value!=='string'||!value.trim()||value.length>maxLength)return false;
    const text=value.normalize('NFKC');
    if(/[\p{Cc}\p{Cf}\p{N}\p{Sc}]/u.test(text)||!/^[\p{L}\p{M}\s.,!?;:'"“”‘’()\-–—]+$/u.test(text))return false;
    // Registration is intentionally conservative; rejected text is never retained.
    if(/[\p{L}][\p{L}-]*\.[\p{L}]{2,12}\b/u.test(text))return false;
    const folded=normalize(text);
    if(!folded||folded.length>LIMITS.phraseChars||folded.split(' ').length>LIMITS.words)return false;
    if(/\b(?:http|https|www|javascript|script|system|developer|jailbreak|ignore|override|bypass|prompt|instructions|password|confidential|api|token|secret|email|gmail|cccd|cmnd|iban|swift|vnd|vndong|gsm|mm|cm|offset|digital|kraft|fort|ivory|bristol|briston|couche|carbonless)\b/.test(folded))return false;
    if(/\b(?:bo qua|quy tac|chinh sach|doi gia|giam gia|chiet khau|khuyen mai|mien phi|tinh tong|tong tien|mat khau|bi mat|so tai khoan|so dien thoai|dien thoai cua|dia chi nha|so nha|nha toi|nha minh|toi song o|minh song o|toi ten|minh ten|ho ten|ten toi|ten la|kho giay|dinh luong|kich thuoc|can mang|ep kim|ep nhu|be hinh|dong kim|dong keo|gia cong|so trang|so mat|so luong)\b/.test(folded))return false;
    // Keep generic address questions and "quần áo" valid; reject explicit named locations.
    if(/\b(?:đường|phường|quận|duong|phuong|quan)\s+\p{Lu}[\p{L}\p{M}]+/u.test(text)||/\b(?:duong|phuong|quan)\s+(?:nguyen|le|tran|pham|ly|vo|binh|tan|hiep|thanh|go|phu|cho)\b/.test(folded))return false;
    if(/\b(?:mot|hai|ba|bon|nam|sau|bay|tam|chin|muoi|tram|nghin|ngan|trieu|ty|one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|dozen)\s+(?:cuon|quyen|hop|cai|con|to|tam|tem|tag|bo|chiec|trang|mat|lien|dong)\b/.test(folded))return false;
    return true;
  }
  function mappingKey(entry){return JSON.stringify([normalize(entry?.phrase),entry?.intent,entry?.categoryId]);}
  function validTimestamp(value){
    if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value))return false;
    const time=Date.parse(value);
    return Number.isFinite(time)&&new Date(time).toISOString()===(value.includes('.')?value:value.replace('Z','.000Z'));
  }
  function validateData(data){
    if(!exactKeys(data,['schemaVersion','entries'])||data.schemaVersion!==1||!Array.isArray(data.entries)||data.entries.length>LIMITS.entries)throw new TypeError('Bộ nhớ cách diễn đạt không đúng định dạng.');
    const ids=new Set(),phrases=new Set();
    for(const entry of data.entries){
      if(!exactKeys(entry,['id','phrase','intent','categoryId','status','author','review'])||typeof entry.id!=='string'||!/^[a-z][a-z0-9-]{2,63}$/.test(entry.id)||ids.has(entry.id)||!safePhrase(entry.phrase)||!INTENTS.includes(entry.intent)||(entry.intent==='product'?!CATEGORIES.includes(entry.categoryId):entry.categoryId!==null)||!['pending','approved','disabled'].includes(entry.status)||!['assistant','owner'].includes(entry.author))throw new TypeError('Cách diễn đạt chứa dữ liệu hoặc trường không được phép.');
      const key=normalize(entry.phrase);
      if(phrases.has(key))throw new TypeError('Cách diễn đạt trùng hoặc xung đột sau chuẩn hóa.');
      if(entry.status==='pending'){
        if(entry.review!==null)throw new TypeError('Mục chờ duyệt không được mang xác nhận chủ nhà in.');
      }else{
        const review=entry.review;
        if(!exactKeys(review,['decision','byRole','at','mappingKey'])||review.decision!==entry.status||review.byRole!=='owner'||!validTimestamp(review.at)||review.mappingKey!==mappingKey(entry))throw new TypeError('Xác nhận duyệt không khớp với cách diễn đạt hiện tại.');
      }
      ids.add(entry.id);phrases.add(key);
    }
    return data;
  }
  function create(data){
    validateData(data);
    const routes=new Map(),counts={total:data.entries.length,pending:0,approved:0,disabled:0};
    for(const entry of data.entries){
      counts[entry.status]++;
      if(entry.status==='approved')routes.set(normalize(entry.phrase),Object.freeze({intent:entry.intent,categoryId:entry.categoryId}));
    }
    Object.freeze(counts);
    return Object.freeze({
      lookup(text){if(!safePhrase(text,LIMITS.inputChars))return null;return routes.get(normalize(text))||null;},
      getCounts:()=>counts
    });
  }
  root.ThanhAnApprovedLanguage=Object.freeze({create,validateData,normalize,mappingKey,categories:CATEGORIES,intents:INTENTS,limits:LIMITS});
})(typeof window!=='undefined'?window:globalThis);
