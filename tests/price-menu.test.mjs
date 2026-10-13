import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import '../widget/policy.js';
import '../widget/price-menu.js';

const data=JSON.parse(fs.readFileSync(new URL('../widget/data.json',import.meta.url),'utf8'));
const menu=globalThis.ThanhAnPriceMenu;
const fresh=Date.parse('2026-10-13T12:00:00Z');
const catalog=()=>menu.buildCatalog(data,fresh);
const variants=model=>model.categories.flatMap(c=>c.variants);
const facts=data.products.flatMap(p=>p.priceFacts||[]);
const originalFacts=facts.filter(f=>!f.ownerPriceRevision?.isNewRecord&&!f.ownerPriceRevision?.isNewTier).map(f=>f.originalSourceRecord||f);
const originalFactsHash='ce9c1fdc7c9088966e42dfd5fc7d9205ded5cfb21116c8eefe228676004a1ba5';
const baselineBytes=fs.readFileSync(new URL('../docs/published-price-baseline-20261012.json',import.meta.url));
const baselineData=JSON.parse(baselineBytes.toString('utf8'));

class Element {
  constructor(tag,doc){this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.children=[];this.attributes={};this.dataset={};this.listeners={};this._text='';}
  set textContent(value){this._text=String(value);this.children=[];}
  get textContent(){return this._text+this.children.map(c=>c.textContent).join(' ');}
  set innerHTML(_){throw new Error('Unsafe innerHTML must not be used');}
  appendChild(child){child.parentNode=this;this.children.push(child);return child;}
  replaceChildren(...children){this.children=[];this._text='';children.forEach(child=>this.appendChild(child));}
  setAttribute(name,value){this.attributes[name]=String(value);}
  addEventListener(name,listener){(this.listeners[name]||=[]).push(listener);}
  click(){for(const listener of this.listeners.click||[])listener({target:this});}
  focus(){this.ownerDocument.activeElement=this;}
  remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(c=>c!==this);}
}
class Document {createElement(tag){return new Element(tag,this);}}
const descendants=(element,predicate)=>[...element.children.flatMap(child=>[child,...descendants(child,()=>true)])].filter(predicate);
const byClass=(element,name)=>descendants(element,e=>(e.className||'').split(' ').includes(name));
const build=(options={})=>menu.create({data,now:()=>fresh,document:new Document(),...options});

