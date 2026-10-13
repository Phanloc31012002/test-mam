import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';

const root=new URL('../',import.meta.url);
const data=JSON.parse(fs.readFileSync(new URL('widget/data.json',root),'utf8'));
const revision=JSON.parse(fs.readFileSync(new URL('docs/owner-price-revision-20261013.json',root),'utf8'));
const backupBytes=fs.readFileSync(new URL('docs/published-price-baseline-20261012.json',root));
const baseline=JSON.parse(backupBytes);
const sha='408e5bf6fcd517a429c34abc6fb7192460584d8e16daa50a6ebfc3976b9f1c99';
const facts=d=>d.products.flatMap(p=>(p.priceFacts||[]).map(f=>({productId:p.id,fact:f})));
const currentFacts=facts(data),baseFacts=facts(baseline);
const sourceMap=new Map(baseFacts.map(x=>[x.fact.id,x]));
const allMap=new Map(currentFacts.map(x=>[x.fact.id,x]));
const ownerFacts=currentFacts.filter(x=>x.fact.ownerPriceRevision);
const originalOwnerFacts=ownerFacts.filter(x=>x.fact.originalSourceRecord);
const addedOwnerFacts=ownerFacts.filter(x=>x.fact.ownerPriceRevision.isNewRecord);
const product=id=>data.products.find(p=>p.id===id);

test('Immutable historical baseline has exact 177-fact SHA and existing metadata',()=>{
  assert.equal(crypto.createHash('sha256').update(backupBytes).digest('hex'),sha);
  assert.equal(baseFacts.length,177);assert.equal(data.snapshotDate,baseline.snapshotDate);assert.equal(data.verifiedAtUtc,baseline.verifiedAtUtc);assert.equal(data.snapshotLabel,baseline.snapshotLabel);
  assert.equal(data.ownerPriceRevision.baselineSha256,sha);assert.equal(data.ownerPriceRevision.historicalWebsiteSnapshotDate,'2026-10-12');
});
test('Complete local revision has 193 unique facts with 46 amendments and 16 new rows',()=>{
  assert.equal(currentFacts.length,193);assert.equal(allMap.size,193);assert.equal(originalOwnerFacts.length,46);assert.equal(addedOwnerFacts.length,16);assert.equal(ownerFacts.length,62);
  assert.equal(revision.currentPriceFactCount,193);assert.deepEqual(revision.pendingCells,[]);assert.equal(data.ownerPriceRevision.approvedAllCells,true);
});
test('Owner provenance records both businesses without pretending the website was updated',()=>{
  assert.equal(data.ownerPriceRevision.revisionId,'owner-price-revision-2026-10-13');assert.equal(data.ownerPriceRevision.kind,'business-owner-price-update');assert.equal(data.ownerPriceRevision.approvedOn,'2026-10-13');assert.deepEqual(data.ownerPriceRevision.appliesToProviders,['thanh-an','vinh-phat']);assert.equal(data.ownerPriceRevision.websitePublicationVerified,false);
  for(const {fact:f} of ownerFacts){assert.equal(f.ownerPriceRevision.revisionId,data.ownerPriceRevision.revisionId);assert.equal(f.ownerPriceRevision.kind,'business-owner-price-update');assert.equal(f.ownerPriceRevision.approvedOn,'2026-10-13');assert.deepEqual(f.ownerPriceRevision.appliesToProviders,['thanh-an','vinh-phat']);assert.equal(f.ownerPriceRevision.websitePublicationVerified,false);assert.equal(f.priceKind,'per_unit');assert.equal(f.priceBasis,'per-unit');assert.equal(f.unit,f.quantityUnit);}
});
test('Every historical fact ID remains present; each amendment retains its full original record',()=>{
  for(const {fact:f} of baseFacts){const next=allMap.get(f.id)?.fact;assert.ok(next,`Missing original fact ${f.id}`);if(next.ownerPriceRevision){assert.deepEqual(next.originalSourceRecord,f);assert.equal(next.provider,f.provider);assert.equal(next.sourceUrl,f.sourceUrl);assert.equal(next.verifiedAtUtc,f.verifiedAtUtc);assert.ok(!Object.hasOwn(next.originalSourceRecord,'originalSourceRecord'));}else assert.deepEqual(next,f);}
});
test('New records have explicit owner recipes and never fabricate historical original records',()=>{
  for(const {fact:f} of addedOwnerFacts){assert.equal(f.ownerPriceRevision.isNewTier,true);assert.equal(f.ownerPriceRevision.isNewRecord,true);assert.ok(!Object.hasOwn(f,'originalSourceRecord'));assert.ok(f.sourceOwnerRecipe);assert.ok(!sourceMap.has(f.id));}
});
test('Only bag, ordinary tag, selected VP catalogue and new earring tag records changed',()=>{
  assert.deepEqual([...new Set(ownerFacts.map(x=>x.productId))].sort(),['catalogue','earring-tag-vp','paper-bag-vp','tag-vp']);
  for(const p of baseline.products.filter(p=>!['catalogue','paper-bag-vp','tag-vp'].includes(p.id))){assert.deepEqual(product(p.id),p);}
});
test('TA KTS and all-C150 catalogue facts stay exactly unchanged including all 36-page TA facts',()=>{
  const old=baseline.products.find(p=>p.id==='catalogue').priceFacts;
  for(const f of old.filter(f=>f.specs.printing==='kts4'||f.specs.material==='all-c150'))assert.deepEqual(allMap.get(f.id).fact,f);
  assert.equal(old.filter(f=>f.specs.printing==='kts4').length,21);assert.equal(old.filter(f=>f.specs.material==='all-c150').length,18);
});
test('Historical VAT fields are preserved without new rates or inclusive-price assumptions',()=>{
  const keys=['vatExcluded','vatRatePercent','designExcluded','designIncluded'];
  for(const {fact:f} of originalOwnerFacts){for(const key of keys)assert.equal(f.rawSourceFlags?.[key],f.originalSourceRecord.rawSourceFlags?.[key]);}
});

