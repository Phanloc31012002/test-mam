(async function(){
  'use strict';
  const reduced=new URLSearchParams(location.search).get('motion')==='reduce';
  const mascot=window.ThanhAnMascot.create({reducedMotion:reduced});
  document.getElementById('demo-mascot').appendChild(mascot.element);
  const labels={idle:'Mầm đang nghe bạn nè!',greeting:'Chào bạn, Mầm đây!',working:'Đang tra cứu bảng giá'};
  const note=document.querySelector('.demo-art-note');
  const buttons=Array.from(document.querySelectorAll('[data-mascot-state]'));
  function displayState(state){
    mascot.setState(state);
    note.replaceChildren();const dot=document.createElement('span');dot.className='demo-note-dot';note.append(dot,document.createTextNode(labels[state]));
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mascotState===state)));
  }
  buttons.forEach(button=>button.addEventListener('click',()=>displayState(button.dataset.mascotState)));
  displayState('idle');
  try{
    const ready=await window.ThanhAnChat.mount({dataUrl:'widget/data.json',stylesheetUrl:'widget/widget.css',reducedMotion:reduced,onStateChange:displayState});
    document.querySelectorAll('[data-open-chat]').forEach(b=>b.addEventListener('click',()=>ready.open()));
    document.querySelectorAll('[data-query]').forEach(b=>b.addEventListener('click',()=>{ready.open();ready.send(b.dataset.query);}));
    if(new URLSearchParams(location.search).has('open'))ready.open();
  }catch(_){
    const error=document.getElementById('demo-error');error.hidden=false;
    error.textContent='Widget chưa tải được. Chạy bản thử qua npm start, hoặc mở demo-standalone.html. Bạn vẫn có thể xem nội dung trang.';
  }
})();
