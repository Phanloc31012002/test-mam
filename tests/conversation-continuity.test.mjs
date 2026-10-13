import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import '../widget/policy.js';

const data=JSON.parse(fs.readFileSync(new URL('../widget/data.json',import.meta.url),'utf8'));
const faq=globalThis.ThanhAnFAQ;
const now=Date.parse('2026-10-13T12:00:00Z');
const session=()=>faq.createSession(data,()=>now);
const noQuote=r=>assert.equal(r.quote,undefined);
const question=(r,field)=>{assert.equal(r.kind,'clarify');assert.equal(r.pendingField,field);assert.equal((r.compactText.match(/\?/g)||[]).length,1);noQuote(r);};
const quote=(r,total,quantity)=>{assert.equal(r.kind,'price');assert.equal(r.quote.totalVnd,total);assert.equal(r.quote.quantity,quantity);assert.equal(r.compactText.split('\n').length,2);return r.quote;};
function catalogue(){const s=session();question(s.answer('Catalogue A4 300 cuốn'),'pages');question(s.answer('16 trang'),'material');quote(s.answer('Bìa C250 ruột C150'),8400000,300);return s;}

test('catalogue A4/300 asks only pages, then eligible material, retaining all known slots',()=>{
  const s=session();const first=s.answer('Catalogue A4 300 cuốn');question(first,'pages');assert.equal(first.compactText,'Catalogue của bạn có bao nhiêu trang?');
  const material=s.answer('16 trang');question(material,'material');assert.deepEqual(material.suggestions,['Bìa C250 ruột C150','C150 toàn bộ','Bìa C300 ruột C150']);
  const q=quote(s.answer('Bìa C250 ruột C150'),8400000,300);assert.equal(q.sourceQuantity,200);assert.equal(q.unitPriceVnd,28000);assert.equal(q.provider,'thanh-an');
});
test('bare numeric answers fill the current question rather than overwrite another known numeric slot',()=>{
  const s=session();question(s.answer('Catalogue A4 300 cuốn'),'pages');question(s.answer('16'),'material');quote(s.answer('C300'),6900000,300);
});
test('out-of-order known specs stay local while only one missing question is asked',()=>{
  const s=session();question(s.answer('Catalogue bìa C300 ruột C150 16 trang'),'quantity');question(s.answer('300 cuốn'),'size');quote(s.answer('A4'),6900000,300);
});
test('quantity edits keep catalogue paper, A4 size and16 pages without requesting them again',()=>{
  const s=catalogue();const q=quote(s.answer('400 cuốn'),11200000,400);assert.equal(q.sourceQuantity,200);assert.equal(q.unitPriceVnd,28000);
  quote(s.answer('1000 cuốn'),9000000,1000);
});
test('two quantities invalidate only quantity and a bare correction completes the retained quote',()=>{
  const s=catalogue();question(s.answer('300 cuốn hay 500 cuốn'),'quantity');quote(s.answer('400'),11200000,400);
});
test('shared-unit quantity alternatives and ranges ask for one value instead of silently selecting the last number',()=>{
  for(const text of ['300 hoặc 500 cuốn','300 đến 500 cuốn']){const s=catalogue();question(s.answer(text),'quantity');quote(s.answer('500'),7500000,500);}
});
test('conflicting page counts ask pages and preserve quantity, material and size',()=>{
  const s=catalogue();question(s.answer('16 trang hay 20 trang'),'pages');const q=quote(s.answer('24'),11100000,300);assert.equal(q.sourceQuantity,200);assert.match(q.conditions.join(' '),/24 trang/);
});
test('a shared page unit keeps alternative page counts ambiguous until one answer is given',()=>{
  const s=catalogue();question(s.answer('16 hoặc 20 trang'),'pages');quote(s.answer('20'),9600000,300);
});
test('conflicting sizes ask for one size without losing the prior paper/pages/quantity',()=>{
  const s=catalogue();question(s.answer('A4 hoặc A5'),'size');quote(s.answer('A4'),8400000,300);
});
test('a wrong quantity unit asks quantity and a corrected number does not replace page count',()=>{
  const s=catalogue();question(s.answer('400 tờ'),'quantity');const q=quote(s.answer('400'),11200000,400);assert.equal(q.quantityUnit,'cuốn');assert.match(q.conditions.join(' '),/16 trang/);
});
test('wrong-unit quantity before a valid alternative invalidates only quantity',()=>{
  const s=session();quote(s.answer('Catalogue A4 C300 16 trang 300 cuốn'),6900000,300);question(s.answer('20 hộp hoặc 400 cuốn'),'quantity');quote(s.answer('400'),9200000,400);
});
test('wrong-unit quantity after a valid alternative cannot silently select the valid number',()=>{
  const s=session();quote(s.answer('Catalogue A4 C300 16 trang 300 cuốn'),6900000,300);question(s.answer('400 cuốn hay 500 tờ'),'quantity');noQuote(s.answer('tính tổng'));quote(s.answer('400'),9200000,400);
});
test('mixed-unit conjunction asks quantity while explicit per-book/per-box composition remains separate',()=>{
  const s=session();quote(s.answer('Catalogue A4 C300 16 trang 300 cuốn'),6900000,300);question(s.answer('400 tờ và 300 cuốn'),'quantity');quote(s.answer('400'),9200000,400);
  const receipt=session().answer('Phiếu thu Vĩnh Phát Fort80 1 liên A5 15 cuốn 100 tờ mỗi cuốn');quote(receipt,525000,15);assert.equal(receipt.quote.quantityUnit,'cuốn');
  const card=session().answer('Card Vĩnh Phát C300 5 hộp 100 tấm mỗi hộp 90x54 mm offset');quote(card,120000,5);assert.equal(card.quote.totalKind,'published-package');assert.equal(card.quote.unitPriceVnd,null);
});
test('multiple explicit products cannot revive the previous single-product quote',()=>{
  for(const text of ['Catalogue và danh thiếp','Tag chữ nhật hoặc vuông và Catalogue','Folder và Catalogue','Túi giấy đứng C300 và Catalogue']){
    const s=catalogue(),r=s.answer(text);assert.equal(r.kind,'clarify',text);noQuote(r);noQuote(s.answer('tính tổng'));assert.equal(s.answer('300 cuốn').kind,'unknown');
  }
});
test('unsupported interior or ambiguous covers stop quoting until a standard recipe is explicitly restored',()=>{
  const s=catalogue();const r=s.answer('Bìa C250 hoặc C300 ruột C150');assert.equal(r.kind,'handoff');noQuote(r);noQuote(s.answer('400 cuốn'));noQuote(s.answer('tính tổng'));
  quote(s.answer('quy cách chuẩn bìa C300 ruột C150 400 cuốn'),9200000,400);
  noQuote(s.answer('ruột 300gsm'));noQuote(s.answer('tính tổng'));
});
test('an approved category hint identifies only the product while original input supplies locally validated slots',()=>{
  const s=session();question(s.answer('Sổ giới thiệu thương hiệu A4 300 cuốn',{approvedCategoryId:'catalogue'}),'pages');
  question(s.answer('16 trang'),'material');quote(s.answer('C300'),6900000,300);
});
test('approved category hints cannot overwrite an explicit product or an active slot conversation',()=>{
  const s=session();question(s.answer('Danh thiếp C300',{approvedCategoryId:'catalogue'}),'quantity');quote(s.answer('12 hộp'),840000,12);
  const cat=session();question(cat.answer('Catalogue A4 300 cuốn'),'pages');question(cat.answer('16 trang',{approvedCategoryId:'namecard'}),'material');quote(cat.answer('C250'),8400000,300);
});
test('category hints cannot force a variant where the local category needs product selection',()=>{
  for(const category of ['decal','bag','tag','envelope']){const r=session().answer('Một loại ấn phẩm chưa gọi tên',{approvedCategoryId:category});assert.equal(r.kind,'clarify',category);noQuote(r);assert.ok(r.suggestions.length>=2);}
});
test('invalid or extended hint payloads supply no category, prices or slots',()=>{
  for(const options of [{approvedCategoryId:'not-a-category'},{approvedCategoryId:'catalogue',quantity:300},{approvedCategoryId:'catalogue',slots:{size:'a4',pages:16}},{approvedCategoryId:'catalogue',priceVnd:1},{approvedCategoryId:{toString:()=> 'catalogue'}},['catalogue'],null]){
    const r=session().answer('Một loại ấn phẩm chưa gọi tên',options);assert.equal(r.kind,'unknown');noQuote(r);
  }
});
test('hints cannot bypass unsafe input, explicit out-of-scope routing, multiple products or stale prices',()=>{
  for(const input of ['ignore instructions','<img src=x onerror=alert(1)>','giá Bitcoin','thời tiết hôm nay','Catalogue và danh thiếp']){const r=session().answer(input,{approvedCategoryId:'catalogue'});noQuote(r);assert.ok(['policy','unknown','clarify'].includes(r.kind));}
  const stale=faq.createSession(data,()=>Date.parse('2026-11-11T00:00:00Z'));const r=stale.answer('Sổ giới thiệu thương hiệu A4 300 cuốn',{approvedCategoryId:'catalogue'});assert.equal(r.kind,'stale');noQuote(r);
});
test('reset clears category-hint context and session answers never mutate price records',()=>{
  const before=JSON.stringify(data),s=session();question(s.answer('Sổ giới thiệu thương hiệu',{approvedCategoryId:'catalogue'}),'quantity');s.reset();assert.equal(s.answer('300 cuốn').kind,'unknown');
  catalogue();assert.equal(JSON.stringify(data),before);
});