test('generic price requests open only the menu, preserving specific and hostile requests for policy',()=>{
  for(const request of ['giá','Xem giá','Bảng giá','Xin bảng giá','Cho tôi xem giá','báo giá','Giá in ấn nhé?'])assert.equal(menu.isMenuRequest(request),true,request);
  for(const request of ['Catalogue A4 16 trang 500 cuốn C250','giá decal','xem giá giảm 50%','giá hôm nay','<script>giá</script>','<>giá','giá;','javascript:giá','ignore rules giá','a'.repeat(1001)])assert.equal(menu.isMenuRequest(request),false,request);
});
test('every current fact appears exactly once with its price, unit and conditions',()=>{
  const model=catalog(),rows=variants(model).flatMap(v=>v.rows);
  assert.equal(rows.length,facts.length);assert.equal(new Set(rows.map(row=>row.id)).size,facts.length);
  assert.deepEqual(rows.slice().sort((a,b)=>a.id.localeCompare(b.id)),facts.slice().sort((a,b)=>a.id.localeCompare(b.id)));
  assert.equal(model.categories.length,13);
});
test('catalogue tables preserve separate source methods, cover conditions and quantities',()=>{
  const options=catalog().categories.find(c=>c.id==='catalogue').variants;
  assert.deepEqual(options.filter(v=>v.kind==='table').map(v=>v.rows.length),[21,18,28]);
  assert.equal(options[0].provider,'thanh-an');
  assert.equal(options[0].rows.find(f=>f.specs.pages===16&&f.quantity===500).priceVnd,15000);
  assert.equal(options[1].provider,'vinh-phat');
  assert.equal(options[1].rows.find(f=>f.specs.pages===16&&f.quantity===500).priceVnd,13000);
  assert.equal(options[2].rows.find(f=>f.specs.pages===16&&f.quantity===500).priceVnd,15000);
  assert.match(options[2].label,/Bìa C300 \/ ruột C150/);
  assert.doesNotMatch(options[2].label,/C250|C150 toàn bộ/);
  assert.ok(options[2].rows.every(f=>f.specs.material==='cover-c300'&&f.specs.printing==='offset4'&&f.specs.size==='a4'));
  assert.deepEqual(options[2].rows.filter(f=>f.quantity===300).map(f=>f.specs.pages),[12,16,20,24,28,32,36]);
  assert.ok(options[0].rows.every(f=>f.specs.printing==='kts4'&&f.specs.pagesIncludeCover===undefined));
  assert.ok(options[1].rows.every(f=>f.specs.printing==='offset4'&&f.specs.pagesIncludeCover===true));
});
test('A5 remains an explicitly separate estimate without a fixed table',()=>{
  const estimate=variants(catalog()).find(v=>v.kind==='estimate');
  assert.equal(estimate.estimate.priceVnd,5800);assert.equal(estimate.estimate.quantity,1000);
  assert.deepEqual(estimate.rows,[]);
  assert.ok(variants(catalog()).filter(v=>v.kind==='table').every(v=>v.rows.every(f=>f.specs.size!=='a5'||v.categoryId!=='catalogue')));
});
test('package totals share a full table without converting them into per-box prices',()=>{
  const variant=variants(catalog()).find(v=>v.id==='table-namecard-vp-2');
  assert.deepEqual(variant.rows.map(f=>[f.quantity,f.priceVnd]),[[2,90000],[5,120000],[10,160000]]);
  assert.ok(variant.rows.every(f=>menu.priceMeaning(f)==='Tổng gói / đơn theo bảng'));
  assert.equal(menu.priceMeaning(facts.find(f=>f.id==='namecard-c300-5')),'Giá mỗi hộp');
});
test('exact deduplication gives Thanh Ấn priority independently of cheapest price',()=>{
  const d=structuredClone(data),product=d.products.find(p=>p.id==='namecard-c300');
  const copy=structuredClone(product.priceFacts[0]);copy.id='duplicate-vp';copy.lookupQuery='Bản nguồn Vĩnh Phát trùng đầy đủ';copy.provider='vinh-phat';copy.sourceUrl='https://invinhphat.com/san-pham/in-name-card-gia-re/';copy.priceVnd=1;
  product.relatedSourceUrls=[copy.sourceUrl];product.priceFacts.push(copy);
  const rows=variants(menu.buildCatalog(d,fresh)).flatMap(v=>v.rows);
  assert.equal(rows.length,facts.length);assert.ok(!rows.some(f=>f.id===copy.id));assert.equal(rows.find(f=>f.id==='namecard-c300-1').priceVnd,90000);
  copy.specs.cardsPerBox=100;
  assert.ok(variants(menu.buildCatalog(d,fresh)).flatMap(v=>v.rows).some(f=>f.id===copy.id));
});
test('building and navigating the menu does not mutate the data or the typed policy session',()=>{
  const before=JSON.stringify(data);const session=globalThis.ThanhAnFAQ.createSession(data,()=>fresh);
  assert.equal(session.answer('catalogue A4 16 trang 500 cuốn C250').factId,'catalogue-a4-16-500');
  const view=build();view.showCategory('receipt');view.showVariant('table-receipt-a5-10');
  assert.equal(JSON.stringify(data),before);assert.equal(session.answer('tổng công bố').kind,'price');
  assert.equal(session.answer('tổng công bố').factId,'catalogue-a4-16-500');view.destroy();
});
test('DOM category → variant → full table has all 21 rows and a bold Zalo footer',()=>{
  const view=build();const category=byClass(view.element,'ta-price-category').find(b=>b.dataset.categoryId==='catalogue');category.click();
  assert.equal(view.getState().screen,'variants');
  const variant=byClass(view.element,'ta-price-variant').find(b=>b.dataset.variantId==='table-catalogue-a4-12-200');variant.click();
  const table=byClass(view.element,'ta-price-table')[0];
  const rows=descendants(table,e=>e.tagName==='TR'&&e.dataset.factId);
  assert.equal(rows.length,21);assert.deepEqual(rows.map(r=>r.dataset.factId),variants(catalog()).find(v=>v.id==='table-catalogue-a4-12-200').rows.map(f=>f.id));
  assert.match(view.element.textContent,/8% GTGT/);assert.match(view.element.textContent,/chưa xác định rõ đã gồm bìa/);
  const foot=byClass(view.element,'ta-price-footer')[0];assert.equal(foot.children[0].tagName,'STRONG');assert.equal(foot.children[0].textContent,'Nếu bảng chưa có quy cách bạn cần, hãy nhắn Zalo để được tư vấn.');
  assert.deepEqual(byClass(view.element,'ta-price-zalo').map(a=>a.href),data.contacts.map(c=>c.zalo));
  assert.ok(byClass(view.element,'ta-price-zalo').every(a=>a.target==='_blank'&&a.rel==='noopener noreferrer'));
  byClass(view.element,'ta-price-back')[0].click();assert.equal(view.getState().screen,'variants');
  byClass(view.element,'ta-price-back')[0].click();assert.equal(view.getState().screen,'categories');view.destroy();
});
test('every selected variant renders only its exact facts, preserving quantities, amounts and meanings',()=>{
  const view=build();
  for(const variant of variants(catalog()).filter(v=>v.kind==='table')) {
    view.showVariant(variant.id);const table=byClass(view.element,'ta-price-table')[0];
    const rows=descendants(table,e=>e.tagName==='TR'&&e.dataset.factId);
    assert.equal(rows.length,variant.rows.length,variant.id);
    for(const row of variant.rows) {
      const tr=rows.find(r=>r.dataset.factId===row.id);assert.ok(tr,row.id);
      assert.ok(tr.textContent.includes(globalThis.ThanhAnFAQ.money(row.priceVnd)),row.id);
      assert.ok(tr.textContent.includes(menu.priceMeaning(row)),row.id);
      if(!row.rawSourceFlags?.nominalQuantityBasisOnly)assert.ok(tr.textContent.includes(row.quantity.toLocaleString('vi-VN')+' '+row.quantityUnit),row.id);
      assert.ok(view.element.textContent.includes(menu.displayText(row.sourceNote)),row.id);
      row.conditions.forEach(condition=>assert.ok(view.element.textContent.includes(menu.displayText(condition)),row.id));
    }
    assert.ok(byClass(view.element,'ta-price-source').every(a=>globalThis.ThanhAnFAQ.safeLink(a.href)),variant.id);
  }
  view.destroy();
});
test('ambiguous decal price basis and nominal digital quantities are explicitly preserved',()=>{
  const view=build();view.showVariant('table-vp-decal-9x5.5-1000');
  const table=byClass(view.element,'ta-price-table')[0];assert.match(table.textContent,/cơ sở thanh toán cần xác nhận/);assert.doesNotMatch(table.textContent,/\/(?:tem|cái)/);
  view.showVariant('table-vp-digital-briston300');assert.match(byClass(view.element,'ta-price-table')[0].textContent,/Số lượng đơn chưa xác minh/);assert.doesNotMatch(byClass(view.element,'ta-price-table')[0].textContent,/1 hộp/);view.destroy();
});
test('A5 estimate and quarantined envelope never masquerade as fixed table or conflict price',()=>{
  const view=build();view.showVariant('estimate-catalogue-a5-all-c150-12-1000-estimate');
  assert.equal(byClass(view.element,'ta-price-table').length,0);assert.match(view.element.textContent,/Chỉ là ước tính/);assert.match(view.element.textContent,/5\.800 ₫/);assert.match(view.element.textContent,/A5 200 cuốn chưa có dòng giá cố định/);
  view.showVariant('reference-envelope-a5');assert.equal(byClass(view.element,'ta-price-table').length,0);assert.doesNotMatch(view.element.textContent,/1\.350|1\.700/);assert.match(view.element.textContent,/khỏi báo giá/);view.destroy();
});
test('expired, premature and invalid clocks hide all table, reference and estimate prices',()=>{
  for(const now of [Date.parse('2026-11-11T00:00:00Z'),Date.parse('2026-10-12T00:00:00Z'),NaN]) {
    const view=build({now:()=>now});
    for(const id of ['table-catalogue-a4-12-200','estimate-catalogue-a5-all-c150-12-1000-estimate','reference-kraft-bag']) {
      view.showVariant(id);assert.equal(byClass(view.element,'ta-price-table').length,0);assert.doesNotMatch(view.element.textContent,/₫/);assert.match(view.element.textContent,/tạm ngừng hiển thị giá/);assert.equal(byClass(view.element,'ta-price-zalo').length,3);
    }
    view.destroy();
  }
});
test('expiry is checked again when a visitor navigates after the review boundary',()=>{
  let now=fresh;const view=build({now:()=>now});view.showVariant('table-namecard-c300-1');assert.equal(byClass(view.element,'ta-price-table').length,1);
  now=Date.parse('2026-11-11T00:00:00Z');view.showVariant('table-namecard-c300-1');assert.equal(byClass(view.element,'ta-price-table').length,0);assert.doesNotMatch(view.element.textContent,/90\.000/);view.destroy();
});
test('literal HTML-like data is text and no unverified contact link is rendered',()=>{
  const d=structuredClone(data);d.products.find(p=>p.id==='paper-box').name='<img src=x onerror=alert(1)>';
  const view=build({data:d});view.showCategory('box');assert.ok(view.element.textContent.includes('<img src=x onerror=alert(1)>'));assert.equal(descendants(view.element,e=>e.tagName==='IMG').length,0);
  view.showVariant('reference-paper-box');assert.equal(byClass(view.element,'ta-price-zalo').length,3);view.destroy();
});
test('destroy is idempotent and stale buttons cannot render or trigger activity',()=>{
  let activities=0;const view=build({onActivity:()=>activities++});const button=byClass(view.element,'ta-price-category')[0];
  view.destroy();view.destroy();button.click();assert.equal(activities,0);assert.equal(view.getState().screen,'categories');
});
test('navigation signals activity only after the new screen and table are rendered',()=>{
  const screens=[];let view;
  view=build({onActivity:()=>screens.push({screen:view.getState().screen,rows:byClass(view.element,'ta-price-table').length?descendants(byClass(view.element,'ta-price-table')[0],e=>e.tagName==='TR'&&e.dataset.factId).length:0})});
  byClass(view.element,'ta-price-category').find(b=>b.dataset.categoryId==='catalogue').click();
  byClass(view.element,'ta-price-variant').find(b=>b.dataset.variantId==='table-catalogue-a4-12-200').click();
  assert.deepEqual(screens,[{screen:'variants',rows:0},{screen:'table',rows:21}]);view.destroy();
});
test('invalid source data is rejected before any menu renders a price',()=>{
  const d=structuredClone(data);d.products[0].priceFacts[0].sourceUrl='https://example.com/';assert.throws(()=>menu.buildCatalog(d,fresh));
});
test('supplemental variants keep all current prices while visible labels hide source branding',()=>{
  const before=JSON.stringify(data);const view=build();
  assert.doesNotMatch(view.element.textContent,/Vĩnh\s*Phát|vinh[\s-]*phat|invinhphat\.com/i);
  for(const category of catalog().categories) {
    view.showCategory(category.id);assert.doesNotMatch(view.element.textContent,/Vĩnh\s*Phát|vinh[\s-]*phat|invinhphat\.com/i);
    for(const variant of category.variants) {
      view.showVariant(variant.id);assert.doesNotMatch(view.element.textContent,/Vĩnh\s*Phát|vinh[\s-]*phat|invinhphat\.com/i,variant.id);
      if(variant.provider==='vinh-phat'&&!variant.ownerUpdated)assert.match(view.element.textContent,/Giá tham khảo/,variant.id);
    }
  }
  assert.equal(variants(catalog()).flatMap(v=>v.rows).length,facts.length);assert.equal(JSON.stringify(data),before);view.destroy();
});
test('generic source link labels retain exact original URLs and source conditions',()=>{
  const view=build();view.showVariant('table-namecard-vp-2');
  const variant=variants(catalog()).find(v=>v.id==='table-namecard-vp-2');
  assert.deepEqual(byClass(view.element,'ta-price-source').map(a=>a.href),variant.sourceUrls);
  assert.ok(byClass(view.element,'ta-price-source').every(a=>a.textContent==='Xem bảng giá gốc'));
  assert.match(view.element.textContent,/120\.000 ₫/);assert.match(view.element.textContent,/Tổng gói \/ đơn theo bảng/);
  assert.match(view.element.textContent,/100 tấm\/hộp/);assert.match(view.element.textContent,/10% VAT/);
  assert.equal(variant.provider,'vinh-phat');assert.equal(variant.rows.find(f=>f.quantity===5).priceVnd,120000);view.destroy();
});

