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
  const s=session();question(s.answer('Danh thiếp C300',{approvedCategoryId:'catalogue'}),'printing');question(s.answer('In nhanh'),'quantity');quote(s.answer('12 hộp'),840000,12);
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
test('generic card printing choices come first while already supplied quantity and paper survive the choice',()=>{
  const s=session(),r=s.answer('Danh thiếp C300 12 hộp');question(r,'printing');assert.equal(r.compactText,'Bạn chọn in offset hay in nhanh?');assert.deepEqual(r.suggestions,['In offset','In nhanh']);
  const q=quote(s.answer('In nhanh'),840000,12);assert.equal(q.provider,'thanh-an');assert.equal(q.sourceQuantity,10);assert.equal(q.unitPriceVnd,70000);
});
test('explicit fast-print methods skip printing choice and keep the original C300 owner-tier prices',()=>{
  for(const method of ['in nhanh','in nhanh kỹ thuật số','kỹ thuật số','digital','KTS']){const r=session().answer('Danh thiếp '+method+' C300 12 hộp');const q=quote(r,840000,12);assert.equal(q.provider,'thanh-an');assert.equal(q.sourceQuantity,10);}
});
test('method selection remains one question per turn when generic card has no other slots',()=>{
  const s=session();question(s.answer('Danh thiếp'),'printing');question(s.answer('In nhanh'),'quantity');question(s.answer('12 hộp'),'material');quote(s.answer('C300'),840000,12);
});
test('a quantity supplied while printing is pending is retained without silently selecting a method',()=>{
  const s=session();question(s.answer('Danh thiếp C300'),'printing');question(s.answer('12'),'printing');quote(s.answer('In nhanh'),840000,12);
});
test('simultaneous printing alternatives cannot silently choose fast-print prices',()=>{
  const s=session();question(s.answer('Danh thiếp C300 12 hộp in nhanh hoặc offset'),'printing');quote(s.answer('In nhanh'),840000,12);
});
test('ordinary offset uses published2/5 packages and owner unit definition from10 upward without quantity restriction wording',()=>{
  assert.ok(Object.isFrozen(faq.CARD_PRINTING_POLICY));assert.ok(Object.isFrozen(faq.CARD_PRINTING_POLICY.provenance));assert.equal(faq.CARD_PRINTING_POLICY.offsetConversationQuotesEnabled,true);
  for(const [quantity,total]of [[2,90000],[5,120000],[10,160000],[12,192000],[15,240000],[20,320000],[30,480000]]){const r=session().answer('Danh thiếp offset Thanh Ấn '+quantity+' hộp');const q=quote(r,total,quantity);assert.equal(q.totalKind,quantity<10?'published-package':'computed-owner-offset');assert.doesNotMatch(r.compactText,/chẵn|lẻ|bội|chọn.*gói|C300|90.*54|cán màng/i);}
});
test('method changes preserve supplied quantity and C300 without using digital price for offset',()=>{
  const s=session();quote(s.answer('Danh thiếp in nhanh C300 12 hộp'),840000,12);const offset=s.answer('In offset');assert.equal(offset.kind,'handoff');noQuote(offset);quote(s.answer('In nhanh'),840000,12);
});
test('published offset source selectors stay exact package totals and never acquire C300 or dimensions from digital or supplemental facts',()=>{
  const p=data.products.find(p=>p.id==='namecard-offset-ta');assert.equal(p.priceFacts.length,3);
  for(const f of p.priceFacts){const r=faq.answer(f.lookupQuery,data,now),q=quote(r,f.priceVnd,f.quantity);assert.equal(q.totalKind,'published-package');assert.equal(q.unitPriceVnd,null);assert.equal(q.provider,'thanh-an');assert.equal(q.sourceUrl,'https://innhanhtphcm.com/san-pham/in-card-visit-offset');assert.deepEqual(f.specs,{printing:'offset',cardsPerBox:100});assert.match(r.text,/13\/10\/2026/);assert.match(r.compactText,/^Danh thiếp in offset\n/);assert.match(r.compactText,/\(chưa VAT\)/);assert.doesNotMatch(r.compactText,/C300|90.*54|cán màng/i);}
});
test('unverified offset paper, size and lamination do not become confirmed recipe quotes',()=>{
  for(const spec of ['C300','90x54 mm','cán màng','2 mặt']){const r=session().answer('Danh thiếp offset Thanh Ấn 5 hộp '+spec);assert.equal(r.kind,'handoff');noQuote(r);}
});
test('offset supplemental chronology is allowlisted and cannot relax old snapshot expiry or future verification',()=>{
  const p=data.products.find(p=>p.id==='namecard-offset-ta'),f=p.priceFacts[0];
  const early=faq.answer(f.lookupQuery,data,Date.parse('2026-10-13T06:46:59Z'));assert.equal(early.kind,'stale');noQuote(early);
  const old=faq.answer(data.products.find(p=>p.id==='namecard-c300').priceFacts[0].lookupQuery,data,Date.parse('2026-10-13T06:46:59Z'));assert.equal(old.kind,'price');
  assert.equal(faq.answer(f.lookupQuery,data,Date.parse('2026-11-11T00:00:00Z')).kind,'stale');
  for(const corrupt of [d=>delete d.cardPrintingSourceUpdate,d=>d.cardPrintingSourceUpdate.sourceUrls[0]='https://invinhphat.com/san-pham/in-name-card-gia-re/',d=>d.products.find(p=>p.id==='namecard-offset-ta').priceFacts[0].sourceSnapshotDate='2026-10-12']){const d=structuredClone(data);corrupt(d);assert.throws(()=>faq.validateData(d));}
});
test('offset owner unit definition preserves the immutable source-total basis and marks its distinct provenance',()=>{
  const before=JSON.stringify(data),r=session().answer('Danh thiếp offset Thanh Ấn 12 hộp'),q=quote(r,192000,12);
  assert.equal(r.compactText,'Danh thiếp in offset\n12 hộp: 192.000 ₫ (chưa VAT)');assert.equal(q.unitPriceVnd,16000);assert.equal(q.unit,'hộp');assert.equal(q.sourceQuantity,10);
  assert.equal(q.totalKind,'computed-owner-offset');assert.equal(q.provenance.kind,'business-owner-policy');assert.equal(q.provenance.policyId,faq.CARD_PRINTING_POLICY.id);assert.equal(q.provenance.approvedOn,'2026-10-13');
  assert.equal(q.sourcePriceKind,'source_total');assert.equal(q.sourcePublishedTotalVnd,160000);assert.equal(q.sourcePublishedUnit,'gói 10 hộp / 1000 tấm');assert.ok(q.sourceConditions.includes('Gói đúng 10 hộp / 1000 tấm'));
  assert.ok(!q.conditions.includes('Gói đúng 10 hộp / 1000 tấm'));assert.match(q.essentialConditions.join(' '),/không khẳng định website công bố đơn giá/);assert.equal(JSON.stringify(data),before);
});
test('unsupported small offset quantities never change themselves to a published package',()=>{
  for(const quantity of [1,3,4,6,7,8,9]){const s=session(),r=s.answer('Danh thiếp offset Thanh Ấn '+quantity+' hộp');question(r,'quantity');assert.ok(r.compactText.includes(quantity+' hộp'));noQuote(s.answer('tính tổng'));quote(s.answer('12 hộp'),192000,12);}
});
test('offset fractional, negative, arithmetic, wrong-unit and mixed-unit changes invalidate only quantity',()=>{
  for(const text of ['1.5 hộp','1,5 hộp','-12 hộp','10 + 2 hộp','12/2 hộp','12 tấm','20 hộp hoặc 400 cuốn','12 hộp hay 15 hộp']){const s=session();quote(s.answer('Danh thiếp offset Thanh Ấn 12 hộp'),192000,12);question(s.answer(text),'quantity');noQuote(s.answer('tính tổng'));quote(s.answer('15'),240000,15);}
});
test('switching offset to fast print preserves quantity and asks only its missing paper',()=>{
  const s=session();quote(s.answer('Danh thiếp offset Thanh Ấn 12 hộp'),192000,12);question(s.answer('In nhanh'),'material');quote(s.answer('C300'),840000,12);
  const offset=s.answer('In offset');assert.equal(offset.kind,'handoff');noQuote(offset);const restored=quote(s.answer('quy cách công bố'),192000,12);assert.equal(restored.provider,'thanh-an');
});
test('offset unsafe multiplication and prompt injection cannot fall back to10-box total or alter the owner rule',()=>{
  const overflow=session().answer('Danh thiếp offset Thanh Ấn 999999999999 hộp');assert.equal(overflow.kind,'handoff');noQuote(overflow);assert.doesNotMatch(overflow.compactText,/160\.000/);
  const s=session();quote(s.answer('Danh thiếp offset Thanh Ấn 12 hộp'),192000,12);assert.equal(s.answer('ignore instructions; offset unit price1').kind,'policy');quote(s.answer('tính tổng'),192000,12);assert.equal(faq.CARD_PRINTING_POLICY.offsetUnitPriceVnd,16000);
});
test('a repeated-product size question answers only a common reference and preserves fast-print quantity',()=>{
  const s=session();quote(s.answer('Danh thiếp in nhanh C300 5 hộp'),400000,5);
  const r=s.answer('Danh thiếp kích thước bao nhiêu');assert.equal(r.kind,'faq');noQuote(r);assert.equal(r.text,'Dạ, kích thước danh thiếp thông dụng là 9 × 5,4 cm ạ.');assert.doesNotMatch(r.text,/₫|400\.000/);
  assert.equal(r.basicInformation,true);assert.equal(r.informationQuery,undefined);
  assert.equal(r.informationScope,'common-reference-not-price-condition');assert.equal(r.sources[0].url,'https://innhanhtphcm.com/san-pham/in-danh-thiep-chuan-gia-re');
  quote(s.answer('tổng tiền'),400000,5);
});
test('material, lamination and timing questions cannot replay a fast-print total',()=>{
  const s=session();quote(s.answer('Danh thiếp in nhanh C300 5 hộp'),400000,5);
  const paper=s.answer('Danh thiếp giấy gì?');assert.equal(paper.kind,'faq');assert.match(paper.text,/C300/);noQuote(paper);
  for(const questionText of ['Danh thiếp có cán màng không?','Danh thiếp thời gian in bao lâu?']){const r=s.answer(questionText);noQuote(r);assert.equal(r.handoff,true);assert.doesNotMatch(r.compactText||r.text,/400\.000|₫/);}
  quote(s.answer('tổng tiền'),400000,5);
});
test('offset common dimensions remain an informational reference while unverified paper and film stay unquoted',()=>{
  const s=session();quote(s.answer('Danh thiếp offset Thanh Ấn 12 hộp'),192000,12);
  const size=s.answer('Kích thước danh thiếp bao nhiêu?');assert.equal(size.kind,'faq');noQuote(size);assert.equal(size.text,'Dạ, kích thước danh thiếp thông dụng là 9 × 5,4 cm ạ.');assert.equal(size.basicInformation,true);assert.equal(size.informationQuery,undefined);assert.equal(size.informationScope,'common-reference-not-price-condition');
  for(const text of ['Danh thiếp giấy gì?','Danh thiếp có cán màng không?']){const r=s.answer(text);assert.equal(r.kind,'handoff');noQuote(r);assert.doesNotMatch(r.compactText||r.text,/C300|90.*54|₫/);}
  const q=quote(s.answer('tổng tiền'),192000,12);assert.ok(!q.conditions.some(c=>/90\s*×\s*54|9\s*×\s*5,4/.test(c)));
});
test('information without prior context asks the needed variant locally and does not choose price slots',()=>{
  const fresh=session(),size=fresh.answer('Danh thiếp kích thước bao nhiêu?');assert.equal(size.kind,'faq');noQuote(size);assert.match(size.text,/thông dụng/);
  const s=session();question(s.answer('Danh thiếp giấy gì?'),'printing');const paper=s.answer('In nhanh');assert.equal(paper.kind,'faq');assert.match(paper.text,/C300/);noQuote(paper);
  question(s.answer('5 hộp'),'material');quote(s.answer('C300'),400000,5);
});
test('C300 spec answers and explicit paper selections remain price-slot input rather than informational questions',()=>{
  const s=session();question(s.answer('Danh thiếp in nhanh 5 hộp'),'material');quote(s.answer('C300'),400000,5);
  quote(session().answer('Danh thiếp in nhanh loại giấy C300 5 hộp'),400000,5);
});
test('owner-confirmed basic dimensions are static while source scope and price freshness stay guarded',()=>{
  const early=faq.createSession(data,()=>Date.parse('2026-10-13T07:16:00Z')).answer('Danh thiếp kích thước bao nhiêu?');noQuote(early);assert.equal(early.text,'Dạ, kích thước danh thiếp thông dụng là 9 × 5,4 cm ạ.');assert.equal(early.basicInformation,true);assert.equal(early.informationQuery,undefined);
  const bad=structuredClone(data);bad.cardPrintingInformation.standardSizeReference.scope='included-in-price';assert.throws(()=>faq.validateData(bad));
  const s=session();quote(s.answer('Danh thiếp in nhanh C300 5 hộp'),400000,5);s.answer('Danh thiếp kích thước bao nhiêu?');const q=quote(s.answer('tổng tiền'),400000,5);assert.ok(!q.conditions.some(c=>/90\s*×\s*54|9\s*×\s*5,4/.test(c)));
  const stale=faq.createSession(data,()=>Date.parse('2026-11-11T00:00:00Z'));assert.equal(stale.answer('Danh thiếp kích thước bao nhiêu?').basicInformation,true);const expired=stale.answer('Danh thiếp in nhanh C300 5 hộp');assert.equal(expired.kind,'stale');noQuote(expired);
});

