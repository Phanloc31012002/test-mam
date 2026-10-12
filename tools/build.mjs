import fs from 'node:fs';
const read=name=>fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');
let html=read('index.html');
const escapeScript=text=>text.replace(/<\/script/gi,'<\\/script');
html=html.replace('<link rel="stylesheet" href="demo.css">','<style>'+read('demo.css')+'</style>');
for(const name of ['widget/policy.js','widget/mascot.js','widget/widget.js'])html=html.replace('<script defer src="'+name+'"></script>','<script>'+escapeScript(read(name))+'</script>');
const data=read('widget/data.json');const css=read('widget/widget.css');
const standalone=read('demo.js').replace("dataUrl:'widget/data.json',stylesheetUrl:'widget/widget.css'",'data:'+data+',styles:'+JSON.stringify(css));
html=html.replace('<script defer src="demo.js"></script>','<script>document.addEventListener("DOMContentLoaded",()=>{'+escapeScript(standalone)+'});</script>');
html=html.replace('<a href="tests/browser.html">Kiểm tra bản thử ↗</a>','<span>Bản thử độc lập · Không gửi nội dung chat</span>');
fs.writeFileSync(new URL('../demo-standalone.html',import.meta.url),html);
fs.mkdirSync(new URL('../wordpress/ta-mam-chat/assets',import.meta.url),{recursive:true});
for(const name of ['policy.js','mascot.js','widget.js','bootstrap.js','widget.css','data.json'])fs.copyFileSync(new URL('../widget/'+name,import.meta.url),new URL('../wordpress/ta-mam-chat/assets/'+name,import.meta.url));
console.log('Built offline demo-standalone.html and disabled WordPress plugin assets.');
// Static hosting output contains only the demo runtime and test harness source.
const publicRoot=new URL('../public/',import.meta.url);fs.mkdirSync(publicRoot,{recursive:true});
for(const name of ['index.html','demo.css','demo.js','widget/policy.js','widget/mascot.js','widget/widget.js','widget/bootstrap.js','widget/widget.css','widget/data.json','tests/browser.html','tests/browser.css','tests/browser.js']){
  const out=new URL(name,publicRoot);fs.mkdirSync(new URL('.',out),{recursive:true});fs.copyFileSync(new URL('../'+name,import.meta.url),out);
}
console.log('Static output ready in public/; no hosting deployment performed.');
