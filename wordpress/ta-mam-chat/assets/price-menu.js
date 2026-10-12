(function (root) {
  'use strict';
  const CATEGORY_DEFINITIONS = [
    ['namecard', 'Danh thiếp', ['namecard-c300', 'namecard-vp', 'namecard-digital-vp']],
    ['catalogue', 'Catalogue', ['catalogue']],
    ['decal', 'Tem nhãn & decal', ['decal-paper', 'decal-plastic', 'decal-paper-vp']],
    ['flyer', 'Tờ rơi & tờ gấp', ['flyer', 'flyer-vp']],
    ['bag', 'Túi giấy', ['kraft-bag', 'paper-bag-vp']],
    ['box', 'Hộp giấy', ['paper-box']],
    ['envelope', 'Bao thư', ['envelope-a5', 'envelope-vp']],
    ['red-envelope', 'Bao lì xì', ['red-envelope']],
    ['receipt', 'Phiếu thu', ['receipt', 'receipt-vp']],
    ['folder', 'Folder kẹp file', ['folder-vp']],
    ['tag', 'Tag treo', ['tag-vp']],
    ['menu', 'Menu', ['menu-paper']],
    ['wedding', 'Thiệp cưới', ['wedding']]
  ];
  const CONTACT_URLS = new Set(['https://zalo.me/0898739868', 'https://zalo.me/0898113688', 'https://zalo.me/0934559479']);
  const MATERIALS = {
    'c100':'Couche 100gsm', 'c150':'Couche 150gsm', 'c200':'Couche 200gsm', 'c250':'Couche 250gsm', 'c300':'Couche 300gsm',
    'all-c150':'C150 toàn bộ', 'cover-c250':'Bìa C250 / ruột C150', 'carbonless':'Carbonless', 'fort80':'Fort 80gsm',
    'fort100':'Fort 100gsm', 'fort120':'Fort 120gsm', 'briston300':'Briston 300gsm', 'briston350':'Briston 350gsm',
    'decal-paper':'Decal giấy', 'art-paper':'Giấy mỹ thuật / Fort / Kraft / giấy gân', 'art-fort-kraft-textured':'Giấy mỹ thuật / Fort / Kraft / giấy gân'
  };
  const canonical = value => JSON.stringify(Object.fromEntries(Object.entries(value || {}).sort(([a],[b]) => a.localeCompare(b))));
  const money = n => Number(n).toLocaleString('vi-VN') + ' ₫';
  const displayText = value => String(value).replace(/Vĩnh\s*Phát|vinh[\s-]*phat|invinhphat\.com/gi,'giá tham khảo');
  const providerName = provider => provider === 'vinh-phat' ? 'Giá tham khảo' : 'Thanh Ấn';
  const factKind = f => f.priceKind || 'per_unit';
  const safeSource = url => root.ThanhAnFAQ.safeLink(url);
  function isMenuRequest(text) {
    const raw = String(text || '').trim();
    if (!raw || raw.length > 1000 || /[^\p{L}\p{M}\s?.!,]/u.test(raw)) return false;
    const normalized = root.ThanhAnFAQ.normalize(raw);
    return /^(?:(?:cho (?:toi|minh|em)|toi muon|minh muon|muon|xin) )?(?:(?:xem|bao) )?(?:bang )?gia(?: in an)?(?: nhe| nha| a)?$/.test(normalized);
  }
  function rowKey(f) {
    // Missing specifications are not wildcards. Different payment meanings remain separate.
    return canonical({quantity:f.quantity, quantityUnit:f.quantityUnit, unit:f.unit, priceKind:factKind(f), specs:canonical(f.specs)});
  }
  function tableKey(f, categoryId) {
    const specs = {...f.specs};
    if (categoryId === 'catalogue') delete specs.pages;
    return canonical({provider:f.provider, sourceUrl:f.sourceUrl, unit:factKind(f) === 'source_total' ? 'published-package' : f.unit, priceKind:factKind(f), specs:canonical(specs)});
  }
  function sizeLabel(specs) {
    if (!specs.size) return '';
    if (/^a[0-9]$/i.test(specs.size)) return specs.size.toUpperCase();
    if (specs.size === 'large') return '16 × 7,4 cm · nắp 2 cm';
    return specs.size.replace(/x/g, ' × ').replace(/\./g, ',') + (specs.dimensionsUnit ? ' ' + specs.dimensionsUnit : '');
  }
  function variantLabel(categoryId, product, fact) {
    const s = fact.specs || {};
    const parts = [sizeLabel(s)];
    if (s.layers) parts.push(s.layers + ' liên');
    if (s.material) parts.push(MATERIALS[s.material] || s.material);
    if (s.printing) parts.push(s.printing === 'kts4' ? 'In kỹ thuật số' : /^offset/.test(s.printing) ? 'In offset' : s.printing === 'one-color' ? 'In một màu' : s.printing);
    if (s.cardsPerBox) parts.push(s.cardsPerBox + ' tấm/hộp');
    if (s.physicalSheetsPerBook) parts.push(s.physicalSheetsPerBook + ' tờ vật lý/cuốn');
    if (s.variant === 'with-film') parts.push('Có cán màng');
    if (s.variant === 'without-film' || s.variant === 'no-film') parts.push('Không cán màng');
    if (s.pocketHeightCm) parts.push('Túi ' + s.pocketHeightCm + ' cm');
    if (categoryId === 'namecard' && !s.cardsPerBox) parts.push('Bảng theo hộp; quy cách cần xác nhận');
    if (categoryId === 'tag') parts.push('Cán màng cần xác nhận');
    return parts.filter(Boolean).join(' · ') || product.variant || product.name;
  }
  function snapshotIsFresh(data, now) {
    return Number.isFinite(now) && now >= Date.parse(data.verifiedAtUtc) && now < Date.parse(data.snapshotDate + 'T00:00:00Z') + data.priceReviewAfterDays * 86400000;
  }
  function buildCatalog(data, now = Date.now()) {
    if (!root.ThanhAnFAQ) throw new Error('Thiếu bộ kiểm tra dữ liệu giá');
    root.ThanhAnFAQ.validateData(data);
    const fresh = snapshotIsFresh(data, now);
    const categories = [];
    for (const [id, name, productIds] of CATEGORY_DEFINITIONS) {
      const products = data.products.filter(p => productIds.includes(p.id));
      if (!products.length) continue;
      const variants = [];
      const preferred = new Map();
      for (const product of products) for (const fact of product.priceFacts || []) {
        const key = rowKey(fact);
        const previous = preferred.get(key);
        if (!previous || (fact.provider === 'thanh-an' && previous.fact.provider !== 'thanh-an')) preferred.set(key, {product, fact});
      }
      const tables = new Map();
      for (const {product, fact} of preferred.values()) {
        const key = tableKey(fact, id);
        let variant = tables.get(key);
        if (!variant) {
          variant = {id:'table-' + fact.id, categoryId:id, kind:'table', label:variantLabel(id, product, fact), provider:fact.provider,
            sourceUrl:fact.sourceUrl, productId:product.id, rows:[], missingConditions:[], sourceUrls:[], sourceNotes:[]};
          tables.set(key, variant); variants.push(variant);
        }
        variant.rows.push(fact);
        for (const url of [fact.sourceUrl, ...(fact.secondarySourceUrls || [])]) if (!variant.sourceUrls.includes(url)) variant.sourceUrls.push(url);
        if (!variant.sourceNotes.includes(fact.sourceNote)) variant.sourceNotes.push(fact.sourceNote);
        for (const condition of fact.rawSourceFlags?.missingConditions || []) if (!variant.missingConditions.includes(condition)) variant.missingConditions.push(condition);
      }
      for (const variant of variants) {
        variant.rows.sort((a,b) => (a.specs?.pages || 0) - (b.specs?.pages || 0) || a.quantity - b.quantity);
        variant.referenceOnly = variant.rows.every(f => factKind(f) === 'reference_display');
      }
      for (const product of products) {
        for (const estimate of product.referenceEstimates || []) variants.push({id:'estimate-' + estimate.id, categoryId:id, kind:'estimate',
          label:'A5 · C150 toàn bộ · 12 trang gồm bìa · Ước tính', provider:'vinh-phat', productId:product.id,
          sourceUrl:estimate.sourceUrl, sourceUrls:[estimate.sourceUrl], estimate, rows:[]});
        if (!product.priceFacts?.length) variants.push({id:'reference-' + product.id, categoryId:id,
          kind:product.quotationStatus === 'conflict_handoff_only' ? 'conflict' : 'reference',
          label:product.name, provider:product.provider || 'thanh-an', sourceUrl:product.sourceUrl, sourceUrls:[product.sourceUrl], product, rows:[]});
      }
      categories.push({id, name, variants});
    }
    return {fresh, snapshotDate:data.snapshotDate, snapshotLabel:data.snapshotLabel, categories};
  }
  function priceMeaning(f) {
    if (factKind(f) === 'source_total') return 'Tổng gói / đơn theo bảng';
    if (factKind(f) === 'reference_display') return f.rawSourceFlags?.paymentBasisRequiresConfirmation ? 'Giá trị ô bảng; cơ sở thanh toán cần xác nhận' : 'Tham khảo; điều kiện đơn cần xác nhận';
    return 'Giá mỗi ' + f.unit;
  }
  function create(config = {}) {
    const doc = config.document || root.document;
    if (!doc) throw new Error('Thiếu DOM để hiển thị bảng giá');
    const data = config.data;
    const clock = typeof config.now === 'function' ? config.now : () => Date.now();
    let catalog = buildCatalog(data, clock()), destroyed = false, state = {screen:'categories', categoryId:null, variantId:null};
    const make = (tag, className, text, parent) => {const e = doc.createElement(tag);if(className)e.className=className;if(text !== undefined)e.textContent=displayText(text);if(parent)parent.appendChild(e);return e;};
    const element = make('section', 'ta-price-menu');element.setAttribute('aria-label', 'Chọn sản phẩm và xem bảng giá website');
    function activity() {if (typeof config.onActivity === 'function') config.onActivity('working');}
    function action(label, className, parent, callback) {
      const button = make('button', className, label, parent);button.type='button';
      button.addEventListener('click', () => {if(destroyed)return;callback();activity();});return button;
    }
    function refresh() {catalog = buildCatalog(data, clock());}
    function header(title, subtitle, back, focus) {
      element.replaceChildren();element.dataset.screen=state.screen;
      if (back) action('← Quay lại', 'ta-price-back', element, back);
      const heading=make('h3','ta-price-title',title,element);heading.tabIndex=-1;
      if(subtitle)make('p','ta-price-intro',subtitle,element);
      if(focus)heading.focus({preventScroll:true});
    }
    function sourceLinks(parent, urls) {
      const links = make('div','ta-price-sources',undefined,parent);
      for(const url of [...new Set(urls)]) {
        const safe=safeSource(url);if(!safe)continue;
        const a=make('a','ta-price-source','Xem bảng giá gốc',links);
        a.href=safe;a.target='_blank';a.rel='noopener noreferrer';a.referrerPolicy='no-referrer';
      }
    }
    function footer() {
      const foot=make('div','ta-price-footer',undefined,element);
      make('strong','','Nếu bảng chưa có quy cách bạn cần, hãy nhắn Zalo để được tư vấn.',foot);
      const contacts=make('div','ta-price-contacts',undefined,foot);
      for(const contact of data.contacts) {
        if(!CONTACT_URLS.has(contact.zalo))continue;
        const link=make('a','ta-price-zalo',contact.name+' · Zalo',contacts);
        link.href=contact.zalo;link.target='_blank';link.rel='noopener noreferrer';link.referrerPolicy='no-referrer';
        link.setAttribute('aria-label','Mở Zalo của '+contact.name);
      }
    }
    function metadata(variant) {
      make('p','ta-price-date','Nguồn: '+providerName(variant.provider)+' · Dữ liệu website ngày '+catalog.snapshotLabel+'. Cần nhà in xác nhận đơn thực tế.',element);
      sourceLinks(element,variant.sourceUrls);
    }
    function showCategories(options = {}) {
      if(destroyed)return;refresh();state={screen:'categories', categoryId:null, variantId:null};
      header('Bạn cần in gì?', 'Chọn sản phẩm, rồi chọn quy cách để xem toàn bộ bảng đã công bố.', null, options.focus === true);
      const list=make('div','ta-price-options',undefined,element);
      for(const category of catalog.categories) {
        const b=action(category.name,'ta-price-category',list,()=>showCategory(category.id));b.dataset.categoryId=category.id;
      }
      make('p','ta-price-note','Giá là dữ liệu website ngày '+catalog.snapshotLabel+'. Ưu tiên bảng Thanh Ấn cho đúng quy cách; giá tham khảo bổ sung các phương án còn thiếu và cần tư vấn viên xác nhận.',element);
    }
    function showCategory(id) {
      if(destroyed)return;refresh();const category=catalog.categories.find(c=>c.id===id);if(!category)return;
      state={screen:'variants', categoryId:id, variantId:null};
      header(category.name+' · Chọn quy cách','Chọn một phương án bên dưới. Số lượng và các mức giá sẽ hiện cùng trong bảng.',()=>showCategories({focus:true}),true);
      const list=make('div','ta-price-options ta-price-variants',undefined,element);
      for(const variant of category.variants) {
        const b=action('', 'ta-price-variant',list,()=>showVariant(variant.id));b.dataset.variantId=variant.id;
        make('span','ta-price-variant-label',variant.label,b);
        make('small','ta-price-variant-meta',providerName(variant.provider)+' · '+(variant.kind==='table' ? variant.referenceOnly ? 'Bảng tham khảo' : 'Bảng giá website' : variant.kind==='estimate' ? 'Chỉ có ước tính' : variant.kind==='conflict' ? 'Cần tư vấn xác nhận' : 'Chưa có bảng đủ quy cách'),b);
      }
    }
    function renderTable(variant) {
      const rows=variant.rows;
      const common=rows[0].conditions.filter(condition=>rows.every(row=>row.conditions.includes(condition)));
      if(common.length) {const list=make('ul','ta-price-conditions',undefined,element);common.forEach(condition=>make('li','',condition,list));}
      if(variant.categoryId==='catalogue' && rows.some(row=>row.specs?.pagesIncludeCover === undefined))make('p','ta-price-warning','Số trang: nguồn chưa xác định rõ đã gồm bìa hay chưa; cần nhà in xác nhận.',element);
      const wrapper=make('div','ta-price-table-wrap',undefined,element);wrapper.tabIndex=0;wrapper.setAttribute('role','region');wrapper.setAttribute('aria-label','Bảng giá cuộn ngang khi cần');
      const table=make('table','ta-price-table',undefined,wrapper);table.dataset.variantId=variant.id;
      make('caption','ta-sr-only','Toàn bộ các dòng đã xác minh cho '+variant.label,table);
      const hasPages=rows.some(row=>row.specs?.pages);const head=make('tr','',undefined,make('thead','',undefined,table));
      for(const label of [...(hasPages?['Số trang']:[]),'Số lượng','Giá tại nguồn','Ý nghĩa / đơn vị']) {const th=make('th','',label,head);th.scope='col';}
      const body=make('tbody','',undefined,table);
      for(const row of rows) {
        const tr=make('tr','',undefined,body);tr.dataset.factId=row.id;
        if(hasPages) {const th=make('th','',String(row.specs?.pages ?? '—'),tr);th.scope='row';}
        const quantity = row.rawSourceFlags?.nominalQuantityBasisOnly ? 'Số lượng đơn chưa xác minh' : row.quantity.toLocaleString('vi-VN')+' '+row.quantityUnit;
        const quantityCell=make(hasPages?'td':'th','ta-price-quantity',quantity,tr);
        if(!hasPages)quantityCell.scope='row';
        quantityCell.dataset.quantity=String(row.quantity);
        make('td','ta-price-amount',money(row.priceVnd),tr);
        make('td','ta-price-meaning',priceMeaning(row),tr);
      }
      for(const note of variant.sourceNotes)make('p','ta-price-note',note,element);
      if(rows.some(row=>row.sourceTotalVnd !== null && factKind(row)!=='source_total')) {
        const totals=make('details','ta-price-totals',undefined,element);
        make('summary','','Xem tổng ghi sẵn tại nguồn (không phải phép tính của Mầm)',totals);
        const list=make('ul','',undefined,totals);
        for(const row of rows) if(row.sourceTotalVnd !== null && factKind(row)!=='source_total')make('li','',row.quantity.toLocaleString('vi-VN')+' '+row.quantityUnit+': '+money(row.sourceTotalVnd)+' · Tổng nguồn công bố',list);
      }
      const details=make('details','ta-price-row-details',undefined,element);make('summary','','Xem toàn bộ điều kiện của từng dòng',details);
      for(const row of rows) {
        const section=make('div','ta-price-row-condition',undefined,details);section.dataset.factId=row.id;
        make('strong','',hasPages?row.specs.pages+' trang · '+row.quantity.toLocaleString('vi-VN')+' '+row.quantityUnit:row.rawSourceFlags?.nominalQuantityBasisOnly?'Giá tham khảo theo hộp':row.quantity.toLocaleString('vi-VN')+' '+row.quantityUnit,section);
        const list=make('ul','',undefined,section);row.conditions.forEach(condition=>make('li','',condition,list));
      }
    }
    function showVariant(id) {
      if(destroyed)return;refresh();const category=catalog.categories.find(c=>c.variants.some(v=>v.id===id));const variant=category?.variants.find(v=>v.id===id);if(!variant)return;
      state={screen:'table',categoryId:category.id,variantId:id};
      header(variant.label,variant.kind==='table' ? variant.referenceOnly ? 'Bảng tham khảo từ website · Điều kiện cần xác nhận' : 'Bảng giá đã công bố cho đúng phương án này' : 'Thông tin nguồn cần tư vấn xác nhận',()=>showCategory(category.id),true);
      metadata(variant);
      if(!catalog.fresh)make('p','ta-price-warning','Snapshot đã đến hạn kiểm tra hoặc chưa thể dùng ở thời điểm này. Mầm tạm ngừng hiển thị giá; hãy nhắn Zalo để xác nhận.',element);
      else if(variant.kind==='table')renderTable(variant);
      else if(variant.kind==='estimate') {
        make('p','ta-price-warning','Chỉ là ước tính tham khảo, không phải bảng giá cố định. Không áp dụng cho số lượng hoặc quy cách khác.',element);
        const e=variant.estimate;make('p','ta-price-estimate','Ước tính tại nguồn: '+money(e.priceVnd)+'/'+e.unit+' · '+e.quantity.toLocaleString('vi-VN')+' '+e.quantityUnit,element);
        const list=make('ul','ta-price-conditions',undefined,element);e.conditions.forEach(condition=>make('li','',condition,list));make('p','ta-price-note',e.sourceNote,element);
        make('p','ta-price-warning','A5 200 cuốn chưa có dòng giá cố định; không áp bảng A4 cho A5. Cần gửi file để được xác nhận.',element);
      } else if(variant.kind==='conflict')make('p','ta-price-warning',(variant.product.conflictReason || 'Thông tin giá tại nguồn chưa thống nhất.')+' Mầm giữ mức này khỏi báo giá tự động.',element);
      else {
        const p=variant.product;
        make('p','ta-price-warning','Website chưa có bảng đủ quy cách cho lựa chọn này. Giá hiển thị chỉ là tham khảo; chưa phải báo giá cho đơn của bạn.',element);
        if(Number.isFinite(p.displayPriceVnd) && p.displayPriceVnd > 0)make('p','ta-price-reference','Giá hiển thị tại nguồn: '+money(p.displayPriceVnd)+' · Chưa xác minh đơn vị tính / điều kiện áp dụng.',element);
        if(p.referenceNote)make('p','ta-price-note',p.referenceNote,element);
        if(p.missingConditions?.length)make('p','ta-price-note','Cần xác nhận: '+p.missingConditions.join(', ')+'.',element);
      }
      footer();
    }
    showCategories();
    return Object.freeze({element,showCategories,showCategory,showVariant,getState:()=>({...state}),destroy(){if(destroyed)return;destroyed=true;element.remove();}});
  }
  root.ThanhAnPriceMenu=Object.freeze({create,buildCatalog,isMenuRequest,priceMeaning,displayText});
})(typeof window !== 'undefined' ? window : globalThis);
