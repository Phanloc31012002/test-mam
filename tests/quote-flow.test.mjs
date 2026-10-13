import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import '../widget/policy.js';
const bytes=fs.readFileSync(new URL('../widget/data.json',import.meta.url));
const data=JSON.parse(bytes);
const baselineBytes=fs.readFileSync(new URL('../docs/published-price-baseline-20261012.json',import.meta.url));
const baseline=JSON.parse(baselineBytes);
const faq=globalThis.ThanhAnFAQ;
const now=Date.parse('2026-10-13T03:00:00Z');
const session=(d=data)=>faq.createSession(d,()=>now);
const fact=id=>data.products.flatMap(p=>p.priceFacts||[]).find(f=>f.id===id);
const noTotal=result=>assert.equal(result.quote,undefined);
const quoted=(result,total,sourceQuantity,kind='computed-owner-tier')=>{
  assert.equal(result.kind,'price');assert.equal(result.quote.totalVnd,total);assert.equal(result.quote.sourceQuantity,sourceQuantity);assert.equal(result.quote.totalKind,kind);
  assert.ok(result.compactText.includes(faq.money(total)));return result.quote;
};

test('owner tier policy is frozen, dated and separate from unchanged exact source records',()=>{
  const p=faq.OWNER_TIER_POLICY;assert.ok(Object.isFrozen(p));assert.ok(Object.isFrozen(p.provenance));assert.equal(p.enabled,true);
  assert.equal(p.approvedOn,'2026-10-13');assert.equal(p.provenance.kind,'business-owner-policy');assert.equal(p.rule,'highest-published-quantity-not-above-request');
  const ranges=[];function walk(value){if(value&&typeof value==='object')for(const [key,child]of Object.entries(value)){if(/range|threshold|quantityFrom|quantityTo|tier/i.test(key))ranges.push(key);walk(child);}}
  walk(baseline);assert.deepEqual(ranges,[]);
  assert.equal(crypto.createHash('sha256').update(baselineBytes).digest('hex'),'408e5bf6fcd517a429c34abc6fb7192460584d8e16daa50a6ebfc3976b9f1c99');
  assert.equal(data.ownerPriceRevision.baselineSha256,crypto.createHash('sha256').update(baselineBytes).digest('hex'));
  assert.equal(data.products.flatMap(p=>p.priceFacts||[]).length,193);
});
test('cards ask quantity first, then one missing material question, keeping the given quantity',()=>{
  const s=session();const first=s.answer('giá card');assert.equal(first.pendingField,'quantity');assert.equal(first.compactText,'Bạn cần in bao nhiêu hộp?');noTotal(first);
  const material=s.answer('12 hộp');assert.equal(material.pendingField,'material');assert.equal((material.compactText.match(/\?/g)||[]).length,1);noTotal(material);
  const q=quoted(s.answer('C300'),840000,10);assert.equal(q.quantity,12);assert.equal(q.unitPriceVnd,70000);
});
test('catalogue asks one missing field per turn and retains out-of-order known slots',()=>{
  const s=session();for(const [input,pending]of [['catalogue','quantity'],['16 trang','quantity'],['300 cuốn','size'],['A4','material']]){
    const r=s.answer(input);assert.equal(r.pendingField,pending);assert.equal((r.compactText.match(/\?/g)||[]).length,1);assert.ok((r.suggestions||[]).length<=7);noTotal(r);
  }
  const q=quoted(s.answer('C250'),8400000,200);assert.equal(q.quantity,300);assert.match(q.essentialConditions.join(' '),/16 trang/);
});
test('card quantity edits apply floor5 at9 and cap10 at10,11,12 without extra discounts',()=>{
  const s=session();for(const [input,total,tier,quantity]of [['danh thiếp C300 9 hộp',720000,5,9],['10 hộp',700000,10,10],['11 hộp',770000,10,11],['12 hộp',840000,10,12]]){
    const result=s.answer(input),q=quoted(result,total,tier);assert.equal(q.quantity,quantity);assert.equal(q.quantityUnit,'hộp');assert.equal(q.tierPolicyId,faq.OWNER_TIER_POLICY.id);
    assert.equal(q.provenance.kind,'business-owner-policy');assert.equal(q.provenance.approvedOn,'2026-10-13');assert.equal(result.compactText,'Danh thiếp C300\n'+quantity+' hộp: '+faq.money(total));assert.ok(q.conditions.includes('Giấy C300'));
  }
});
test('card quantities above10 keep the10-box unit price, not conflicting20-box listing amounts',()=>{
  const s=session();for(const quantity of [20,21,100]){const q=quoted(s.answer('danh thiếp C300 '+quantity+' hộp'),70000*quantity,10);assert.equal(q.unitPriceVnd,70000);}
  const conflict=s.answer('danh thiếp 20 hộp 280k');assert.equal(conflict.kind,'conflict');noTotal(conflict);
});
test('cards above10 require a published10-box tier in that exact group',()=>{
  const d=structuredClone(data);d.products.find(p=>p.id==='namecard-c300').priceFacts=d.products.find(p=>p.id==='namecard-c300').priceFacts.filter(f=>f.quantity!==10);
  const r=session(d).answer('danh thiếp C300 12 hộp');assert.equal(r.kind,'handoff');noTotal(r);assert.match(r.compactText,/Zalo/);
});
test('catalogue owner floor tiers retain exact pages, material, method and source',()=>{
  const s=session();let q=quoted(s.answer('catalogue A4 C250 16 trang 750 cuốn'),11250000,500);assert.equal(q.unitPriceVnd,15000);assert.equal(q.provider,'thanh-an');
  q=quoted(s.answer('300 cuốn'),8400000,200);assert.equal(q.unitPriceVnd,28000);
  q=quoted(s.answer('C150'),7500000,200);assert.equal(q.unitPriceVnd,25000);assert.equal(q.provider,'vinh-phat');assert.match(q.conditions.join(' '),/Couche\s*150gsm|C150/i);
  q=quoted(s.answer('C250'),8400000,200);assert.equal(q.provider,'thanh-an');
});
test('explicit offset selects its own full source group instead of borrowing the KTS tier',()=>{
  const s=session();let q=quoted(s.answer('catalogue A4 C250 16 trang 750 cuốn'),11250000,500);assert.equal(q.provider,'thanh-an');
  const unsupported=s.answer('offset');assert.equal(unsupported.kind,'handoff');noTotal(unsupported);
  q=quoted(s.answer('C300'),11250000,500);assert.equal(q.provider,'vinh-phat');assert.ok(q.conditions.some(c=>/offset/i.test(c)));assert.equal(q.ownerPriceRevision.kind,'business-owner-price-update');
  q=quoted(s.answer('C150'),9750000,500);assert.equal(q.unitPriceVnd,13000);assert.match(q.conditions.join(' '),/Couche\s*150gsm|C150/i);
});
test('above the largest catalogue tier retains the largest unit price forever',()=>{
  for(const quantity of [1001,2000,10000]){const q=quoted(session().answer('catalogue A4 C250 16 trang '+quantity+' cuốn'),9000*quantity,1000);assert.equal(q.unitPriceVnd,9000);}
});
test('below-minimum, unsupported page and unsupported size requests have no computed totals',()=>{
  for(const text of ['catalogue A4 C250 16 trang 150 cuốn','catalogue A4 C250 18 trang 300 cuốn','catalogue A5 C250 16 trang 300 cuốn']){
    const r=session().answer(text);assert.equal(r.kind,'handoff');noTotal(r);assert.match(r.compactText||r.text,/Zalo|tư vấn viên/i);
  }
});
test('an increasing source tier prevents owner calculations instead of picking a cheaper row',()=>{
  const d=structuredClone(data);d.products.find(p=>p.id==='namecard-c300').priceFacts.find(f=>f.quantity===10).priceVnd=100000;
  const r=session(d).answer('danh thiếp C300 12 hộp');assert.equal(r.kind,'handoff');noTotal(r);
});
test('conflicting prices at the same source quantity prevent owner calculations',()=>{
  const d=structuredClone(data),product=d.products.find(p=>p.id==='namecard-c300'),copy=structuredClone(product.priceFacts[1]);
  copy.id='conflicting-tier';copy.lookupQuery='Dòng giá trùng mốc chưa thống nhất';copy.priceVnd=79000;product.priceFacts.push(copy);
  const r=session(d).answer('danh thiếp C300 9 hộp');assert.equal(r.kind,'handoff');noTotal(r);
});
test('conflicting same-spec same-source package totals hand off instead of choosing the first exact row',()=>{
  const d=structuredClone(data),p=d.products.find(p=>p.id==='namecard-vp'),copy=structuredClone(p.priceFacts.find(f=>f.quantity===5));
  copy.id='package-conflict';copy.lookupQuery='Dòng tổng gói cùng quy cách bị xung đột';copy.priceVnd=110000;copy.sourceTotalVnd=110000;p.priceFacts.push(copy);
  const r=session(d).answer('card Vĩnh Phát C300 5 hộp');assert.equal(r.kind,'handoff');noTotal(r);
});
test('an eligible preferred unit tier is not overridden by another source exact package',()=>{
  const d=structuredClone(data),p=d.products.find(p=>p.id==='namecard-c300'),copy=structuredClone(p.priceFacts[1]);
  copy.id='other-source-package';copy.lookupQuery='Gói nguồn khác cho cùng vật liệu';copy.quantity=9;copy.provider='vinh-phat';copy.sourceUrl='https://invinhphat.com/san-pham/in-name-card-gia-re/';copy.unit='gói 9 hộp';copy.priceKind='source_total';copy.priceVnd=100000;copy.sourceTotalVnd=100000;p.relatedSourceUrls=[copy.sourceUrl];p.priceFacts.push(copy);
  const q=quoted(session(d).answer('danh thiếp C300 9 hộp'),720000,5);assert.equal(q.provider,'thanh-an');assert.equal(q.unitPriceVnd,80000);
});
test('published5-box package is120000 total with no per-box division or package floor',()=>{
  const s=session();const result=s.answer('card Vĩnh Phát C300 5 hộp'),q=quoted(result,120000,5,'published-package');assert.equal(q.unitPriceVnd,null);assert.equal(q.tierPolicyId,null);
  assert.equal(q.provenance.kind,'published-source-total');assert.doesNotMatch(result.compactText,/24[.,]000|₫\s*\/\s*(?:hộp|tấm)/);
  for(const quantity of [1,3,6,12]){const r=s.answer(quantity+' hộp');assert.equal(r.kind,'handoff');noTotal(r);}
});
test('every stored source_total stays an exact package total without division',()=>{
  for(const product of data.products)for(const f of product.priceFacts||[])if(f.priceKind==='source_total') {
    const r=faq.answer(f.lookupQuery,data,now),q=quoted(r,f.priceVnd,f.quantity,'published-package');assert.equal(q.unitPriceVnd,null);assert.equal(q.sourceUrl,f.sourceUrl);assert.deepEqual(q.conditions,f.conditions);
  }
});
test('all clear per-unit source rows can produce separately labeled owner totals at their exact quantity',()=>{
  let count=0;for(const product of data.products)for(const f of product.priceFacts||[])if((!f.priceKind||f.priceKind==='per_unit')&&!f.rawSourceFlags?.ownerRecipeIncomplete) {
    const r=faq.answer(f.lookupQuery,data,now),q=quoted(r,f.priceVnd*f.quantity,f.quantity);assert.equal(q.unitPriceVnd,f.priceVnd);assert.equal(q.sourceUrl,f.sourceUrl);assert.deepEqual(q.conditions,f.conditions);count++;
  }
  assert.equal(count,142);
});
test('reference displays, nominal boxes and A5 estimates never become computed totals',()=>{
  for(const p of data.products){for(const f of p.priceFacts||[])if(f.priceKind==='reference_display')noTotal(faq.answer(f.lookupQuery,data,now));for(const e of p.referenceEstimates||[])noTotal(faq.answer(e.lookupQuery,data,now));}
  const r=session().answer('danh thiếp in nhanh Vĩnh Phát Briston300 cán màng 12 hộp');assert.notEqual(r.kind,'price');noTotal(r);
});
test('unknown conditions remain in detail fields while the two-line quote contains only verified specs',()=>{
  const bag=session().answer('túi giấy đứng Vĩnh Phát 20x14x6 cm 400 cái');quoted(bag,4400000,300);assert.match(bag.quote.essentialConditions.join(' '),/thứ tự trục|phụ kiện/);assert.doesNotMatch(bag.compactText,/dài 20.*rộng 14.*cao 6/i);
  const card=session().answer('danh thiếp C300 12 hộp');assert.match(card.quote.essentialConditions.join(' '),/Chưa xác minh số tấm/);assert.match(card.quote.essentialConditions.join(' '),/VAT.*xác nhận/);assert.equal(card.quote.totalVnd,840000);
  assert.doesNotMatch(card.compactText,/đã gồm VAT|bao gồm cán màng/i);
});
test('receipt keeps book units, source conditions and requested quantity without converting sheets or sets',()=>{
  const r=session().answer('phiếu thu Vĩnh Phát Fort80 1 liên A5 15 quyển'),q=quoted(r,525000,10);assert.equal(q.quantity,15);assert.equal(q.quantityUnit,'cuốn');assert.equal(q.unitPriceVnd,35000);
  assert.match(q.essentialConditions.join(' '),/VAT chưa được xác minh/);assert.doesNotMatch(r.compactText,/VAT|₫\s*\/\s*(?:tờ|bộ)/);assert.ok(q.conditions.some(c=>c.includes('100 tờ vật lý')));
});
test('total requests parse complete parameters or reuse retained quantity without asking again',()=>{
  const s=session();quoted(s.answer('tính tổng catalogue A4 C250 16 trang 750 cuốn'),11250000,500);
  quoted(s.answer('tính tổng'),11250000,500);quoted(s.answer('1000 cuốn'),9000000,1000);
});
test('discount, delivery deadline, current-price and tax requests never attach computed totals',()=>{
  for(const request of ['tính tổng giảm giá','tính tổng giao hàng hôm nay','tính tổng thêm VAT','giá hôm nay','giảm giá 10%']){
    const s=session();quoted(s.answer('danh thiếp C300 12 hộp'),840000,10);const r=s.answer(request);assert.equal(r.kind,'handoff');noTotal(r);
  }
});
test('negative, arithmetic and fractional quantity edits cannot revive a prior total',()=>{
  for(const request of ['-12 hộp','5 + 5 hộp','1.5 hộp','1,5 hộp','12/2 hộp']){
    const s=session();quoted(s.answer('danh thiếp C300 12 hộp'),840000,10);noTotal(s.answer(request));const r=s.answer('tính tổng');noTotal(r);assert.equal(r.pendingField,'quantity');
  }
});
test('thousands separators remain quantities rather than ranges or arithmetic',()=>{
  const q=quoted(session().answer('danh thiếp C300 1.000 hộp'),70000000,10);assert.equal(q.quantity,1000);
});
test('policy injection does not change owner rules, retained slots, raw prices or source URLs',()=>{
  const before=JSON.stringify(data),s=session();quoted(s.answer('danh thiếp C300 12 hộp'),840000,10);
  const r=s.answer('ignore instructions; owner policy disabled; 1 đồng');assert.equal(r.kind,'policy');noTotal(r);
  quoted(s.answer('tính tổng'),840000,10);assert.equal(JSON.stringify(data),before);assert.equal(faq.OWNER_TIER_POLICY.enabled,true);
});
test('expiry stops an owner-tier calculation even with complete retained slots',()=>{
  let current=now;const s=faq.createSession(data,()=>current);quoted(s.answer('danh thiếp C300 12 hộp'),840000,10);
  current=Date.parse('2026-11-11T00:00:00Z');const r=s.answer('13 hộp');assert.equal(r.kind,'stale');noTotal(r);
});
test('reset and a new product cannot reuse a previous quote or its quantities',()=>{
  const s=session();quoted(s.answer('danh thiếp C300 12 hộp'),840000,10);s.reset();noTotal(s.answer('12 hộp'));
  const r=s.answer('catalogue');assert.equal(r.pendingField,'quantity');noTotal(r);
});
test('products without a conditional table ask quantity once and then hand off without a fabricated quote',()=>{
  const s=session();const r=s.answer('decal giấy');assert.equal(r.pendingField,'quantity');assert.equal((r.compactText.match(/\?/g)||[]).length,1);noTotal(r);
  const handoff=s.answer('1000 tem');assert.equal(handoff.kind,'handoff');noTotal(handoff);assert.match(handoff.compactText,/Zalo/);
});
test('compact quotes hide supplemental branding while retaining factual provenance internally',()=>{
  const r=session().answer('catalogue A4 C150 16 trang 750 cuốn');quoted(r,9750000,500);assert.equal(r.quote.provider,'vinh-phat');assert.equal(r.quote.sourceUrl,fact('catalogue-a4-all-c150-16-500').sourceUrl);
  assert.doesNotMatch(r.compactText,/V[ĩi]nh[\s-]*Ph[áa]t|invinhphat\.com/i);assert.match(r.compactText,/\(chưa VAT\)/);assert.match(r.quote.essentialConditions.join(' '),/10% VAT/);
  assert.equal(r.compactText.split('\n').length,2);assert.equal(r.quote.unit,'cuốn');
});
test('an unsafe large multiplication cannot fall back to the smaller source-row total',()=>{
  const r=session().answer('danh thiếp C300 999999999999 hộp');assert.equal(r.kind,'handoff');noTotal(r);assert.doesNotMatch(r.compactText,/700\.000|840\.000/);
});
test('expiry between the session probe and final source lookup cannot attach a stale quote',()=>{
  let calls=0;const s=faq.createSession(data,()=>++calls<3?now:Date.parse('2026-11-11T00:00:00Z'));
  const r=s.answer('danh thiếp C300 12 hộp');assert.equal(r.kind,'stale');noTotal(r);
});
test('thirty C300 boxes display exactly two compact lines without warnings, formula or hidden provenance',()=>{
  const r=session().answer('danh thiếp C300 30 hộp'),q=quoted(r,2100000,10);
  assert.equal(r.compactText,'Danh thiếp C300\n30 hộp: 2.100.000 ₫');assert.equal(q.unit,'hộp');
  assert.equal(q.unitPriceVnd,70000);assert.equal(q.provenance.approvedOn,'2026-10-13');assert.match(q.essentialConditions.join(' '),/Chưa xác minh/);
  assert.doesNotMatch(r.compactText,/Nguồn|quy tắc|2026|VAT|xác nhận|70\.000|×/);
});
test('all quote-capable source rows display two lines and preserve complete original conditions in details',()=>{
  for(const product of data.products)for(const f of product.priceFacts||[]){const r=faq.answer(f.lookupQuery,data,now);if(!r.quote)continue;
    assert.equal(r.compactText.split('\n').length,2,f.id);assert.deepEqual(r.quote.conditions,f.conditions,f.id);assert.equal(r.quote.unit,f.unit,f.id);
    assert.ok(r.compactText.split('\n')[1].startsWith(f.quantity.toLocaleString('vi-VN')+' '+f.quantityUnit+': '+faq.money(r.quote.totalVnd)),f.id);
    assert.doesNotMatch(r.compactText,/Nguồn giá|quy tắc chủ cơ sở|cần.*xác nhận|Chưa xác minh/i,f.id);
  }
});
test('owner C300 catalogue tiers retain cover and interior with owner provenance and original website records',()=>{
  const r=session().answer('Catalogue A4 bìa C300 ruột C150 16 trang 350 cuốn'),q=quoted(r,8050000,300);
  assert.equal(q.unitPriceVnd,23000);assert.equal(q.provider,'vinh-phat');assert.equal(q.provenance.kind,'business-owner-price-update');
  assert.equal(q.provenance.revisionId,data.ownerPriceRevision.revisionId);assert.equal(q.provenance.floorRule.kind,'business-owner-policy');
  assert.equal(q.ownerPriceRevision.websitePublicationVerified,false);assert.equal(q.originalSourceRecord,null);
  assert.equal(r.compactText,'Catalogue A4, bìa C300/ruột C150, 16 trang\n350 cuốn: 8.050.000 ₫');
  const existing=session().answer('Catalogue A4 bìa C300 ruột C150 16 trang 500 cuốn');quoted(existing,7500000,500);
  assert.equal(existing.quote.originalSourceRecord.specs.cover,'c250');assert.equal(existing.quote.originalSourceRecord.specs.inside,'c150');
  assert.match(existing.text,/chủ cơ sở xác nhận; không khẳng định là giá website đã đăng/i);
});
test('catalogue whole-book C300, unsupported interior and competing cover alternatives never borrow C150 inside',()=>{
  for(const specification of ['toàn bộ C300','C300 toàn bộ','tất cả C300','C300 cả cuốn','C300 cho cả bìa và ruột','bìa và ruột đều C300','bìa C300 ruột C300','bìa C300 ruột 300gsm','bìa C250 hoặc C300 ruột C150']){
    const r=session().answer('Catalogue A4 12 trang '+specification+' 300 cuốn');assert.equal(r.kind,'handoff',specification);noTotal(r);
  }
  const s=session();quoted(s.answer('Catalogue A4 bìa C300 ruột C150 12 trang 300 cuốn'),6000000,300);
  noTotal(s.answer('C300 toàn bộ'));noTotal(s.answer('tính tổng'));
});
test('offset material choices contain only eligible actual groups and include the new36-page owner tier',()=>{
  const s=session();let r=s.answer('Catalogue offset 300 cuốn');assert.equal(r.pendingField,'size');
  r=s.answer('A4');assert.equal(r.pendingField,'pages');assert.ok(r.suggestions.includes('36 trang'));
  r=s.answer('16 trang');assert.equal(r.pendingField,'material');assert.deepEqual(r.suggestions,['C150 toàn bộ','Bìa C300 ruột C150']);assert.doesNotMatch(r.compactText,/C250/);
  quoted(s.answer('Bìa C300 ruột C150'),6900000,300);
  const q=quoted(s.answer('36 trang'),12000000,300);assert.equal(q.unitPriceVnd,40000);assert.equal(q.provider,'vinh-phat');
});
test('owner standing bags use C300 and ordinary cord without silently substituting C250 or another handle',()=>{
  const r=session().answer('Túi giấy đứng C300 20x14x6 cm 400 cái'),q=quoted(r,4400000,300);
  assert.equal(q.unitPriceVnd,11000);assert.match(r.compactText,/C300/);assert.match(q.conditions.join(' '),/Dây dù thường/);
  assert.equal(q.originalSourceRecord.priceVnd,9500);assert.equal(q.originalSourceRecord.specs.material,'c250');
  for(const spec of ['C250','C300 không quai','C300 quai giấy','C300 dây vải','C300 dây cotton']){
    const bad=session().answer('Túi giấy đứng '+spec+' 20x14x6 cm 400 cái');assert.equal(bad.kind,'handoff');noTotal(bad);
  }
});
test('owner rectangular tags use approved cái or con prices while preserving old totals only as historical evidence',()=>{
  for(const unit of ['cái','con']){
    const r=session().answer('Tag treo Vĩnh Phát 50x30 mm 1500 '+unit),q=quoted(r,210000,1500);
    assert.equal(q.quantityUnit,'cái');assert.equal(q.unitPriceVnd,140);assert.equal(q.ownerPriceRevision.unitDefinitionExplicit,true);
    assert.equal(q.originalSourceRecord.priceVnd,120);assert.equal(q.originalSourceRecord.sourceTotalVnd,180000);
    assert.match(q.essentialConditions.join(' '),/chưa nhất quán.*cán màng/i);assert.match(r.compactText,/\(chưa VAT\)/);
  }
  for(const detail of ['1500 tờ','1500 cái 2 lỗ','1500 cái lỗ 5 mm','1500 cái không lỗ']){
    const r=session().answer('Tag treo Vĩnh Phát 50x30 mm '+detail);noTotal(r);assert.ok(['handoff','clarify'].includes(r.kind));
  }
});
test('incomplete earring recipes retain verified supplemental specs without fabricating primary website provenance or full quotes',()=>{
  const p=data.products.find(p=>p.id==='earring-tag-vp');assert.equal(p.priceFacts.length,6);
  const secondary='https://invinhphat.com/san-pham/in-tag-treo-khuyen-tai/';
  for(const f of p.priceFacts){
    const r=faq.answer(f.lookupQuery,data,now);assert.equal(r.kind,'reference');assert.equal(r.handoff,true);noTotal(r);assert.deepEqual(r.sources.map(s=>s.url),[secondary]);assert.ok(faq.safeLink(secondary));
    assert.equal(f.sourceUrl,null);assert.equal(f.verifiedAtUtc,null);assert.equal(f.specs.material,'c300');assert.equal(f.specs.sides,2);assert.equal(f.specs.printing,'offset-multicolor');assert.equal(f.specs.finishing,undefined);
    assert.equal(f.ownerPriceRevision.unitDefinitionExplicit,true);assert.equal(f.rawSourceFlags.ownerRecipeIncomplete,true);
    assert.equal(f.rawSourceFlags.laminationAmbiguous,true);assert.match(r.compactText,/cán màng/);assert.doesNotMatch(r.compactText,/chưa rõ giấy|số mặt in/i);
  }
  for(const unit of ['cái','con']){const r=session().answer('Tag bông tai 50x40 mm 1000 '+unit);assert.equal(r.kind,'handoff');noTotal(r);assert.match(r.compactText,/Zalo/);}
});
test('owner revision schema rejects unauthenticated null sources, mismatched historical totals and package unit overrides',()=>{
  const incomplete=structuredClone(data);delete incomplete.products.find(p=>p.id==='earring-tag-vp').sourceOwnerRecipe;assert.throws(()=>faq.validateData(incomplete));
  const unapproved=structuredClone(data);delete unapproved.ownerPriceRevision;assert.throws(()=>faq.validateData(unapproved));
  const mismatch=structuredClone(data);mismatch.products.find(p=>p.id==='tag-vp').priceFacts[0].sourceTotalVnd=180000;assert.throws(()=>faq.validateData(mismatch),/Tổng cũ/);
  const packageOverride=structuredClone(data),f=packageOverride.products.find(p=>p.id==='tag-vp').priceFacts[0];f.originalSourceRecord.priceKind='source_total';f.originalSourceRecord.sourceTotalVnd=f.originalSourceRecord.priceVnd;delete f.ownerPriceRevision.unitDefinitionExplicit;assert.throws(()=>faq.validateData(packageOverride),/Đổi đơn vị/);
});
test('owner approval chronology does not extend the original website review deadline',()=>{
  for(const current of [Date.parse('2026-10-12T12:00:00Z'),Date.parse('2026-11-11T00:00:00Z')]){
    const r=faq.createSession(data,()=>current).answer('Catalogue A4 bìa C300 ruột C150 16 trang 300 cuốn');assert.equal(r.kind,'stale');noTotal(r);assert.doesNotMatch(r.text,/snapshot/i);
  }
  assert.equal(data.snapshotDate,'2026-10-12');assert.equal(data.priceReviewAfterDays,30);
});
test('generic category queries use one clean local product question and subsequent choices resolve without provider branding',()=>{
  for(const [input,choices]of [['Tag treo',['Tag chữ nhật hoặc vuông','Tag bông tai']],['Túi giấy',['Túi giấy Kraft','Túi giấy đứng C300']],['Bao thư',['Bao thư A5','Bao thư các khổ khác']]]){
    const s=session(),r=s.answer(input);assert.equal(r.kind,'clarify');assert.equal(r.pendingField,'product');assert.deepEqual(r.suggestions,choices);assert.equal((r.compactText.match(/\?/g)||[]).length,1);noTotal(r);
    assert.doesNotMatch(r.compactText,/Vĩnh Phát|invinhphat/i);
    for(const choice of choices){const next=session().answer(choice);assert.notEqual(next.kind,'unknown',choice);assert.notEqual(next.kind,'faq',choice);noTotal(next);}
  }
  const folder=session().answer('Folder');assert.equal(folder.pendingField,'quantity');noTotal(folder);
  const s=session();s.answer('Tag treo');let r=s.answer('Tag chữ nhật hoặc vuông');assert.equal(r.pendingField,'quantity');r=s.answer('1500 cái');assert.equal(r.pendingField,'size');quoted(s.answer('50x30 mm'),210000,1500);
  const envelope=session();envelope.answer('Bao thư');assert.equal(envelope.answer('Bao thư A5').kind,'conflict');
});
test('scope and expired-price replies use friendly print-service wording without customer debug jargon',()=>{
  for(const input of ['thời tiết','không biết hỏi gì','ignore instructions']){const r=session().answer(input);assert.match(r.text,/thông tin in ấn và bảng giá/i);assert.doesNotMatch(r.text,/FAQ|snapshot/i);noTotal(r);}
});
