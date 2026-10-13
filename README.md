# Mầm — trợ lý thông tin in ấn của Thanh Ấn

Bản thử gồm widget, demo độc lập và plugin WordPress mặc định tắt. Baseline web ngày 12/10/2026 có **177 dòng giá**. Runtime hiện có **196 dòng/23 sản phẩm-biến thể**: 193 dòng của bản đã nghiệm thu và 3 gói danh thiếp offset được đọc lại ngày 13/10/2026. Có 62 dòng mang bản sửa chủ cơ sở: 46 dòng sửa và 16 dòng mới. Các dòng lịch sử giữ nguyên. Chính sách giá chủ cơ sở có provenance riêng với bằng chứng website; báo cáo nghiệm thu hiện tại nằm trong `evidence/TEST-REPORT.md` của gói bàn giao.

Gemini Free đã được cấu hình và gọi thật thành công trên [demo Production](https://test-mam.vercel.app/) ngày 13/10/2026, với model **gemini-3.5-flash-lite**. Chủ sở hữu đã chấp thuận và tự lưu khóa có sẵn dưới dạng Secret, scope Production; người hỗ trợ chỉ xác nhận tên/loại/phạm vi biến, không đọc giá trị khóa. Model chỉ phân loại câu chưa được local hiểu, không tạo câu trả lời, thông số hoặc giá. Cơ chế vẫn tắt Gemini nếu thiếu cấu hình; khách phải tự đồng ý trước mỗi phiên. Xem [luồng Gemini](docs/llm-adapter.md) và [cấu hình/giới hạn Free](docs/gemini-free-setup.md).

## Bộ nhớ cụm từ được duyệt

[Bộ nhớ cách diễn đạt](docs/approved-language-memory.md) hiện có **3 pending, 0 approved**. Chủ cơ sở phải xem và duyệt từng ánh xạ bằng CLI trước khi dùng; không tự học hoặc thu thập chat khách. Mục đã duyệt chỉ giúp nhận diện ý định/nhóm sản phẩm, không lưu hay tạo giá/tổng/quy cách. Luồng local giữ ngữ cảnh catalogue đã có; hook category mới không ghi đè sản phẩm/thông số đã nhận diện, và các trường hợp xung đột cần được làm rõ. Sau câu “16 trang”, khách vẫn cần chọn giấy phù hợp; không mặc định giấy. Ba ánh xạ này vẫn chưa được đưa vào runtime.

## Chạy bản thử

Yêu cầu Node.js 20 trở lên; không cần `npm install` vì không có dependency bên ngoài.

```text
npm start
npm run build
npm test
node --test tests/gemini-server.test.mjs tests/gemini-client.test.mjs
```

`npm start` mở server static tại `http://127.0.0.1:4173/`, không chạy Vercel Function. `npm test` chạy policy, menu, quote-flow, server/client, owner-revision, continuity, approved-language và source-information; các test API dùng mock, không cần khóa. Bộ kiểm tra còn gồm FAQ cơ bản, kéo cửa sổ, thời gian trình bày 320 ms và mô phỏng DOM của widget thật; mô phỏng DOM không thay thế kiểm tra trình duyệt. Lệnh riêng chỉ chạy phần Gemini. **Build mặc định chỉ tạo `public/` và `demo-standalone.html`, không sao chép assets WordPress.**

`node tools/build.mjs --wordpress-assets` là cờ opt-in để chuẩn bị assets plugin trong một công việc riêng được cho phép; không chạy cờ này trong đợt sửa UI. Plugin hiện tại giữ nguyên và chưa cài/kích hoạt website. Source widget mới không có nghĩa plugin đã nhận giao diện mới.

Standalone chứa sẵn JSON giá/quy cách, CSS, JS và sprite, không mount endpoint Gemini hoặc tra website. Bản HTTP(S) tải sprite từ asset cùng origin, không tải nhân vật từ ChatGPT mỗi phiên. Link nguồn, Zalo hoặc Gọi chỉ mở khi khách chủ động bấm. Trang demo là nền để xem widget ở góc trang; tích hợp Thanh Ấn dùng riêng widget/plugin, không đưa cả bố cục demo vào website.

## Hội thoại và báo giá

Bấm **Báo giá** để chọn cần in gì. Mầm hỏi từng thông tin còn thiếu, ưu tiên số lượng, rồi giữ quy cách trong phiên để khách đổi số lượng/thông số. Đổi sản phẩm xóa thông số không còn áp dụng. Câu báo giá chỉ có **hai dòng chính**: quy cách đã xác minh; số lượng và tổng tiền. Không tự điền quy cách thiếu. Đơn giá, nguồn, căn cứ tính, provenance/ngày chính sách và điều kiện dài nằm trong phần chi tiết tùy chọn hoặc dữ liệu/mã, không thành các đoạn chính của câu trả lời. Chỉ thêm ghi chú nhỏ “chưa VAT” khi nguồn nêu rõ. Chữ trong panel/ô nhập dùng cỡ 16px; kiểm tra đọc và bố cục được ghi ở phần nghiệm thu.

Bấm hoặc gõ **Xem bảng giá** khi muốn xem toàn bảng: chọn sản phẩm, quy cách, rồi xem các dòng nguồn. Không tự mở cả bảng sau mỗi câu hỏi giá. Bảng giữ số lượng, đơn vị, ý nghĩa giá, nguồn/ngày và điều kiện từng dòng; màn chọn sản phẩm/quy cách và cuối bảng đều có mục Tư vấn qua Zalo, lời nhắc website chưa có đủ quy cách/giá và ba liên hệ đã xác minh. Nếu quy cách cần in không có trong bảng, khách nhắn Zalo để tư vấn.

Đợt [bố cục mới của khung Mầm](docs/ui-redesign-20261013.md) chỉ sửa widget/demo: một vùng giữa hiển thị chat hoặc bảng giá/quyền riêng tư/tư vấn, không lồng bảng dài vào lịch sử. Nút **← Trò chuyện** quay về chat; Escape từ phần phụ trợ quay về chat trước khi đóng panel. Nguồn của câu trả lời không phải báo giá được thu gọn. **Tư vấn** mở danh sách ba tư vấn viên và nói rõ website chưa có đủ giá/quy cách. Điều khiển **Bật hiểu sâu** dùng helper **Giúp Mầm hiểu câu hỏi rõ hơn**, với thông tin Google/18+/Việt Nam/Free/người rà soát ở phần quyền riêng tư riêng. Handler đồng ý, mascot và ba seed pending giữ nguyên. Không sửa WordPress hoặc SEO.

Danh thiếp hỏi **In offset** hoặc **In nhanh** trước khi báo giá nếu chưa biết phương pháp. In nhanh giữ bậc C300 đã có. Offset: 2 hộp tổng 90.000 ₫; 5 hộp tổng 120.000 ₫; mọi số nguyên từ 10 hộp tính theo chính sách chủ cơ sở **16.000 ₫/hộp** (12 hộp 192.000 ₫, 15 hộp 240.000 ₫). Số dưới 10 ngoài 2/5 cần làm rõ. Không đổi số lượng, không chia/ghép gói. Ba tổng công bố 2/5/10 hộp giữ nguyên; tổng từ chính sách là `computed-owner-offset`, không nhận là tổng website công bố.

## Quy cách và tra nguồn chỉ đọc

Kho `widget/information.json` tách biệt hoàn toàn giá: kích thước, giấy, số mặt, cán màng, gia công, thời gian và yêu cầu file của 23 mã sản phẩm. Thông tin có phạm vi/điều kiện, bằng chứng trang và ngày đọc trong [bản kê nguồn](docs/information-sources-20261013.md). Ưu tiên website chính; nguồn bổ sung chỉ là tham khảo. Mục không đủ bằng chứng hoặc xung đột giữ trạng thái cần làm rõ. Kích thước danh thiếp thông dụng 9 × 5,4 cm và thời gian cho danh thiếp không được áp dụng cho mọi sản phẩm; thời gian phụ thuộc file, đơn và xác nhận tư vấn.

Demo Production dùng `GET /api/mam-info?version=1&productId=…&field=…`: chỉ nhận mã trong danh sách và một trong bảy trường. Không gửi câu chat, lịch sử, file, thông tin khách hoặc URL tùy ý. Server chỉ đọc các trang công khai được kê chính xác trên hai domain, không theo chuyển hướng và chỉ trả lời văn đã rà soát khi bằng chứng còn khớp. Giới hạn 4 giây phía server, 5 giây phía client, cache nguồn trong bộ nhớ 90 giây; không ghi hay phân tích chat. Gemini không viết quy cách hoặc giá.

Câu hỏi thông tin được xử lý trước báo giá, giữ số lượng/quy cách trong phiên cho câu giá tiếp theo. Mầm dùng lời ngắn, lễ phép; nguồn chỉ hiện bằng link nhỏ “Xem chi tiết” trực tiếp. Mọi phản hồi đều hiện **bong bóng xám ba chấm**, không có chữ trạng thái đang tra. Mầm chờ tối thiểu 320 ms cho phản hồi local; tra cứu chạy song song và giữ chấm đến khi xong, không cộng thêm thời gian chờ. Reduced motion giữ chấm tĩnh. Hoàn tất, lỗi, làm mới, đóng hoặc hủy widget đều bỏ chấm; kết quả muộn không được ghi vào chat mới.

Nguồn bổ sung dùng nhãn **Giá tham khảo**. Tên nhà cung cấp bổ sung được ẩn trong lời chào, lựa chọn và chat; provider, URL, giá và điều kiện gốc vẫn giữ để kiểm tra. Không đổi nguồn bổ sung thành Thanh Ấn. Giá bổ sung đã xác minh và giá chủ cơ sở xác nhận được giữ nguyên; đợt đổi backlink không lấy giá Thanh Ấn cũ đè lên dữ liệu đó.

Chính sách `owner-floor-tier-2026-10-13` trong `widget/policy.js`:

- Với **giá mỗi đơn vị rõ ràng**, cùng sản phẩm, toàn bộ quy cách đã xác định, đơn vị và nhóm nguồn: chọn mốc công bố lớn nhất không vượt số lượng yêu cầu. Giữa hai mốc dùng mốc thấp hơn; trên mốc cuối giữ cùng đơn giá, không thêm giảm giá. Dưới mốc đầu chuyển tư vấn.
- Nhóm giá có mốc trùng nhưng xung đột, hoặc đơn giá tăng theo số lượng, bị chặn. Không ghép vật liệu, phương pháp in, biến thể hoặc nguồn khác nhau thành dãy bậc.
- Danh thiếp tính theo **hộp**, trần bậc 10 hộp. Trên 10 chỉ dùng cùng đơn giá khi nhóm nguồn có mốc 10 hộp công bố. Không quy đổi sang giá mỗi tấm.
- Giá gói hoặc `source_total` chỉ dùng đúng số lượng công bố, giữ nguyên tổng nguồn. Không chia gói thành đơn giá hoặc áp dụng bậc số lượng cho gói.
- Dòng có cơ sở số lượng danh nghĩa, mức tối thiểu chưa rõ hoặc ý nghĩa thanh toán cần xác nhận không được tự tính tổng. Thiếu quy cách, xung đột, gia công ngoài bảng hoặc hết hạn thì hỏi lại/Zalo.
- Tổng tính từ đơn giá là `computed-owner-tier`, kèm mốc nguồn và provenance `business-owner-policy`; tổng gói sẵn có là `published-package`. Không nhận tổng tính thành tổng website công bố. Không tự thêm VAT, phí, ưu đãi hay hứa thời hạn.

Ví dụ kiểm chứng baseline C300 Thanh Ấn: nguồn ghi 1/5/10 hộp tương ứng 90.000/80.000/70.000 ₫/hộp. Theo quy tắc chủ cơ sở, **12 × 70.000 = 840.000 ₫**, dùng mốc 10 hộp. Số tấm/hộp, kích thước và gia công chưa được nguồn xác minh không được tự điền; căn cứ nguồn và giới hạn giữ trong chi tiết/dữ liệu. Ví dụ này mô tả baseline web, không thay cho các giá sửa theo ma trận chủ cơ sở vừa xác nhận. [Nguồn C300](https://innhanhtphcm.com/san-pham/in-danh-thiep-giay-c300-gia-re).

Catalogue A4 cần phân biệt bìa C250/ruột C150 với bìa và ruột đều C150, đồng thời giữ phương pháp in/nguồn. A5 có ví dụ ước tính riêng, không phải ma trận giá cố định; không suy từ A4 hay mặc định số lượng. Dòng nguồn danh thiếp 20 hộp có xung đột 280.000/300.000 ₫ không được dùng. Chính sách offset chủ cơ sở tính 20 hộp thành 320.000 ₫ với provenance riêng; không chọn một trong hai giá nguồn xung đột.

## Chuyển động và vị trí Mầm

Canvas cắt sprite Seedy v10/v2 nguyên gốc, không ghép thêm mắt, đầu, vai, tay hoặc laptop. Có 9 trạng thái, 16 hướng nhìn, 73 ô runtime. Khi mở, Mầm nằm ngoài bên trái panel trên màn hình rộng, phía trên bên trái khi viewport không quá 560px. Avatar và launcher cùng **96 × 104px**; header không có avatar nhỏ, demo không có nhân vật lớn ở hero.

Lúc rảnh chạy idle, chớp mắt và thỉnh thoảng nhảy theo sprite. Sau khoảng 18 giây yên tĩnh, Mầm luân phiên waiting → review → failed, chạy một chu kỳ gốc rồi về idle. Mắt xoắn/choáng và mắt tròn ngạc nhiên nằm trong failed, thỉnh thoảng xuất hiện lúc rảnh theo lựa chọn của người dùng. Không kích hoạt bởi lắc chuột hoặc nội dung trả lời.

Rê vào hoặc chạm Mầm mới bật chú ý: nhìn theo con trỏ gần bằng 16 hướng gốc khoảng 6 giây, rồi về giữa. Di chuyển chuột quanh trang không tự kích hoạt/kéo dài chú ý. Nhập hoặc gửi câu hỏi dùng tư thế laptop working; sau khoảng 10 giây không nhập/gửi thì đứng lại. Đây là chuyển động trang trí trong phiên; yêu cầu bất đồng bộ có bong bóng ba chấm riêng. Reduced motion giữ frame tĩnh; pause, trang ẩn, đóng/làm mới/destroy hủy hoạt động và timer liên quan. Timing preview chưa được coi là timing đã xác minh của CD.

Chín trạng thái: idle, running-right, running-left, waving, jumping, failed, waiting, running, review. Greeting ánh xạ tới waving, working tới running. Mount có `attentionDurationMs` mặc định 6000 và `activityIdleMs` mặc định 10000. Rà soát từng frame tại `tests/mascot-preview.html`.

Asset: [sprite Seedy v10](https://chatgpt.com/cdn/assets/seedy-spritesheet-v10.c613f3fce1.webp), bản local `widget/seedy-spritesheet-v10.webp`, 1536 × 2288, lưới 8 × 11, mỗi ô 192 × 208. SHA-256: `4cc6c9f4bc61882379472dfa7fa91ca128b90933b0ae3cda9fff3da91dc6d1f8`.

## Gemini Free tùy chọn

Demo HTTP(S) mount `/api/mam-assist`; standalone và WordPress wrapper không dùng endpoint. Backend cần Vercel Production, đúng origin, edge country VN, khóa server và cờ xác nhận Free/quota đúng model. Production hiện cấu hình `gemini-3.5-flash-lite`; giá trị mặc định trong mã nếu không đặt model là `gemini-3.8-flash`. AI Studio **Default Gemini Project** đã được xác minh Free, với quota quan sát ngày 13/10/2026: Flash-Lite 15 RPM/250K TPM/500 RPD; Flash 3.8 là 5 RPM/250K TPM/20 RPD. Đây là giới hạn hiển thị theo project/model, không phải số lượt còn lại hoặc cam kết hạn mức cố định. [Giá](https://ai.google.dev/gemini-api/docs/pricing), [quota](https://ai.google.dev/gemini-api/docs/rate-limits).

Giao diện khách hàng không dùng nhãn model/backend trong các phần chính. Checkbox **Bật hiểu sâu** vẫn là opt-in không tích sẵn. Nút **Thông tin & quyền riêng tư** mở phần riêng với disclosure Google và xác nhận 18+/Việt Nam; không bỏ nội dung đồng ý hoặc thay payload/handler. Local xử lý trước; chỉ câu mới nhất chưa hiểu được gửi, không lịch sử hoặc bảng giá. Model trả đúng `intent` và `categoryId`; khách xác nhận sản phẩm gợi ý rồi mới vào local hỏi số lượng/quy cách. Hết quota, timeout, output sai hoặc thiếu cấu hình quay về local.

Google có thể dùng input/output Free để cải thiện sản phẩm và có người rà soát; không gửi thông tin cá nhân/bí mật/tài liệu khách hàng. `store:false` tắt lưu Interaction để truy xuất, không thay thế điều khoản dữ liệu Free. Bộ lọc của prototype không nhận diện được mọi dữ liệu nhạy cảm. [Điều khoản](https://ai.google.dev/gemini-api/terms), [Interactions/lưu trữ](https://ai.google.dev/gemini-api/docs/interactions-overview).

Ứng dụng không lưu chat bền vững, không analytics, không gửi chat cho doanh nghiệp. Client cách lần gọi tối thiểu 10 giây. Server giới hạn **mỗi instance**: 6/IP/phút, 30 tổng/phút, 2 đồng thời; đây là best effort, không phải hard cap toàn deployment/tài khoản. Chi tiết ở [adapter](docs/llm-adapter.md).

## Tích hợp website thường

Chép `widget/` cùng origin, giữ sprite cạnh `mascot.js`, nạp ở cuối body:

```html
<script src="/widget/policy.js"></script>
<script src="/widget/approved-language.js"></script>
<script src="/widget/mascot.js"></script>
<script src="/widget/price-menu.js"></script>
<script src="/widget/drag.js"></script>
<script src="/widget/presentation.js"></script>
<script src="/widget/widget.js"></script>
<script src="/widget/bootstrap.js"></script>
```

Hoặc nạp các script đến widget.js rồi gọi `ThanhAnChat.mount({dataUrl:'/widget/data.json',stylesheetUrl:'/widget/widget.css'})` khi đã có body. Promise trả instance `open()`, `close()`, `destroy()`; xử lý Promise bị từ chối nếu custom mount. Không trộn bootstrap tự động với custom mount. Mount lặp dùng chung instance kể cả đang tải. Nếu JSON/CSS/sprite lỗi tải/kiểm tra thì widget không hiện.

Gemini chỉ dùng khi endpoint cùng origin đã triển khai/cấu hình đúng: nạp `gemini-client.js` trước `widget.js`, custom mount có `aiEndpoint:'/api/mam-assist'`. Bootstrap hiện tại dùng kho quy cách đã rà soát và không tra mạng ngoài; wrapper WordPress cũ vẫn local. Tra nguồn chỉ đọc cần nạp source-info.js trước widget.js, triển khai api/mam-info.js cùng server/source-information.mjs và inventory, rồi custom mount với infoEndpoint cùng origin. Không đưa khóa vào JS, HTML, JSON hay assets WordPress.

Widget không tự mở; panel modeless không khóa cuộn/backdrop. Escape khi focus trong widget đóng và trả focus về launcher. Header có nút ×; khi mở thì launcher ẩn và Mầm nằm ngoài khung. Ô nhập local tối đa 1.000 ký tự, Gemini tối đa 500. Giữ tối đa 50 khối tin trong bộ nhớ; Làm mới/reload xóa phiên, Làm mới bỏ đồng ý Gemini. Input dùng `textContent`.

Shadow DOM tách CSS selector, không phải ranh giới bảo mật với host script. JSON/CSS phải HTTP(S) cùng origin. Nếu CDN/plugin tối ưu đổi origin/thứ tự nạp cần kiểm tra staging.

## WordPress — gói mặc định tắt

`wordpress/ta-mam-chat` chưa cài/kích hoạt trên website. Plugin mặc định **không hiện widget ngay cả khi kích hoạt**. Không tạo option, endpoint, bảng dữ liệu, tài khoản, credential hoặc network write. Gemini Function thuộc Vercel, không đóng gói thành backend WordPress.

Đợt sửa bố cục này giữ nguyên các file WordPress. Build mặc định không đồng bộ assets vào plugin. Các ghi chú staging bên dưới dành cho công việc tích hợp riêng, không được thực hiện trong đợt này.

Sau review và kiểm tra staging, quản trị viên có thể bật filter trong child theme/plugin riêng:

```php
add_filter('ta_mam_chat_enabled', '__return_true');
```

Gỡ filter/deactivate để tắt; không sửa theme cha. Wrapper enqueue footer, cần `wp_footer()`, bỏ qua nếu thiếu/không đọc được một trong tám asset (năm script, CSS, JSON, WebP). Giữ cùng origin, không thêm async tùy tiện. Mtime version không bảo đảm xóa cache HTML/JSON/CSS do CDN khác giữ.

Chưa có PHP runtime/WordPress sandbox; chưa PHP lint, enqueue thực tế, tương thích theme/plugin hay staging/live. WordPress 6.0/PHP 7.4 là mục tiêu header, không phải nghiệm thu. Trên staging cần thử filter tắt/bật, asset/focus/link/giá thiếu quy cách/quá hạn/mobile/cuộn/form, lỗi tải, build/cập nhật cache và deactivate. Gói này không triển khai WordPress live.

## Snapshot và kiểm chứng

Baseline bất biến có 177 dòng web/21 sản phẩm-biến thể, một ước tính A5 riêng, kích thước 353.748 byte. SHA-256 baseline: `408e5bf6fcd517a429c34abc6fb7192460584d8e16daa50a6ebfc3976b9f1c99`. Runtime hiện có 196 dòng/23 sản phẩm-biến thể: **148 giá mỗi đơn vị, 30 source_total, 18 reference_display**. Hash baseline không phải hash runtime đã sửa. Giữ provenance bản sửa chủ cơ sở tách khỏi bằng chứng giá web lịch sử. Mười hai dòng tag chữ nhật vốn đã là per_unit trong baseline; sáu tổng tag giữ lại khớp đúng số lượng × đơn giá, không coi toàn bộ tag là gói mới chuyển đổi.

SHA-256 dữ liệu runtime cuối: `a72e39615ad3e1a878a6afe995515f695b5610ca3033fc954ac340114f26fa5f`. SHA-256 policy có continuity/category hook hiện tại: `08c750d6130c266d8a24a1792b8934cafbb180957e3d45967002e2a45a7f5ef4`. Sprite native vẫn nguyên vẹn với hash ghi ở phần chuyển động.

Quy cách bông tai đã được xác minh thêm bằng [nguồn tham khảo bông tai](https://invinhphat.com/san-pham/in-tag-treo-khuyen-tai/): giấy Couche 300gsm, in offset hai mặt. Nguồn cho chọn cán màng mờ hoặc không cán, nhưng chưa xác định phương án nào đã gồm trong giá. Vì vậy phần cán màng vẫn cần xác nhận; `ownerRecipeIncomplete:true` giữ luồng chuyển tư vấn, không tự báo tổng cho quy cách còn thiếu. Link này là `secondarySourceUrls`; URL nguồn chính trong record giá chủ cơ sở vẫn null, baseline lịch sử được giữ. Bổ sung quy cách này không đổi 193 mức giá/VAT và không tạo đồng bộ live.

FAQ/liên hệ từ [Thanh Ấn](https://innhanhtphcm.com/), có [nguồn giá bổ sung](https://invinhphat.com/). Đối chiếu xác nhận 21 URL sản phẩm và 177 URL dòng giá lịch sử không đổi. Tác vụ Mầm không sửa URL/slug/canonical/redirect của website chính. Cập nhật nội dung website là công việc riêng; dataset giữ baseline lịch sử và không khẳng định từng giá sửa đã được công bố chính xác trên web.

Giá từ snapshot không được đọc lại mỗi lượt; endpoint thông tin chỉ xác minh quy cách, không đồng bộ giá. Engine dừng giá sau 30 ngày từ 00:00 UTC của snapshotDate theo đồng hồ browser; FAQ vẫn từ snapshot. Kiểm tra lại trước production, không chỉ đổi ngày để gia hạn. Chưa có endpoint WordPress hoặc đồng bộ giá live. Link Zalo/Gọi chỉ mở khi khách bấm, không tự nhắn/gửi chat.

QA 12/10/2026 là **baseline trước Gemini/bậc mới**: 253 policy, 19 menu, browser 101 ở mỗi viewport 1534×847, 390×844, 320×568, 844×390. 73 ô runtime khớp RGBA gốc. Không dùng số baseline để khẳng định flow giá/Gemini mới đã qua browser.

Bản bộ nhớ cụm từ/continuity trước đợt đổi UI đạt **693/693 Node**, **75/75 Gemini mock** ở cả 1280×720 và 320×568, **107/107 native/widget** ở 1280×720, không lỗi. Report: `evidence/oct13-language-memory-tests.txt`, `evidence/language-browser-desktop.json`, `evidence/language-browser-mobile-320.json`, `evidence/language-browser-native-desktop.json`. Mock không gọi Google. Trước đợt đổi 10 backlink, UI/quy cách đã đạt 816/816 Node, 101/101 mock ở 1280×720 và 320×568, 112/112 native ở 1280×720. Mã cuối sau đổi backlink đạt 834/834 Node. Hai harness đã bổ sung kiểm tra backlink, nhưng lần chạy browser mới bị chặn do kết nối điều khiển trình duyệt bị ngắt; không nhận số cũ thành kết quả mới. Report hiện tại: evidence/ui-redesign-node-tests.txt, evidence/ui-mock-desktop.json, evidence/ui-mock-mobile-320.json và evidence/ui-native-desktop.json trong gói bàn giao.

Kiểm tra đọc/bố cục thủ công đạt tại 390×844, 640×360 với CSS tương đương phóng 200%, 844×390 và chế độ fallback 390×360: ô nhập/nút đóng thấy được, chữ 16px, không tràn ngang. Trình duyệt không cung cấp thao tác zoom thực tế trong công cụ; đây là kiểm tra tương đương bằng CSS, không phải zoom browser 200%. Mobile là viewport mô phỏng Chrome; WordPress staging chưa kiểm tra.

Kiểm tra Gemini thật riêng ngày 13/10/2026: Production commit `6907`, deployment Vercel `5RbbRAEtkL3ALgZgk2d1KdNA3Ust` đã Ready sau redeploy, có **hai lần phân loại thật/UI xác nhận thành công**. Một câu thử tổng hợp là “quyển giới thiệu bộ sưu tập quần áo”: local unknown, Gemini trả catalogue và UI hiện nút xác nhận đúng. Không dùng thông tin cá nhân/lịch sử khách, không đọc khóa, không billing. Đây là kết quả lịch sử trên `6907`; bản Production sau đó `873` đã được xác minh riêng. Deployment bộ nhớ cụm từ/continuity mới còn chờ, và test mock không được nhận thành lời gọi live.

## GitHub và Vercel

Repo [Phanloc31012002/test-mam](https://github.com/Phanloc31012002/test-mam), không chứa khóa/dữ liệu khách/ảnh tài khoản. `vercel.json`: framework Other, build `node tools/build.mjs`, output public, Functions `/api/mam-assist` và `/api/mam-info` giới hạn thời gian 10 giây. Demo local không cần biến môi trường; [Production đã cấu hình server](docs/gemini-free-setup.md) bằng khóa có sẵn do chủ sở hữu tự nhập, không tạo khóa/bật billing.

Git deployment đã bật trong config repo; liên kết project, commit thực tế và Ready cần đối chiếu Vercel, không xem sửa config là đã deploy. [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration).

## Liên kết hiển thị Thanh Ấn

Theo mapping chủ cơ sở, 10 liên kết tham chiếu trong chat/bảng giá được đổi sang đúng trang Thanh Ấn đã kiểm tra đọc được; xem docs/display-backlinks-20261013.md. Dữ liệu 196 giá, provider và URL nguồn lịch sử không được sửa bởi mapping. Catalogue A5, decal giấy và tag bông tai giữ nguyên URL bổ sung. Một số đích mới có phạm vi quy cách khác, vì vậy link đổi dùng nhãn tham chiếu, không nhận là bằng chứng công bố của giá cũ. Kho thông tin vẫn xác minh trang nguồn riêng đã rà soát.

## Các hành vi bổ sung ngày 13/10/2026

Mọi phản hồi có ba chấm xám trước khi hiện, tối thiểu 320 ms; gửi câu mới sẽ hủy phần trả lời cũ và vẫn giữ ngữ cảnh local đã nhận. Đóng/làm mới/hủy widget dọn timer và chặn kết quả muộn. Ba chấm tĩnh khi giảm chuyển động.

FAQ cơ bản A4 (21 × 29,7 cm), A5 (14,8 × 21 cm), danh thiếp thông dụng (9 × 5,4 cm) và giấy Couche C300 (300 g/m²) trả lời local, không gọi mạng hoặc tự áp quy cách vào báo giá. Thông số sản phẩm/biến thể cụ thể vẫn cần kiểm chứng riêng.

Có thể kéo cả Mầm và cửa sổ bằng Mầm hoặc header, với ngưỡng 6 px, giới hạn theo viewport; nút ↔ trả về vị trí ban đầu. Input/link/nút khác giữ thao tác bình thường. Không lưu vị trí kéo hoặc chat khách.