test('all 177 historical source rows remain recoverable with their exact original content',()=>{
  assert.equal(facts.length,193);
  assert.equal(createHash('sha256').update(baselineBytes).digest('hex'),'408e5bf6fcd517a429c34abc6fb7192460584d8e16daa50a6ebfc3976b9f1c99');
  assert.equal(originalFacts.length,177);
  const hash=createHash('sha256').update(JSON.stringify(originalFacts.slice().sort((a,b)=>a.id.localeCompare(b.id)))).digest('hex');
  assert.equal(hash,originalFactsHash);
  const rows=variants(menu.buildCatalog(baselineData,fresh)).flatMap(v=>v.rows);
  assert.equal(rows.length,177);
  assert.deepEqual(rows.slice().sort((a,b)=>a.id.localeCompare(b.id)),originalFacts.slice().sort((a,b)=>a.id.localeCompare(b.id)));
});

test('owner-confirmed bag table uses C300, one side, film and ordinary nylon cord',()=>{
  const expected={
    '20x14x6':[[300,11000],[500,8000],[1000,5500],[2000,4700]],
    '25x18x8':[[300,13000],[500,9800],[1000,6500],[2000,5500]],
    '31x21x10':[[300,13500],[500,11000],[1000,7500],[2000,6400]],
    '37x27x10':[[300,16500],[500,13000],[1000,9000],[2000,8000]]
  };
  const tables=variants(catalog()).filter(v=>v.productId==='paper-bag-vp');
  assert.equal(tables.length,4);
  for(const table of tables){
    assert.deepEqual(table.rows.map(f=>[f.quantity,f.priceVnd]),expected[table.rows[0].specs.size]);
    assert.match(table.label,/Couche 300gsm.*Túi đứng.*In 1 mặt.*Cán màng.*Dây dù thường/);
    assert.doesNotMatch(table.label,/250gsm/);
    assert.ok(table.rows.every(f=>f.unit==='cái'&&f.quantityUnit==='cái'&&f.ownerPriceRevision.kind==='business-owner-price-update'));
  }
});