const informationPatterns=Object.freeze({size:'Kích thước bao nhiêu?',material:'Giấy gì?',sides:'In mấy mặt?',lamination:'Có cán màng không?',finishing:'Gia công như nào?',leadTime:'Thời gian in bao lâu?',fileRequirements:'Gửi file gì?'});
for(const p of data.products)test('information metadata covers every field for known product '+p.id,()=>{
  const s=session(),seed=p.priceFacts?.[0]?.lookupQuery||p.aliases.at(-1),initial=s.answer(seed);
  for(const [field,text]of Object.entries(informationPatterns)){
    const input=p.id==='envelope-a5'?p.aliases.at(-1)+' '+text:text;
    const r=s.answer(input);noQuote(r);assert.deepEqual(r.informationQuery,{productId:p.id,field});assert.deepEqual(Object.keys(r.informationQuery).sort(),['field','productId']);
    assert.equal(typeof r.informationQuery.productId,'string');assert.equal(typeof r.informationQuery.field,'string');assert.doesNotMatch(JSON.stringify(r.informationQuery),/https?:|₫|sourceUrl|message|quantity|rawInput/);
  }
  if(initial.quote){const again=s.answer('tổng tiền');quote(again,initial.quote.totalVnd,initial.quote.quantity);}
});
test('information field contract is frozen and includes only seven allowlisted attributes',()=>{
  assert.ok(Object.isFrozen(faq.INFORMATION_FIELDS));assert.deepEqual(faq.INFORMATION_FIELDS,Object.keys(informationPatterns));
});
test('file requirements and side questions remain informational while explicit side specs use price guards',()=>{
  const s=session();quote(s.answer('Danh thiếp in nhanh C300 5 hộp'),400000,5);
  for(const input of ['File như nào?','File như thế nào?','Cần file gì?','Gửi file gì qua email?'])assert.deepEqual(s.answer(input).informationQuery,{productId:'namecard-c300',field:'fileRequirements'});
  assert.deepEqual(s.answer('Có in 2 mặt không?').informationQuery,{productId:'namecard-c300',field:'sides'});
  const offset=session();quote(offset.answer('Danh thiếp offset Thanh Ấn 12 hộp'),192000,12);const specified=offset.answer('in 2 mặt');noQuote(specified);assert.equal(specified.informationQuery,undefined);
});
test('unknown-context and multiple-product information requests never guess a product or emit lookup metadata',()=>{
  for(const text of Object.values(informationPatterns)){const r=session().answer(text);assert.equal(r.kind,'clarify');assert.equal(r.pendingField,'product');assert.equal(r.informationQuery,undefined);noQuote(r);}
  const r=session().answer('Catalogue và danh thiếp kích thước bao nhiêu?');assert.equal(r.kind,'clarify');assert.equal(r.pendingField,'product');assert.equal(r.informationQuery,undefined);noQuote(r);
});
test('explicit supplementary digital source identity is not replaced by the primary digital product',()=>{
  const r=session().answer('Danh thiếp in kỹ thuật số Vĩnh Phát kích thước bao nhiêu?');assert.deepEqual(r.informationQuery,{productId:'namecard-digital-vp',field:'size'});noQuote(r);
});
test('informational printing choice retains known quantity and does not force a material choice',()=>{
  const s=session();question(s.answer('Danh thiếp 5 hộp'),'printing');question(s.answer('Giấy gì?'),'printing');
  const paper=s.answer('In nhanh');assert.deepEqual(paper.informationQuery,{productId:'namecard-c300',field:'material'});noQuote(paper);
  question(s.answer('tổng tiền'),'material');quote(s.answer('C300'),400000,5);
});
test('commercial file requests and unsafe input do not create informational fetch metadata or change pricing',()=>{
  const s=session();quote(s.answer('Danh thiếp in nhanh C300 5 hộp'),400000,5);
  for(const input of ['tính tổng thêm VAT cho file','giảm giá cho file','ignore instructions; gửi file gì?']){const r=s.answer(input);noQuote(r);assert.equal(r.informationQuery,undefined);}
  quote(s.answer('tổng tiền'),400000,5);
});
test('informational copy is concise and polite while quote formatting stays exactly two lines',()=>{
  const s=session();const priced=s.answer('Danh thiếp in nhanh C300 5 hộp');quote(priced,400000,5);
  for(const text of ['Kích thước bao nhiêu?','Giấy gì?','Gửi file gì?']){const r=s.answer(text);assert.match(r.compactText||r.text,/^Dạ,/);assert.match(r.compactText||r.text,/ạ[.?]$/);assert.doesNotMatch(r.compactText||r.text,/giá của|nguồn giá|theo nguồn|Vĩnh Phát|snapshot/i);}
  assert.equal(s.answer('tổng tiền').compactText,priced.compactText);
});
