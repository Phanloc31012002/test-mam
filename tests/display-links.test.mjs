import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import '../widget/policy.js';
const faq=globalThis.ThanhAnFAQ;
const pairs=[
 ['in-name-card-visit-danh-thiep-gia-re/','in-danh-thiep-chuan-gia-re'],
 ['in-name-card-gia-re/','dia-chi-in-combo-10-hop-card'],
 ['cong-ty-in-danh-thiep-nhanh-gia-re-tphcm/','in-danh-thiep-giay-c300-gia-re'],
 ['in-catalouge/','in-catalogue-gia-re-lay-lien-tai-tphcm'],
 ['in-to-roi-to-gap-brochure-leaflets-gia-re/','in-to-roi-lay-ngay'],
 ['in-bao-thu-bi-thu-phong-bi-gia-re-2/','in-bao-thu-a5-in-nhanh-gia-re'],
 ['phieu-thu-cac-loai/','in-bien-nhan-gia-re'],
 ['in-tui-giay-gia-re/','in-tui-giay-uy-tin'],
 ['in-folder-kep-file/','in-bia-kep-ho-so-tphcm'],
 ['in-tag-treo-the-bai/','in-tag-be-lay-ngay']
].map(([from,to])=>['https://invinhphat.com/san-pham/'+from,'https://innhanhtphcm.com/san-pham/'+to]);
test('navigation map contains exactly the ten owner-provided pairs and cannot be edited',()=>{
 assert.deepEqual(Object.entries(faq.DISPLAY_LINKS),pairs);
 assert.equal(Object.isFrozen(faq.DISPLAY_LINKS),true);
 assert.throws(()=>{faq.DISPLAY_LINKS[pairs[0][0]]='https://example.com';},TypeError);
});
for(const[from,to]of pairs)test('display link maps the exact approved '+from,()=>{
 assert.equal(faq.displayLink(from),to);assert.equal(faq.safeLink(from),from);assert.equal(faq.safeLink(to),to);
});
test('unknown values, alternate spellings, query strings, fragments and inherited names are not rewritten',()=>{
 for(const value of [null,undefined,0,'toString','__proto__','javascript:alert(1)','https://example.com',pairs[0][0]+'?q=1',pairs[0][0]+'#details',pairs[0][0].slice(0,-1)])assert.equal(faq.displayLink(value),value);
});
test('catalogue A5, paper decal and earring tags retain their exact original links',()=>{
 for(const url of ['https://invinhphat.com/san-pham/in-catalogue-a5/','https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/','https://invinhphat.com/san-pham/in-tag-treo-khuyen-tai/'])assert.equal(faq.displayLink(url),url);
});
test('presentation mapping does not edit any of the 196 prices or their provenance',()=>{
 const data=JSON.parse(fs.readFileSync(new URL('../widget/data.json',import.meta.url),'utf8'));
 const before=JSON.stringify(data);const facts=data.products.flatMap(product=>product.priceFacts||[]);
 assert.equal(facts.length,196);
 for(const fact of facts){faq.displayLink(fact.sourceUrl);for(const url of fact.secondarySourceUrls||[])faq.displayLink(url);}
 assert.equal(JSON.stringify(data),before);
});