test('owner catalogue prices retain the full A4 C300 offset matrix without altering C250 or all-C150 tables',()=>{
  const expected={
    200:[22000,26000,30000,35000,38000,42000,45000],
    300:[20000,23000,27000,30000,34000,38000,40000],
    500:[14000,15000,17000,19500,21000,24000,25000],
    1000:[7500,9000,10000,11500,12500,14500,15000]
  };
  const tables=catalog().categories.find(c=>c.id==='catalogue').variants.filter(v=>v.kind==='table');
  const updated=tables.find(v=>v.ownerUpdated);assert.ok(updated);
  for(const [quantity,prices] of Object.entries(expected)){
    const rows=updated.rows.filter(f=>f.quantity===Number(quantity));
    assert.deepEqual(rows.map(f=>f.specs.pages),[12,16,20,24,28,32,36]);assert.deepEqual(rows.map(f=>f.priceVnd),prices);
    assert.ok(rows.every(f=>f.unit==='cuốn'&&f.specs.size==='a4'&&f.specs.material==='cover-c300'&&f.specs.cover==='c300'&&f.specs.inside==='c150'&&f.specs.printing==='offset4'&&f.specs.finishing==='staple'));
  }
  for(const table of tables.filter(v=>!v.ownerUpdated)){
    for(const row of table.rows)assert.deepEqual(row,originalFacts.find(f=>f.id===row.id));
  }
});