const sizes=['20x14x6','25x18x8','31x21x10','37x27x10'];
const bagMatrix={300:[11000,13000,13500,16500],500:[8000,9800,11000,13000],1000:[5500,6500,7500,9000],2000:[4700,5500,6400,8000]};
for(const [q,prices] of Object.entries(bagMatrix))for(let i=0;i<sizes.length;i++)test(`Bag C300 ${sizes[i]} quantity ${q}: ${prices[i]} VND/cái`,()=>{
  const f=allMap.get(`vp-bag-${sizes[i]}-${q}`).fact;assert.equal(f.priceVnd,prices[i]);assert.equal(f.quantity,Number(q));assert.equal(f.quantityUnit,'cái');assert.equal(f.sourceTotalVnd,null);assert.deepEqual(f.specs,{...f.originalSourceRecord.specs,material:'c300',cord:'ordinary-nylon'});assert.equal(f.specs.sides,1);assert.equal(f.specs.variant,'vertical');assert.equal(f.specs.finishing,'film');assert.ok(f.conditions.some(c=>c.includes('Couche 300gsm')));assert.ok(!f.conditions.some(c=>c.includes('Couche 250gsm')));
});
test('All five formerly unclear slash cells are owner-confirmed and retained at original unit prices',()=>{
  for(const id of ['vp-bag-20x14x6-1000','vp-bag-25x18x8-1000','vp-bag-31x21x10-1000','vp-bag-37x27x10-1000','vp-bag-25x18x8-2000']){const f=allMap.get(id).fact;assert.equal(f.priceVnd,f.originalSourceRecord.priceVnd);assert.equal(f.specs.material,'c300');assert.ok(f.ownerPriceRevision);}
});

const tagExpected={'vp-tag-50x30-1500':140,'vp-tag-50x30-3000':120,'vp-tag-50x30-6000':105,'vp-tag-45x45-1000':170,'vp-tag-45x45-2000':140,'vp-tag-45x45-4000':130,'vp-tag-90x27-1000':170,'vp-tag-90x27-2000':140,'vp-tag-90x27-4000':130,'vp-tag-90x54-500':340,'vp-tag-90x54-1000':210,'vp-tag-90x54-2000':200};
const totals={'vp-tag-45x45-1000':170000,'vp-tag-45x45-2000':280000,'vp-tag-90x27-1000':170000,'vp-tag-90x27-2000':280000,'vp-tag-90x54-1000':210000};
for(const [id,price] of Object.entries(tagExpected))test(`Rectangular tag ${id}: owner per-unit ${price}`,()=>{
  const f=allMap.get(id).fact;assert.equal(f.priceVnd,price);assert.equal(f.sourceTotalVnd,totals[id]??null);assert.equal(f.quantityUnit,'cái');assert.equal(f.ownerPriceRevision.unitDefinitionExplicit,true);assert.deepEqual(f.specs,{...f.originalSourceRecord.specs,holeCount:1,holeShape:'round',holeDiameterMm:3});assert.equal(f.rawSourceFlags.laminationAmbiguous,true);if(f.sourceTotalVnd!==null)assert.equal(f.sourceTotalVnd,f.priceVnd*f.quantity);
});
test('Outdated rectangular tag totals are archived, not silently paired with new unit prices',()=>{
  for(const id of Object.keys(tagExpected).filter(id=>!Object.hasOwn(totals,id))){const f=allMap.get(id).fact;assert.equal(f.sourceTotalVnd,null);assert.ok(f.originalSourceRecord.sourceTotalVnd>0);assert.equal(f.rawSourceFlags.publishedTotalVerified,false);}
});

