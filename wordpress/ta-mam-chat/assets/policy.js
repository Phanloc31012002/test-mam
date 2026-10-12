(function (root) {
  'use strict';
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const contains = (text, phrase) => (' ' + text + ' ').includes(' ' + normalize(phrase) + ' ');
  const money = value => new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
  // Presentation only: provider ids, row selectors, source URLs and data stay unchanged.
  const displayText = value => String(value ?? '').replace(/\bhttps?:\/\/(?:www\.)?invinhphat\.com(?:\/[^\s]*)?/giu, 'nguồn tham khảo').replace(/\binvinhphat\.com\b/giu, 'nguồn tham khảo').replace(/\bV[ĩi]nh[\s-]*Ph[áa]t\b/giu, 'Giá tham khảo');
  const safeLink = value => {
    try { const u = new URL(value); return u.protocol === 'https:' && ['innhanhtphcm.com', 'invinhphat.com', 'zalo.me'].includes(u.hostname) && !u.port && !u.username && !u.password ? u.href : null; } catch (_) { return null; }
  };
  const websiteSource = value => Boolean(safeLink(value)) && ['innhanhtphcm.com', 'invinhphat.com'].includes(new URL(value).hostname);
  const nonempty = value => typeof value === 'string' && value.trim().length > 0;
  const stringList = value => Array.isArray(value) && value.length > 0 && value.every(nonempty);
  const positiveInteger = value => Number.isSafeInteger(value) && value > 0;
  const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + 'T00:00:00Z')) && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
  const validVerifiedTime = (value, date) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().replace('.000', '') === value && value.slice(0, 10) === date;
  function validateData(data) {
    if (!data || data.schemaVersion !== 1 || !validDate(data.snapshotDate) || !validVerifiedTime(data.verifiedAtUtc, data.snapshotDate) || !nonempty(data.snapshotLabel) || !positiveInteger(data.priceReviewAfterDays) || data.priceReviewAfterDays > 30 || !Array.isArray(data.products) || !data.products.length || !Array.isArray(data.contacts) || !data.contacts.length || !data.faq) throw new Error('Dữ liệu FAQ hoặc ngày kiểm tra không hợp lệ');
    const productIds = new Set(), factIds = new Set(), queries = new Set(), phones = new Set();
    for (const p of data.products) {
      if (!nonempty(p.id) || productIds.has(p.id) || !nonempty(p.name) || !stringList(p.aliases) || !websiteSource(p.sourceUrl) || !Number.isSafeInteger(p.displayPriceVnd) || p.displayPriceVnd < 0 || !['reference_only_requires_confirmation', 'published_conditions', 'conflict_handoff_only'].includes(p.quotationStatus) || !validVerifiedTime(p.verifiedAtUtc, data.snapshotDate) || !stringList(p.missingConditions)) throw new Error('Sản phẩm không hợp lệ');
      productIds.add(p.id);
      if (p.sessionFields !== undefined && (!stringList(p.sessionFields) || (!p.sessionFields.includes('quantity') && !p.priceFacts?.every(f => f.priceKind === 'reference_display' && f.rawSourceFlags?.nominalQuantityBasisOnly)) || !nonempty(p.quantityKey) || !p.sessionQuestions || typeof p.sessionQuestions !== 'object')) throw new Error('Thiếu quy cách hội thoại của bảng nguồn');
      if (p.uncertainFinishingTokens !== undefined && !stringList(p.uncertainFinishingTokens)) throw new Error('Gia công cần xác nhận không hợp lệ');
      if (p.relatedSourceUrls !== undefined && (!stringList(p.relatedSourceUrls) || !p.relatedSourceUrls.every(websiteSource))) throw new Error('Nguồn sản phẩm bổ sung không hợp lệ');
      if (p.selectionTokens !== undefined && (!stringList(p.selectionTokens) || !nonempty(p.selectionQuestion))) throw new Error('Biến thể cần câu hỏi làm rõ');
      if (p.disallowedTokens !== undefined && !stringList(p.disallowedTokens)) throw new Error('Biến thể không hợp lệ');
      if (p.quotationStatus === 'published_conditions' && (!nonempty(p.unit) || !positiveInteger(p.quantity) || !nonempty(p.variant) || !stringList(p.conditions))) throw new Error('Giá thiếu điều kiện');
      if (p.quotationStatus === 'conflict_handoff_only' && !nonempty(p.conflictReason)) throw new Error('Giá chưa thống nhất cần lý do');
      if (p.priceFacts !== undefined && !Array.isArray(p.priceFacts)) throw new Error('Bảng giá không hợp lệ');
      for (const f of p.priceFacts || []) {
        if (!nonempty(f.lookupQuery) || !normalize(f.lookupQuery) || queries.has(normalize(f.lookupQuery)) || !nonempty(f.id) || factIds.has(f.id) || !Number.isSafeInteger(f.priceVnd) || f.priceVnd < 0 || !positiveInteger(f.quantity) || !nonempty(f.quantityUnit) || !nonempty(f.unit) || !stringList(f.conditions) || !nonempty(f.sourceNote) || !websiteSource(f.sourceUrl) || (f.sourceUrl !== p.sourceUrl && !p.relatedSourceUrls?.includes(f.sourceUrl)) || !['thanh-an', 'vinh-phat'].includes(f.provider) || (f.priceKind !== undefined && !['per_unit', 'source_total', 'reference_display'].includes(f.priceKind)) || (f.sourceTotalVnd !== null && (!Number.isSafeInteger(f.sourceTotalVnd) || f.sourceTotalVnd < 0)) || (f.priceKind === 'source_total' && f.sourceTotalVnd !== f.priceVnd) || (f.secondarySourceUrls !== undefined && (!stringList(f.secondarySourceUrls) || !f.secondarySourceUrls.every(websiteSource)))) throw new Error('Dòng bảng giá thiếu điều kiện');
        if (new URL(f.sourceUrl).hostname !== (f.provider === 'thanh-an' ? 'innhanhtphcm.com' : 'invinhphat.com')) throw new Error('Nhà cung cấp và nguồn giá không khớp');
        factIds.add(f.id); queries.add(normalize(f.lookupQuery));
      }
      if (p.referenceEstimates !== undefined && !Array.isArray(p.referenceEstimates)) throw new Error('Ước tính tham khảo không hợp lệ');
      for (const e of p.referenceEstimates || []) if (!nonempty(e.id) || !nonempty(e.lookupQuery) || !positiveInteger(e.quantity) || !nonempty(e.unit) || !Number.isSafeInteger(e.priceVnd) || e.priceVnd < 0 || !stringList(e.conditions) || !nonempty(e.sourceNote) || !websiteSource(e.sourceUrl) || !p.relatedSourceUrls?.includes(e.sourceUrl) || !validVerifiedTime(e.verifiedAtUtc, data.snapshotDate)) throw new Error('Ước tính tham khảo thiếu điều kiện');
    }
    for (const c of data.contacts) {
      if (!/^0\d{9}$/.test(c.phone) || phones.has(c.phone) || c.zalo !== 'https://zalo.me/' + c.phone || !nonempty(c.name)) throw new Error('Liên hệ không hợp lệ');
      phones.add(c.phone);
    }
    if (!websiteSource(data.faq.sourceUrl) || ![data.faq.address, data.faq.hours, data.faq.email, data.faq.delivery].every(nonempty) || !stringList(data.faq.services)) throw new Error('Nguồn FAQ không hợp lệ');
    if (data.conflicts !== undefined && !Array.isArray(data.conflicts)) throw new Error('Dữ liệu giá chưa thống nhất không hợp lệ');
    for (const c of data.conflicts || []) if (!nonempty(c.id) || !productIds.has(c.productId) || !nonempty(c.name) || !stringList(c.aliases) || !websiteSource(c.sourceUrl) || c.quotationStatus !== 'conflict_handoff_only' || c.excludedFromPrices !== true) throw new Error('Giá chưa thống nhất thiếu phạm vi sản phẩm');
    return data;
  }
  const response = (kind, text, extra = {}) => ({kind, text:displayText(text), ...extra, ...(extra.sources ? {sources:extra.sources.map(source=>({...source,label:displayText(source.label)}))} : {}), ...(extra.suggestions ? {suggestionLabels:extra.suggestions.map(displayText)} : {})});
  const hasAny = (text, phrases) => phrases.some(p => contains(text, p));
  function matchingProducts(text, data) {
    const matches = data.products.filter(p => p.aliases.some(a => contains(text, a)));
    const vp = data.products.find(p => p.id === 'namecard-vp');
    const digital = data.products.find(p => p.id === 'namecard-digital-vp');
    if (digital && hasAny(text, ['digital', 'ky thuat so', 'kts']) && matches.some(p => ['namecard-c300','namecard-vp','namecard-digital-vp'].includes(p.id))) return [digital];
    const explicitVpCard = hasAny(text, ['danh thiep vinh phat', 'card vinh phat', 'namecard vinh phat', 'name card vinh phat']);
    const fullVpCard = matches.some(p => p.id === 'namecard-c300') && /\b100\s*(?:tam|card)\s*(?:moi\s*)?hop\b/.test(text) && /\b90\s*(?:x\s*)?54(?:\s*mm)?\b/.test(text) && contains(text, 'offset');
    if (vp && (explicitVpCard || fullVpCard)) return [vp];
    if (contains(text, 'vinh phat')) {
      const explicitSource = matches.filter(p => p.priceFacts?.length && p.priceFacts.every(f => f.provider === 'vinh-phat'));
      if (explicitSource.length) return explicitSource;
    }
    return matches.filter(p => p.aliases.filter(alias => contains(text, alias)).some(alias => !matches.some(other => other !== p && other.aliases.some(longer => contains(text, longer) && normalize(longer).length > normalize(alias).length && contains(normalize(longer), alias)))));
  }
  function estimateResponse(p, estimate, dated) {
    return response('estimate', p.name + '\nGiá tham khảo ước tính: ' + money(estimate.priceVnd) + '/' + estimate.unit + '.\n• ' + estimate.conditions.join('\n• ') + '\n' + estimate.sourceNote + '\n' + dated, {productId:p.id, estimateId:estimate.id, sources:[{label:'Nguồn ước tính A5', url:estimate.sourceUrl}], handoff:true});
  }
  // Reference cards only show for an identified product and simple price intent.
  // Quantity, dimensions, other materials, and unrecognized specifications need confirmation.
  function isReferenceLookup(text, product) {
    let remaining = ' ' + text + ' ';
    for (const phrase of [...product.aliases, ...(product.selectionTokens || []), 'xem bang gia', 'cho toi xem', 'bao gia', 'xem gia', 'bang gia', 'gia bao nhieu', 'bao nhieu', 'gia', 'in', 'xin', 'cho toi', 'toi muon', 'minh muon', 'toi can', 'minh can', 'nhe', 'nha', 'a'].sort((a, b) => normalize(b).length - normalize(a).length)) {
      const token = ' ' + normalize(phrase) + ' ';
      while (remaining.includes(token)) remaining = remaining.replace(token, ' ');
    }
    return remaining.trim() === '';
  }
  function answer(input, data, now = Date.now()) {
    validateData(data);
    const raw = String(input || '').trim();
    const text = normalize(raw);
    const source = {label:'Nguồn: Thanh Ấn', url:data.faq.sourceUrl};
    const dated = 'Dữ liệu website ngày ' + data.snapshotLabel + '.';
    // A clock before verification, an invalid clock, or the review boundary stops every price path.
    const expired = !Number.isFinite(now) || now < Date.parse(data.verifiedAtUtc) || now >= Date.parse(data.snapshotDate + 'T00:00:00Z') + data.priceReviewAfterDays * 86400000;
    const stale = url => response('stale', 'Bảng giá snapshot chưa thể dùng ở thời điểm này hoặc đã đến hạn kiểm tra lại. Mầm tạm ngừng hiển thị giá; bạn liên hệ tư vấn viên để xác nhận.', {handoff:true, sources:[{label:'Xem nguồn hiện tại', url}]});
    if (!raw) return response('empty', 'Bạn muốn tìm giá hoặc thông tin in ấn nào?');
    if (raw.length > 1000) return response('limit', 'Mầm nhận tối đa 1.000 ký tự mỗi tin. Bạn viết ngắn giúp Mầm tên sản phẩm và quy cách nhé.');
    // Visitor text never executes or changes the policy, including across turns.
    if (/[<>]|javascript\s*:|system\s*:|developer\s*:|ignore.*(instruction|rule)|bo qua.*(quy tac|huong dan|tat ca)|doi.*(quy tac|chinh sach)|api\s*key|prompt|hack|script/i.test(text + ' ' + raw)) return response('policy', 'Mầm chỉ tra cứu FAQ và giá đã đăng trên website Thanh Ấn. Nội dung nhập không thể thay đổi dữ liệu hoặc quy tắc báo giá.', {handoff:true});
    if (hasAny(text, ['zalo', 'lien he', 'tu van vien', 'nhan vien', 'goi dien', 'hotline', 'gap nguoi', 'tra my', 'thuong vy', 'tuan vi'])) return response('contacts', 'Bạn chọn người muốn trao đổi nhé. Chỉ khi bạn bấm Zalo hoặc Gọi, liên kết mới mở; Mầm không tự gửi nội dung cuộc trò chuyện.', {contacts:true});
    if (hasAny(text, ['dia chi', 'o dau', 'xuong o', 'thai phien', 'cua hang'])) return response('faq', 'Địa chỉ Thanh Ấn: ' + data.faq.address + '.\n' + dated, {sources:[source]});
    if (hasAny(text, ['gio lam', 'gio mo', 'may gio', 'thu bay', 'chu nhat', 'gio nghi'])) return response('faq', data.faq.hours + '\n' + dated, {sources:[source]});
    if (hasAny(text, ['email', 'mail'])) return response('faq', 'Email: ' + data.faq.email + '.\nBạn có thể gửi file in khi chủ động liên hệ với Thanh Ấn.\n' + dated, {sources:[source], handoff:true});
    const hits = matchingProducts(text, data);
    const row = data.products.flatMap(p => (p.priceFacts || []).map(f => ({product:p, fact:f}))).find(({fact:f}) => text === normalize(f.lookupQuery) || text === normalize(f.lookupQuery + ' tổng công bố'));
    if (row) {
      if (expired) return stale(row.fact.sourceUrl);
      // Signs/operators are not part of the generated source-row selector.
      if (/[+−–—=]|(?:^|\s)-\s*\d/.test(raw)) return response('clarify', 'Số lượng hoặc yêu cầu của bạn cần xác nhận lại. Bạn chọn nguyên dòng bảng giá đã công bố hoặc gửi quy cách cho tư vấn viên.', {handoff:true, sources:[{label:'Xem bảng giá gốc', url:row.fact.sourceUrl}]});
      const f = row.fact;
      const total = contains(text, 'tong cong bo') && f.priceKind !== 'source_total' ? (f.sourceTotalVnd !== null ? '\nTổng ghi sẵn tại nguồn: ' + money(f.sourceTotalVnd) + '.' : '\nNguồn chưa có tổng được xác minh cho dòng này. Mầm không tự tính tổng.') : '';
      const priceLine = f.priceKind === 'source_total' ? 'Tổng giá gói công bố: ' + money(f.priceVnd) + '.' : f.priceKind === 'reference_display' ? 'Giá trị hiển thị tại ô bảng nguồn: ' + money(f.priceVnd) + '.\n' + (f.rawSourceFlags?.paymentBasisRequiresConfirmation ? 'Nguồn chưa xác nhận rõ cơ sở thanh toán; không coi đây là giá mỗi sản phẩm hoặc tự tính tổng.' : 'Đây là giá trị tham khảo từ nguồn; điều kiện đơn thực tế còn cần xác nhận. Mầm không tự tính tổng hoặc quy đổi đơn vị.') : 'Giá tại dòng bảng đã chọn: ' + money(f.priceVnd) + '/' + f.unit + '.';
      const priceSource=f.provider==='thanh-an'?'Thanh Ấn (innhanhtphcm.com)':'Giá tham khảo';
      return response(f.priceKind === 'reference_display' ? 'reference' : 'price', row.product.name + '\nNguồn giá: ' + priceSource + '.\n' + priceLine + '\nĐiều kiện áp dụng:\n• ' + f.conditions.join('\n• ') + total + '\n' + f.sourceNote + '\n' + dated + ' Đây là thông tin nguồn công bố, cần xác nhận đơn thực tế với nhà in.', {productId:row.product.id, factId:f.id, priceKind:f.priceKind || 'per_unit', provider:f.provider, sources:[{label:'Xem bảng giá & quy cách gốc', url:f.sourceUrl}, ...(f.secondarySourceUrls || []).map(url => ({label:'Nguồn tham khảo thứ hai', url}))], handoff:true});
    }
    const estimate = data.products.flatMap(p => (p.referenceEstimates || []).map(e => ({product:p, estimate:e}))).find(({estimate:e}) => text === normalize(e.lookupQuery));
    if (estimate) {
      if (expired) return stale(estimate.estimate.sourceUrl);
      if (/[+−–—=]|(?:^|\s)-\s*\d/.test(raw)) return response('clarify', 'Bạn xác nhận một số lượng nguyên dương theo dòng tham khảo nhé.', {handoff:true, sources:[{label:'Nguồn tham khảo A5', url:estimate.estimate.sourceUrl}]});
      return estimateResponse(estimate.product, estimate.estimate, dated);
    }
    if (hasAny(text, ['thoi tiet', 'bitcoin', 'gia vang', 'viet code', 'lap trinh', 'lam tho', 'chinh tri', 'y te'])) return response('unknown', 'Mầm chỉ có FAQ và giá website Thanh Ấn. Bạn chọn một dịch vụ in để Mầm giúp tra cứu nhé.', {suggestions:['Dịch vụ', 'Xem giá', 'Liên hệ Zalo']});
    if (hasAny(text, ['gia hom nay', 'gia hien tai', 'gia moi', 'moi nhat', 'dang ap dung', 'cap nhat gia'])) return response('handoff', 'Mầm chỉ có dữ liệu website ngày ' + data.snapshotLabel + ', chưa xác nhận giá đang áp dụng hôm nay. Bạn trao đổi quy cách, số lượng và thời điểm cần nhận với tư vấn viên để xác nhận.', {sources:[source], handoff:true});
    if (hasAny(text, ['giao hang', 'ship', 'van chuyen', 'lay ngay', 'hom nay', 'ngay mai', 'bao lau', 'kip', 'deadline', '2 gio', '30 phut'])) return response('handoff', data.faq.delivery + '\nMầm chưa có dữ liệu xác nhận hạn giao cho đơn của bạn. Hãy trao đổi sản phẩm, quy cách, số lượng và thời điểm cần nhận.', {sources:[source], handoff:true});
    if (hasAny(text, ['giam gia', 'chiet khau', 'gia si', 're hon', 'bot gia', 'mien phi', 'free', 'uu dai', 'khuyen mai', 'voucher', 'coupon'])) return response('handoff', 'Mầm không tự suy ra giảm giá, chiết khấu hoặc ưu đãi. Tư vấn viên sẽ xác nhận chính sách áp dụng theo quy cách và số lượng thực tế.', {handoff:true});
    if (hasAny(text, ['vat', 'thue', 'gtgt'])) return response('handoff', 'Ghi chú thuế ở nguồn chỉ là thông tin của bảng đã công bố. Mầm không tự tính thuế hoặc xác nhận số tiền thanh toán; bạn hỏi tư vấn viên cho đơn thực tế.', {sources:[source], handoff:true});
    if (hasAny(text, ['tong tien', 'thanh tien', 'tinh tong', 'nhan gia', 'tinh tien', 'bao nhieu tien cho', 'tong cong bo'])) return response('handoff', 'Mầm chưa tính tổng đơn từ giá hiển thị. Chỉ có thể xem tổng ghi sẵn tại nguồn khi chọn đúng dòng bảng và thêm “tổng công bố”. Đơn thực tế cần tư vấn viên xác nhận.', {handoff:true});
    const conflict = (data.conflicts || []).find(c => hits.some(p => p.id === c.productId) && c.aliases.some(a => contains(text, a)));
    if (conflict) return response('conflict', 'Mục này có thông tin giá chưa thống nhất trên website. Mầm không chọn một mức giá để báo. Bạn gửi tư vấn viên yêu cầu "' + conflict.name + '" để xác nhận.', {sources:[{label:'Xem trang có thông tin cần xác nhận', url:conflict.sourceUrl}], handoff:true});
    if (hasAny(text, ['dich vu', 'san pham', 'in gi', 'co in', 'thiet ke', 'gia cong']) && !hits.length) return response('services', 'Thanh Ấn có: ' + data.faq.services.join(', ') + '.\nBạn chọn loại ấn phẩm, rồi cho biết kích thước, chất liệu và số lượng nhé.', {sources:[source], suggestions:['Danh thiếp C300', 'Decal giấy', 'Túi giấy Kraft', 'Bao lì xì']});
    if (hits.length > 1) return response('clarify', 'Mầm thấy nhiều loại phù hợp. Bạn muốn xem ' + hits.map(p => p.name).join(' hay ') + '?', {suggestions:hits.map(p => p.name)});
    if (!hits.length && hasAny(text, ['decal', 'tem', 'nhan'])) return response('clarify', 'Bạn muốn decal giấy hay decal nhựa bóng? Mỗi vật liệu cần quy cách và số lượng riêng.', {suggestions:['Decal giấy', 'Decal nhựa bóng']});
    if (hits.length === 1) {
      const p = hits[0];
      if (expired) return stale(p.sourceUrl);
      if ((p.id === 'red-envelope' && hasAny(text, ['ep kim', 'can mang', 'dap noi'])) || (p.id === 'receipt' && hasAny(text, ['so nhay', 'danh so']))) return response('handoff', 'Phần gia công bạn yêu cầu chưa có mức giá được xác minh trong dòng bảng này. Mầm không áp dụng giá của quy cách thường cho đơn có gia công khác. Bạn gửi tư vấn viên quy cách và số lượng để xác nhận.', {handoff:true, sources:[{label:'Xem sản phẩm gốc', url:p.sourceUrl}]});
      if (p.disallowedTokens?.some(t => contains(text, t))) return response('clarify', 'Biến thể bạn hỏi chưa có giá đủ điều kiện trong dữ liệu của Mầm. Bạn gửi tư vấn viên loại giấy, kích thước và số lượng để xác nhận.', {handoff:true, sources:[{label:'Xem sản phẩm liên quan', url:p.sourceUrl}]});
      if (p.selectionTokens && !p.selectionTokens.some(t => contains(text, t))) return response('clarify', p.selectionQuestion, {suggestions:[p.name, 'Liên hệ Zalo']});
      if (p.priceFacts?.length) return response('clarify', (p.conflictReason ? p.conflictReason + '\n' : '') + 'Bạn muốn xem dòng bảng giá đã công bố nào? Mỗi dòng đi kèm toàn bộ quy cách và số lượng. Nếu đơn của bạn khác điều kiện, cần tư vấn viên báo giá.' + (p.referenceNote ? '\n' + p.referenceNote : ''), {sources:[{label:'Xem bảng giá gốc', url:p.sourceUrl}], suggestions:p.priceFacts.map(f => f.lookupQuery), handoff:true});
      if (p.quotationStatus === 'conflict_handoff_only') return response('conflict', p.conflictReason + '\nMầm tạm giữ mức này khỏi báo giá tự động.', {sources:[{label:'Xem nguồn cần xác nhận', url:p.sourceUrl}], handoff:true});
      if (p.quotationStatus === 'published_conditions' || !isReferenceLookup(text, p)) return response('clarify', 'Mầm chưa có giá đã xác minh cho đúng quy cách hoặc số lượng bạn hỏi. Bạn cho biết ' + p.missingConditions.join(', ') + ' và gửi tư vấn viên để nhận báo giá.', {productId:p.id, sources:[{label:'Xem sản phẩm gốc', url:p.sourceUrl}], handoff:true});
      return response('reference', p.name + '\nGiá hiển thị trên website: ' + money(p.displayPriceVnd) + '.\nChưa xác nhận đầy đủ quy cách áp dụng. Đây là giá tham khảo, chưa phải báo giá cho đơn của bạn.' + (p.referenceNote ? '\n' + p.referenceNote : '\nNguồn chưa xác nhận đơn vị tính; Mầm không suy ra giá mỗi sản phẩm.') + '\nBạn cho biết ' + p.missingConditions.join(', ') + ' nhé.\n' + dated, {productId:p.id, sources:[{label:'Xem sản phẩm gốc', url:p.sourceUrl}], handoff:true});
    }
    if (hasAny(text, ['gia', 'bang gia', 'bao gia', 'xem gia'])) return response('clarify', 'Bạn muốn xem giá của ấn phẩm nào? Mầm chỉ tra mức giá đã đăng, kèm nguồn và điều kiện; báo giá chính xác cần quy cách và tư vấn viên xác nhận.', {suggestions:['Danh thiếp C300', 'Decal giấy', 'Tờ rơi', 'Bao lì xì']});
    if (hasAny(text, ['chao', 'xin chao', 'hello', 'hi', 'mam', 'cam on'])) return response('greeting', 'Chào bạn, Mầm đây 🌱 Mầm giúp tìm thông tin in ấn và giá đã đăng trên website Thanh Ấn. Bạn đang cần in gì?', {suggestions:['Xem giá', 'Dịch vụ', 'Liên hệ Zalo']});
    return response('unknown', 'Mầm chưa có thông tin đã xác minh cho câu hỏi này. Mầm là trợ lý FAQ và giá website Thanh Ấn; bạn có thể chọn một dịch vụ in hoặc trao đổi với tư vấn viên.', {suggestions:['Dịch vụ', 'Xem giá', 'Liên hệ Zalo'], handoff:true});
  }
  function createSession(data, clock = Date.now) {
    validateData(data);
    let state = null;
    const time = () => typeof clock === 'function' ? clock() : clock;
    const required = {
      'namecard-c300':['material', 'quantity'],
      catalogue:['quantity', 'size', 'pages', 'material'],
      'namecard-vp':['quantity'],
      'red-envelope':['quantity', 'size', 'material'],
      receipt:['quantity', 'size', 'layers', 'material']
    };
    const quantityUnit = {'namecard-c300':'hop', 'namecard-vp':'hop', catalogue:'cuon', 'red-envelope':'cai', receipt:'cuon'};
    const quantityLabels = {'namecard-c300':'hộp', 'namecard-vp':'hộp', catalogue:'cuốn', 'red-envelope':'cái', receipt:'cuốn'};
    for (const p of data.products) if (p.sessionFields) {
      required[p.id] = p.sessionFields;
      quantityUnit[p.id] = p.quantityKey || normalize(p.priceFacts?.[0]?.quantityUnit);
      quantityLabels[p.id] = p.priceFacts?.[0]?.quantityUnit || 'sản phẩm';
    }
    const reset = () => { state = null; };
    const clarify = (p, text, suggestions = []) => response('clarify', text, {productId:p.id, sources:[{label:'Xem bảng giá gốc', url:p.sourceUrl}], suggestions});
    const handoff = (p, text) => response('handoff', text, {productId:p.id, sources:[{label:'Xem bảng giá gốc', url:p.sourceUrl}], handoff:true});
    function unsupported(p, text, raw) {
      if (p.disallowedTokens?.some(t => contains(text, t))) return true;
      if (p.uncertainFinishingTokens?.some(t => contains(text, t))) return true;
      if (p.id !== 'catalogue' && /\b\d+\s*trang\b/.test(text)) return true;
      if (p.id === 'namecard-c300' && (/\ba[3456]\b/.test(text) || hasAny(text, ['fort', 'ivory', 'ep kim', 'ep nhu', 'can mang', 'dap noi', 'bo goc', 'be', 'cat khuon']) || [...text.matchAll(/\b(?:couche\s*|c\s*)(\d{2,3})(?:\s*gsm)?\b/g)].some(m => Number(m[1]) !== 300))) return true;
      if (p.id === 'catalogue') {
        if (hasAny(text, ['ep kim', 'ep nhu', 'dap noi', 'dong keo', 'keo gay', 'lo xo', 'dong gay', 'can mang hai mat', 'can mang 2 mat', 'khong dong kim', 'fort', 'ivory', 'kraft', 'nhua', 'my thuat', 'carbonless', 'den trang'])) return true;
        if (/\b[123]\s*mau\b/.test(text)) return true;
        const weights = [...text.matchAll(/\b(?:couche\s*|c\s*|giay\s*|bia\s*|ruot\s*)(\d{2,3})(?:\s*gsm)?\b|\b(\d{2,3})\s*gsm\b/g)].map(m => Number(m[1] || m[2]));
        if (weights.some(w => ![150, 250].includes(w))) return true;
        if (/\bruot\s+(?:couche\s*|c\s*)250\b/.test(text)) return true;
      }
      if (p.id === 'red-envelope' && (hasAny(text, ['ep kim', 'ep nhu', 'can mang', 'dap noi', 'nho', 'kraft', 'fort', 'ivory', 'c200', 'c250', 'c300', 'kts', 'den trang']) || /\b[123]\s*mau\b/.test(text))) return true;
      if (p.id === 'receipt' && (hasAny(text, ['so nhay', 'danh so', 'fort', 'in hai mau', 'in 2 mat', 'in hai mat']) || /\b[234]\s*mau\b/.test(text))) return true;
      const dimensions = [...raw.replace(/,/g, '.').matchAll(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/gi)];
      if (p.sessionFields) {
        const dimensionKey = value => String(value).replace(/,/g, '.').replace(/\s+/g, '').replace(/×/g, 'x').toLowerCase();
        const requested = raw.replace(/×/g, 'x').match(/\d+(?:[.,]\d+)?(?:\s*x\s*\d+(?:[.,]\d+)?){1,2}/gi) || [];
        if (requested.some(size => !p.priceFacts.some(f => dimensionKey(f.specs?.dimensions || f.specs?.size) === dimensionKey(size)))) return true;
        if (requested.length && /\b(?:mm|cm)\b/i.test(raw) && !p.priceFacts.some(f => contains(normalize(raw), f.specs?.dimensionsUnit || ''))) return true;
        const paper = [...text.matchAll(/\b(couche|c|fort|briston|bristol)\s*(\d{2,3})(?:\s*gsm)?\b/g)].map(m => (m[1] === 'couche' ? 'c' : m[1] === 'bristol' ? 'briston' : m[1]) + m[2]);
        if (paper.some(material => !p.priceFacts.some(f => normalize(f.specs?.material) === material || (p.slotAliases?.material?.[f.specs?.material] || []).some(alias => normalize(alias).replace(/\s+/g,'') === material)))) return true;
        for (const material of ['nhua','mica','kraft','fort','ivory','my thuat','carbonless','briston']) if (contains(text, material) && !p.priceFacts.some(f => normalize(f.specs?.material).includes(normalize(material)) || (p.slotAliases?.material?.[f.specs?.material] || []).some(alias => contains(normalize(alias), material)))) return true;
        if (p.id !== 'namecard-digital-vp' && hasAny(text, ['kts','digital','ky thuat so'])) return true;
        return false;
      }
      if (dimensions.length && (p.id !== 'red-envelope' && p.id !== 'namecard-vp' || dimensions.some(m => p.id === 'namecard-vp' ? Number(m[1]) !== 90 || Number(m[2]) !== 54 : Number(m[1]) !== 16 || Number(m[2]) !== 7.4))) return true;
      return false;
    }
    function nextQuestion(p) {
      const slots = state.slots;
      const field = required[p.id].find(key => slots[key] === undefined);
      state.pending = field;
      if (field === 'quantity') return clarify(p, 'Bạn cần in bao nhiêu ' + quantityLabels[p.id] + '? Bảng đã xác minh có các mốc ' + [...new Set(p.priceFacts.map(f => f.quantity))].join(', ') + ' ' + quantityLabels[p.id] + '.', [...new Set(p.priceFacts.map(f => f.quantity + ' ' + f.quantityUnit))]);
      if (p.sessionFields && field) {
        const options = [...new Set(p.priceFacts.map(f => f.specs?.[field]).filter(value => value !== undefined))];
        return clarify(p, p.sessionQuestions?.[field] || 'Bạn chọn ' + field + ' nào theo bảng nguồn?', options.map(String));
      }
      if (field === 'size') return clarify(p, p.id === 'red-envelope' ? 'Bạn cần bao lì xì lớn 16 × 7,4 cm, nắp 2 cm hay kích thước khác?' : 'Bạn cần khổ nào? Bảng đã xác minh cho ' + (p.id === 'receipt' ? 'A5.' : 'A4.'), p.id === 'red-envelope' ? ['Lì xì lớn'] : [p.id === 'receipt' ? 'A5' : 'A4']);
      if (field === 'pages') return clarify(p, 'Catalogue của bạn có bao nhiêu trang? Bảng Thanh Ấn ghi 12–36 trang và chưa làm rõ cách tính bìa; bảng tham khảo ghi 12–32 trang gồm bìa, bội số của 4.', ['12 trang', '16 trang', '20 trang', '24 trang', '28 trang', '32 trang', '36 trang']);
      if (field === 'layers') return clarify(p, 'Bạn cần phiếu thu mấy liên? Bảng đã xác minh là giấy carbonless 2 liên.', ['2 liên']);
      if (field === 'material') return clarify(p, p.id === 'catalogue' ? 'Bạn chọn toàn bộ C150 hay bìa C250 cán màng ngoài, ruột C150? Hai biến thể có bảng giá khác nhau; Mầm chưa chọn thay bạn.' : p.id === 'namecard-c300' ? p.selectionQuestion : 'Bạn cần giấy ' + (p.id === 'receipt' ? 'carbonless' : 'Couche 150gsm') + ' hay loại khác?', p.id === 'catalogue' ? ['C150 toàn bộ', 'Bìa C250 ruột C150'] : [p.id === 'receipt' ? 'Carbonless' : p.id === 'namecard-c300' ? 'C300' : 'Couche 150gsm']);
      return null;
    }
    function sessionAnswer(input) {
      const raw = String(input || '').trim();
      // Compact Vietnamese replies and thousands separators remain deterministic.
      const text = normalize(raw.replace(/×/g, 'x').replace(/(\d)[.,](?=\d{3}(?:\D|$))/g, '$1').replace(/([a-zA-ZÀ-ỹ]{2,})(\d)/g, '$1 $2')).replace(/\b(\d{2,3})\s*gsm\b/g, '$1');
      const base = answer(raw, data, time());
      if (['empty', 'limit', 'policy', 'contacts', 'faq', 'stale', 'conflict'].includes(base.kind)) return base;
      if (base.factId) {
        const p = data.products.find(p => p.id === base.productId);
        const f = p.priceFacts.find(f => f.id === base.factId);
        state = {productId:p.id, slots:{quantity:f.quantity, ...f.specs}, factId:f.id};
        return base;
      }
      if (base.kind === 'estimate') return base;
      const products = matchingProducts(normalize(raw), data);
      if (products.length > 1) return base;
      if (products.length === 1 && (!state || state.productId !== products[0].id)) state = {productId:products[0].id, slots:{}};
      if (!state) return base;
      const p = data.products.find(p => p.id === state.productId);
      if (!required[p.id] || !p.priceFacts?.length) return products.length ? base : answer(p.name + ' ' + raw, data, time());
      const probe = answer(p.name, data, time());
      if (probe.kind === 'stale') return probe;
      if (unsupported(p, text, raw)) {
        state.blocked = true; state.factId = null;
        return handoff(p, 'Quy cách hoặc gia công bạn yêu cầu khác dòng bảng đã xác minh. Mầm không áp dụng giá tiêu chuẩn cho biến thể này. Bạn gửi tư vấn viên yêu cầu cụ thể để nhận báo giá.');
      }
      if (base.kind === 'handoff') {
        if (text === 'tong cong bo' && state.factId && !state.blocked) {
          const f = p.priceFacts.find(f => f.id === state.factId);
          return answer(f.lookupQuery + ' tổng công bố', data, time());
        }
        return base;
      }
      if (/[+−–—=÷*]|(?:^|\s)-\s*\d|\d\s*\/\s*\d/.test(raw) || (raw.includes('×') && !p.sessionFields && p.id !== 'namecard-vp' && !/16\s*×\s*7[.,]4/.test(raw))) { state.factId = null; return clarify(p, 'Mầm chưa xác nhận số lượng có dấu hoặc phép tính trong tin này. Bạn nhập một số lượng nguyên dương theo đơn vị ' + quantityLabels[p.id] + ' nhé.'); }
      if (hasAny(text, ['thoi tiet', 'bitcoin', 'gia vang', 'viet code', 'lap trinh', 'lam tho', 'chinh tri', 'y te'])) return base;
      const standardConfirmed = hasAny(text, ['quy cach cong bo', 'quy cach chuan']);
      if (standardConfirmed) { state.blocked = false; }
      if (state.blocked) return handoff(p, 'Biến thể bạn vừa yêu cầu cần báo giá riêng. Bạn có thể chọn quy cách công bố, đổi sản phẩm hoặc liên hệ tư vấn viên.');
      const slots = state.slots;
      let changed = products.length === 1 || standardConfirmed;
      if (p.id === 'catalogue') {
        if (hasAny(text, ['vinh phat'])) { state.provider = 'vinh-phat'; changed = true; }
        if (hasAny(text, ['thanh an'])) { state.provider = 'thanh-an'; changed = true; }
        if (contains(text, 'offset')) { slots.printing = 'offset4'; changed = true; }
        if (hasAny(text, ['kts', 'ky thuat so'])) { slots.printing = 'kts4'; changed = true; }
        if (hasAny(text, ['gom bia', 'ke ca bia'])) { slots.pagesIncludeCover = true; changed = true; }
        if (hasAny(text, ['khong gom bia', 'chua gom bia'])) { slots.pagesIncludeCover = false; changed = true; }
        if (/\b(?:couche\s*|c\s*)250(?:\s*gsm)?\b/.test(text)) { slots.material = 'cover-c250'; changed = true; }
        else if (/\b(?:couche\s*|c\s*)150(?:\s*gsm)?\b/.test(text)) { slots.material = 'all-c150'; changed = true; }
        if (contains(text, 'khong can mang') && slots.material === 'cover-c250') { state.blocked = true; return handoff(p, 'Bìa C250 trong bảng có cán màng mặt ngoài; yêu cầu không cán màng cần báo giá riêng.'); }
      }
      const quantities = [...text.matchAll(/\b(\d+)\s*(cuon|quyen|hop|cai|to|tam|tem|tag|bo|chiec)\b/g)];
      const correctQuantities = quantities.filter(m => m[2] === quantityUnit[p.id] || m[2] === normalize(quantityLabels[p.id]) || (quantityUnit[p.id] === 'cuon' && m[2] === 'quyen'));
      if (new Set(correctQuantities.map(m => m[1])).size > 1) {
        delete slots.quantity; state.factId = null;
        return clarify(p, 'Mầm thấy nhiều số lượng trong cùng tin. Bạn xác nhận một số lượng ' + quantityLabels[p.id] + ' nhé.');
      }
      if (correctQuantities.length) { slots.quantity = Number(correctQuantities[0][1]); changed = true; }
      else if (quantities.length && !(p.id === 'receipt' && quantities.every(m => ['to', 'tam'].includes(m[2])))) {
        delete slots.quantity; state.factId = null;
        return clarify(p, 'Bảng nguồn của ' + p.name + ' dùng đơn vị ' + quantityLabels[p.id] + '. Bạn xác nhận số lượng theo đơn vị này nhé.');
      }
      if (/^\d+$/.test(text) && ['quantity', 'pages', 'layers'].includes(state.pending)) { slots[state.pending] = Number(text); changed = true; }
      const sizes = [...text.matchAll(/\b(a[3456])\b/g)].map(m => m[1]);
      if (new Set(sizes).size > 1) { delete slots.size; state.factId = null; return clarify(p, 'Bạn chọn một khổ giấy cần in nhé.'); }
      if (sizes.length) { slots.size = sizes[0]; changed = true; }
      const pages = [...text.matchAll(/\b(\d+)\s*trang\b/g)].map(m => Number(m[1]));
      if (new Set(pages).size > 1) { delete slots.pages; state.factId = null; return clarify(p, 'Bạn xác nhận một số trang của catalogue nhé.'); }
      if (pages.length) { slots.pages = pages[0]; changed = true; }
      const layers = [...text.matchAll(/\b(\d+)\s*lien\b/g)].map(m => Number(m[1]));
      if (new Set(layers).size > 1) { delete slots.layers; state.factId = null; return clarify(p, 'Bạn xác nhận một số liên của phiếu nhé.'); }
      if (layers.length) { slots.layers = layers[0]; changed = true; }
      if (p.id === 'namecard-c300' && /\bc\s*300(?:\s*gsm)?\b/.test(text)) { slots.material = 'c300'; changed = true; }
      if (p.id === 'receipt' && contains(text, 'carbonless')) { slots.material = 'carbonless'; changed = true; }
      if (p.id === 'red-envelope') {
        if (contains(text, 'lon') || /\b16\s*(?:x\s*)?7\s*4\b/.test(text)) { slots.size = 'large'; changed = true; }
        if (/\b(?:couche\s*|c\s*)150(?:\s*gsm)?\b/.test(text)) { slots.material = 'c150'; changed = true; }
      }
      if (p.sessionFields) {
        for (const key of p.sessionFields.filter(key => key !== 'quantity')) {
          const values = [...new Set(p.priceFacts.map(f => f.specs?.[key]).filter(value => value !== undefined))];
          const scored = values.map(value => ({value, score:Math.max(0, ...[String(value), ...(p.slotAliases?.[key]?.[value] || [])].filter(alias => contains(text, alias)).map(alias => normalize(alias).length))}));
          const best = Math.max(0, ...scored.map(item => item.score));
          const found = scored.filter(item => item.score > 0 && item.score === best).map(item => item.value);
          if (found.length > 1) { delete slots[key]; state.factId = null; return clarify(p, 'Bạn chọn một ' + key + ' để khớp một dòng bảng nguồn nhé.', found.map(String)); }
          if (found.length === 1) { slots[key] = found[0]; changed = true; }
        }
      }
      if (changed) state.factId = null;
      if (p.id === 'catalogue' && slots.size === 'a5') {
        const e = p.referenceEstimates?.find(e => e.quantity === slots.quantity && Object.entries(e.specs).every(([key,value]) => slots[key] === value));
        if (e && changed && (!slots.printing || slots.printing === 'offset4')) return estimateResponse(p, e, 'Dữ liệu website ngày ' + data.snapshotLabel + '.');
        return response('handoff', 'Catalogue A5' + (slots.quantity !== undefined ? ', ' + slots.quantity + ' cuốn' : '') + ': bảng tham khảo chưa có dòng giá A5 cố định cho lựa chọn này. Chỉ có ước tính tham khảo A5 12 trang gồm bìa, C150 toàn bộ, 1.000 cuốn và cần gửi file xác nhận. Mầm không áp dụng bảng A4 cho A5.', {productId:p.id, sources:[{label:'Nguồn tham khảo A5', url:p.referenceEstimates?.[0]?.sourceUrl || p.sourceUrl}], handoff:true});
      }
      if (p.id === 'catalogue' && slots.quantity !== undefined && slots.quantity < 200) return handoff(p, 'Dưới 200 cuốn catalogue: nguồn yêu cầu liên hệ tư vấn viên Thương Vy để báo giá. Mầm không nội suy giá từ các mốc 200, 500 hoặc 1.000 cuốn.');
      // Reject a supplied unsupported core specification immediately; keep the other slots.
      for (const key of required[p.id]) {
        if (slots[key] !== undefined && !p.priceFacts.some(f => (key === 'quantity' ? f.quantity : f.specs?.[key]) === slots[key])) return handoff(p, 'Bảng đã xác minh chưa có đúng ' + (key === 'quantity' ? 'số lượng' : key === 'pages' ? 'số trang' : key === 'size' ? 'kích thước' : 'quy cách') + ' bạn yêu cầu. Mầm không suy ra giá cho biến thể khác; bạn liên hệ tư vấn viên để báo giá.');
      }
      const question = nextQuestion(p);
      if (question) return question;
      if (!changed) return clarify(p, 'Mầm đã giữ sản phẩm và quy cách bạn chọn. Bạn có thể đổi số lượng, khổ giấy, số trang hoặc chọn “tổng công bố” cho dòng nguồn vừa xem.');
      const candidates = p.priceFacts.filter(f => required[p.id].every(key => (key === 'quantity' ? f.quantity : f.specs?.[key]) === slots[key]) && (!slots.printing || f.specs?.printing === slots.printing) && (slots.pagesIncludeCover === undefined || f.specs?.pagesIncludeCover === slots.pagesIncludeCover) && (!state.provider || f.provider === state.provider));
      const priority = {'thanh-an':0, 'vinh-phat':1};
      const f = candidates.sort((a,b) => priority[a.provider] - priority[b.provider])[0];
      if (!f) return handoff(p, 'Chưa có dòng bảng giá đã xác minh khớp toàn bộ lựa chọn của bạn. Bạn gửi tư vấn viên quy cách và số lượng để báo giá.');
      state.factId = f.id;
      return answer(f.lookupQuery, data, time());
    }
    return Object.freeze({answer:sessionAnswer, reset});
  }
  root.ThanhAnFAQ = Object.freeze({answer, createSession, validateData, normalize, money, safeLink, displayText});
})(typeof window !== 'undefined' ? window : globalThis);