test('rectangular tag prices remain per actual tag, never mistaken for old lot totals',()=>{
  const expected={
    '50x30':[[1500,140],[3000,120],[6000,105]],
    '45x45':[[1000,170],[2000,140],[4000,130]],
    '90x27':[[1000,170],[2000,140],[4000,130]],
    '90x54':[[500,340],[1000,210],[2000,200]]
  };
  const view=build();const tables=variants(catalog()).filter(v=>v.productId==='tag-vp');assert.equal(tables.length,4);
  for(const table of tables){
    assert.deepEqual(table.rows.map(f=>[f.quantity,f.priceVnd]),expected[table.rows[0].specs.size]);
    assert.match(table.label,/Chữ nhật \/ vuông.*1 lỗ tròn 3 mm/);
    view.showVariant(table.id);
    const rendered=byClass(view.element,'ta-price-table')[0];
    assert.match(rendered.textContent,/Giá hiện tại/);
    for(const f of table.rows){
      assert.equal(menu.priceMeaning(f),'Giá mỗi cái');assert.equal(f.unit,'cái');assert.equal(f.quantityUnit,'cái');
      const row=descendants(rendered,e=>e.dataset.factId===f.id)[0];assert.match(row.textContent,/Giá mỗi cái/);
    }
    assert.doesNotMatch(rendered.textContent,/Tổng gói|tờ in/);
  }
  view.destroy();
});