const pages=[12,16,20,24,28,32,36];
const catExpected={200:[22000,26000,30000,35000,38000,42000,45000],300:[20000,23000,27000,30000,34000,38000,40000],500:[14000,15000,17000,19500,21000,24000,25000],1000:[7500,9000,10000,11500,12500,14500,15000]};
for(const [q,prices] of Object.entries(catExpected))for(let i=0;i<pages.length;i++)test(`Owner catalogue A4 offset C300/C150 ${pages[i]} pages quantity ${q}: ${prices[i]} VND/cuốn`,()=>{
  const matches=product('catalogue').priceFacts.filter(f=>f.ownerPriceRevision&&f.quantity===Number(q)&&f.specs.pages===pages[i]);assert.equal(matches.length,1);const f=matches[0];assert.equal(f.priceVnd,prices[i]);assert.equal(f.quantityUnit,'cuốn');assert.equal(f.sourceTotalVnd,null);assert.equal(f.provider,'vinh-phat');assert.equal(f.sourceUrl,'https://invinhphat.com/san-pham/in-catalouge/');assert.equal(f.specs.cover,'c300');assert.equal(f.specs.inside,'c150');assert.equal(f.specs.material,'cover-c300');assert.equal(f.specs.printing,'offset4');assert.equal(f.specs.finishing,'staple');assert.equal(f.specs.size,'a4');assert.ok(f.conditions.some(c=>c.includes('Couche 300gsm')));assert.ok(!f.conditions.some(c=>c.includes('Couche 250gsm')));if(Number(q)===300||pages[i]===36){assert.equal(f.ownerPriceRevision.isNewRecord,true);assert.ok(!f.originalSourceRecord);}else assert.ok(f.originalSourceRecord);
});
test('Catalogue count discrepancy is resolved by ten explicit new owner records, not replacing TA facts',()=>{
  assert.equal(product('catalogue').priceFacts.filter(f=>f.ownerPriceRevision).length,28);assert.equal(product('catalogue').priceFacts.filter(f=>f.ownerPriceRevision?.isNewRecord).length,10);assert.equal(product('catalogue').priceFacts.filter(f=>f.ownerPriceRevision?.isNewRecord&&f.quantity===300).length,7);assert.equal(product('catalogue').priceFacts.filter(f=>f.ownerPriceRevision?.isNewRecord&&f.quantity!==300).length,3);
});

