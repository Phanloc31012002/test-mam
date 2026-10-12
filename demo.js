(async function(){
  'use strict';
  const reduced=new URLSearchParams(location.search).get('motion')==='reduce';
  try{
    const ready=await window.ThanhAnChat.mount({dataUrl:'widget/data.json',stylesheetUrl:'widget/widget.css',reducedMotion:reduced});
    document.querySelectorAll('[data-open-chat]').forEach(button=>button.addEventListener('click',()=>ready.open()));
    document.querySelectorAll('[data-query]').forEach(button=>button.addEventListener('click',()=>{ready.open();ready.send(button.dataset.query);}));
    if(new URLSearchParams(location.search).has('open'))ready.open();
  }catch(_){
    const error=document.getElementById('demo-error');error.hidden=false;
    error.textContent='Widget chưa tải được. Chạy bản thử qua npm start, hoặc mở demo-standalone.html. Bạn vẫn có thể xem nội dung trang.';
  }
})();