test('earring tag table combines owner prices with the verified printing recipe without assuming lamination',()=>{
  const verifiedUrl='https://invinhphat.com/san-pham/in-tag-treo-khuyen-tai/';
  const expected={
    '50x40':[[1000,390],[2000,330],[4000,270]],
    '85x50':[[500,800],[1000,490],[2000,420]]
  };
  const view=build();const tables=variants(catalog()).filter(v=>v.productId==='earring-tag-vp');assert.equal(tables.length,2);
  for(const table of tables){
    assert.match(table.label,/Couche 300gsm.*In offset.*In 2 mặt.*Tag bông tai/);
    assert.doesNotMatch(table.label,/Có cán màng|Không cán màng|Cán màng(?! cần xác nhận)/);
    assert.match(table.label,/1 hoặc nhiều lỗ 1–5 mm/);
    assert.deepEqual(table.rows.map(f=>[f.quantity,f.priceVnd]),expected[table.rows[0].specs.size]);
    assert.ok(table.rows.every(f=>f.unit==='cái'&&f.quantityUnit==='cái'&&f.ownerPriceRevision.unitDefinitionExplicit===true));
    assert.ok(table.rows.every(f=>f.specs.material==='c300'&&f.specs.sides===2&&/^offset/.test(f.specs.printing)&&f.sourceUrl===null&&f.rawSourceFlags.ownerRecipeIncomplete===true));
    assert.ok(table.rows.every(f=>JSON.stringify(f.secondarySourceUrls)===JSON.stringify([verifiedUrl])));
    view.showVariant(table.id);assert.ok(byClass(view.element,'ta-price-table')[0].textContent.includes('Giá mỗi cái'));
    assert.deepEqual(byClass(view.element,'ta-price-source').map(a=>a.href),[verifiedUrl]);
    assert.ok(byClass(view.element,'ta-price-source').every(a=>a.textContent==='Xem trang sản phẩm tham chiếu'));
    assert.match(byClass(view.element,'ta-price-date')[0].textContent,/Trang sản phẩm bên dưới là nguồn tham chiếu/);
    assert.ok(byClass(view.element,'ta-price-zalo').length===3);
  }
  view.destroy();
});