const earExpected={'50x40':[[1000,390],[2000,330],[4000,270]],'85x50':[[500,800],[1000,490],[2000,420]]};
for(const [size,rows] of Object.entries(earExpected))for(const [q,price] of rows)test(`New earring tag ${size} ${q}: owner unit price ${price}`,()=>{
  const f=allMap.get(`owner-earring-tag-${size}-${q}`).fact;assert.equal(f.priceVnd,price);assert.equal(f.quantity,q);assert.equal(f.ownerPriceRevision.unitDefinitionExplicit,true);assert.equal(f.ownerPriceRevision.isNewRecord,true);assert.ok(f.sourceOwnerRecipe);assert.ok(!f.originalSourceRecord);assert.equal(f.specs.size,size);assert.equal(f.specs.dimensionsUnit,'mm');assert.equal(f.unit,f.quantityUnit);assert.ok(['cái','con'].includes(f.unit));assert.equal(f.sourceTotalVnd,size==='50x40'&&q===1000?390000:null);
});
test('Earring rows belong to a separate product and do not alter ordinary tag or namecard variants',()=>{
  assert.equal(product('earring-tag-vp').priceFacts.length,6);assert.equal(product('tag-vp').priceFacts.length,12);for(const id of ['namecard-c300','namecard-vp','namecard-digital-vp'])assert.deepEqual(product(id),baseline.products.find(p=>p.id===id));
});
test('Verified earring secondary source adds C300 and offset two sides while lamination still requires handoff',()=>{
  const url='https://invinhphat.com/san-pham/in-tag-treo-khuyen-tai/';const p=product('earring-tag-vp');assert.equal(p.sourceUrl,null);assert.equal(p.verifiedAtUtc,null);assert.deepEqual(p.secondarySourceUrls,[url]);assert.ok(p.selectionQuestion);assert.equal(p.rawSourceFlags.ownerRecipeIncomplete,true);assert.equal(p.rawSourceFlags.websiteSourceUnverified,true);assert.equal(p.rawSourceFlags.laminationAmbiguous,true);assert.deepEqual(p.missingConditions,['cán màng mờ hay không cán màng','cán màng có nằm trong giá']);assert.ok(p.sourceOwnerRecipe);
  for(const f of p.priceFacts){assert.equal(f.sourceUrl,null);assert.equal(f.verifiedAtUtc,null);assert.deepEqual(f.secondarySourceUrls,[url]);assert.equal(f.rawSourceFlags.ownerRecipeIncomplete,true);assert.equal(f.rawSourceFlags.websiteSourceUnverified,true);assert.equal(f.rawSourceFlags.laminationAmbiguous,true);assert.deepEqual(f.rawSourceFlags.missingConditions,p.missingConditions);assert.equal(f.specs.material,'c300');assert.equal(f.specs.sides,2);assert.equal(f.specs.printing,'offset-multicolor');assert.ok(!Object.hasOwn(f.specs,'finishing'));assert.ok(!Object.hasOwn(f.specs,'lamination'));assert.deepEqual(f.specs.shapesAllowed,['ellipse','round','flower','heart']);assert.equal(f.specs.holeCountAllowed,'one-or-many');assert.deepEqual(f.specs.holeDiameterRangeMm,[1,5]);const e=f.sourceOwnerRecipe.currentWebsiteEvidence;assert.equal(e.url,url);assert.equal(e.readAtUtc,revision.currentWebsiteEvidence.readAtUtc);assert.match(e.readAtUtc,/^2026-10-13T/);assert.deepEqual(e.verifiedFields,{material:'c300',sides:2,printing:'offset-multicolor'});assert.equal(e.laminationInPriceUnspecified,true);assert.deepEqual(e.availableLaminationOptions,['matte','none']);assert.equal(e.publishedSourceTotalsVnd[f.id],f.quantity*f.priceVnd);assert.deepEqual(f.sourceOwnerRecipe.unresolvedFields,['laminationChoice','laminationIncludedInPrice']);for(const key of ['vatRatePercent','vatExcluded','designExcluded','designIncluded'])assert.ok(!Object.hasOwn(f.rawSourceFlags,key));}
});
test('Metadata refinement preserves every price, total, unit, primary source and owner approval across all 193 facts',()=>{
  const fields=data.products.flatMap(p=>(p.priceFacts||[]).map(f=>({id:f.id,priceVnd:f.priceVnd,sourceTotalVnd:f.sourceTotalVnd,quantity:f.quantity,quantityUnit:f.quantityUnit,unit:f.unit,priceKind:f.priceKind,priceBasis:f.priceBasis,sourceUrl:f.sourceUrl,verifiedAtUtc:f.verifiedAtUtc,ownerPriceRevision:f.ownerPriceRevision})));
  const expected='37f040218fa97365900ebd993906095f7820a7728740ae8cdb297f0982e25de0';assert.equal(crypto.createHash('sha256').update(JSON.stringify(fields)).digest('hex'),expected);assert.equal(revision.metadataRefinement.unchanged193PriceAndPrimarySourceFingerprintSha256,expected);
});
test('All approved owner unit-price tier groups are non-increasing with quantity',()=>{
  const groups=new Map();for(const {productId,fact:f} of ownerFacts){const key=JSON.stringify({productId,provider:f.provider,unit:f.unit,specs:f.specs});if(!groups.has(key))groups.set(key,[]);groups.get(key).push(f);}for(const rows of groups.values()){rows.sort((a,b)=>a.quantity-b.quantity);for(let i=1;i<rows.length;i++){assert.ok(rows[i].quantity>rows[i-1].quantity);assert.ok(rows[i].priceVnd<=rows[i-1].priceVnd,`${rows[i].id} increases unexpectedly`);}}
});