test('owner price metadata identifies owner approval and original URL only as a reference',()=>{
  const view=build();const table=variants(catalog()).find(v=>v.productId==='paper-bag-vp');view.showVariant(table.id);
  assert.match(view.element.textContent,/Giá do chủ nhà in xác nhận ngày 13\/10\/2026/);
  assert.match(view.element.textContent,/Trang sản phẩm bên dưới là nguồn tham chiếu/);
  assert.doesNotMatch(byClass(view.element,'ta-price-intro')[0].textContent,/đã công bố/);
  assert.ok(byClass(view.element,'ta-price-source').every(a=>a.textContent==='Xem trang sản phẩm tham chiếu'));
  assert.deepEqual(byClass(view.element,'ta-price-source').map(a=>a.href),table.sourceUrls);
  assert.doesNotMatch(view.element.textContent,/Vĩnh\s*Phát|vinh[\s-]*phat|invinhphat\.com/i);
  const foot=byClass(view.element,'ta-price-footer')[0];assert.equal(foot.children[0].tagName,'STRONG');view.destroy();
});

test('owner-amended prices are hidden before the business owner approval date',()=>{
  const view=build({now:()=>Date.parse('2026-10-12T12:00:00Z')});view.showVariant('table-vp-bag-20x14x6-300');
  assert.equal(byClass(view.element,'ta-price-table').length,0);assert.match(view.element.textContent,/tạm ngừng hiển thị giá/);view.destroy();
});

test('owner confirmed row takes priority over an otherwise identical outdated website row',()=>{
  const d=structuredClone(data),product=d.products.find(p=>p.id==='tag-vp');
  const owner=product.priceFacts[0],copy=structuredClone(owner);delete copy.ownerPriceRevision;delete copy.originalSourceRecord;
  copy.id='outdated-thanh-an-tag';copy.lookupQuery='Dòng cũ trùng quy cách tag Thanh Ấn';copy.provider='thanh-an';copy.sourceUrl='https://innhanhtphcm.com/';copy.priceVnd=1;copy.sourceTotalVnd=null;
  product.relatedSourceUrls=[...(product.relatedSourceUrls||[]),copy.sourceUrl];product.priceFacts.push(copy);
  const rows=variants(menu.buildCatalog(d,fresh)).flatMap(v=>v.rows);
  assert.ok(rows.some(f=>f.id===owner.id&&f.priceVnd===140));assert.ok(!rows.some(f=>f.id===copy.id));
});

test('an incompatible retained source total is rejected before a current owner price is rendered',()=>{
  const d=structuredClone(data),row=d.products.find(p=>p.id==='tag-vp').priceFacts.find(f=>f.id==='vp-tag-50x30-1500');
  row.sourceTotalVnd=180000;
  assert.throws(()=>build({data:d}));
});

test('same-source duplicate tiers with different prices or conditions are rejected instead of silently merged',()=>{
  for(const change of [f=>{f.priceVnd=95000;},f=>{f.conditions.push('Giá cần một điều kiện thanh toán khác.');}]){
    const d=structuredClone(data),product=d.products.find(p=>p.id==='namecard-c300'),copy=structuredClone(product.priceFacts[0]);
    copy.id='same-source-conflict';copy.lookupQuery='Dòng trùng cùng nguồn cần xác nhận';change(copy);product.priceFacts.push(copy);
    assert.throws(()=>menu.buildCatalog(d,fresh),/trùng quy cách.*khác nhau/);
  }
});
