# Mầm — trợ lý thông tin in ấn của Thanh Ấn

Bản thử gồm widget, demo độc lập và plugin WordPress mặc định tắt. Mầm tra FAQ và **177 dòng giá** trong snapshot ngày 12/10/2026. Chính sách tính tổng theo bậc số lượng do chủ cơ sở duyệt ngày **13/10/2026** được ghi riêng trong engine; không nhận thành khoảng số lượng đã được website công bố.

Gemini Free là bộ hỗ trợ hiểu ý tùy chọn, đã có mã server/client và mặc định tắt. Model chỉ phân loại câu chưa được local hiểu; không tạo câu trả lời, thông số hoặc giá. Bộ kiểm thử dùng mock, chưa đọc/nhập khóa thật, chưa xác minh quota thực tế và chưa gọi Google thật. Xem [luồng Gemini](docs/llm-adapter.md) và [cách cấu hình](docs/gemini-free-setup.md).

## Chạy bản thử

Yêu cầu Node.js 20 trở lên; không cần `npm install` vì không có dependency bên ngoài.

```text
npm start
npm run build
npm test
node --test tests/gemini-server.test.mjs tests/gemini-client.test.mjs
```

`npm start` mở server static tại `http://127.0.0.1:4173/`, không chạy Vercel Function. `npm test` chạy các file được liệt kê trong `package.json`; test Gemini ở lệnh riêng dùng mock, không cần khóa. Build tạo `public/`, cập nhật assets plugin và `demo-standalone.html`.

Standalone chứa sẵn JSON, CSS, JS và sprite, không mount endpoint Gemini. Bản HTTP(S) tải sprite từ asset cùng origin, không tải nhân vật từ ChatGPT mỗi phiên. Link nguồn, Zalo hoặc Gọi chỉ mở khi khách chủ động bấm. Trang demo là nền để xem widget ở góc trang; tích hợp Thanh Ấn dùng riêng widget/plugin, không đưa cả bố cục demo vào website.

## Hội thoại và báo giá

Bấm **Báo giá** để chọn cần in gì. Mầm hỏi từng thông tin còn thiếu, ưu tiên số lượng, rồi giữ quy cách trong phiên để khách đổi số lượng/thông số. Đổi sản phẩm xóa thông số không còn áp dụng. Báo giá ngắn gồm sản phẩm, số lượng, đơn giá đúng đơn vị, tổng tham khảo và điều kiện quan trọng; có thể mở phần điều kiện đầy đủ riêng.

Bấm hoặc gõ **Xem bảng giá** khi muốn xem toàn bảng: chọn sản phẩm, quy cách, rồi xem các dòng nguồn. Không tự mở cả bảng sau mỗi câu hỏi giá. Bảng giữ số lượng, đơn vị, ý nghĩa giá, nguồn/ngày và điều kiện từng dòng; cuối bảng có lời nhắc Zalo in đậm và ba liên hệ đã xác minh. Nếu quy cách cần in không có trong bảng, khách nhắn Zalo để tư vấn.

Nguồn bổ sung dùng nhãn **Giá tham khảo**. Tên nhà cung cấp bổ sung được ẩn trong lời chào, lựa chọn và chat; provider, URL, giá và điều kiện gốc vẫn giữ để kiểm tra. Không đổi nguồn bổ sung thành Thanh Ấn. Ưu tiên dòng Thanh Ấn khi khớp cùng sản phẩm/quy cách; không chọn nguồn chỉ vì rẻ hơn.

Chính sách `owner-floor-tier-2026-10-13` trong `widget/policy.js`:

- Với **giá mỗi đơn vị rõ ràng**, cùng sản phẩm, toàn bộ quy cách đã xác định, đơn vị và nhóm nguồn: chọn mốc công bố lớn nhất không vượt số lượng yêu cầu. Giữa hai mốc dùng mốc thấp hơn; trên mốc cuối giữ cùng đơn giá, không thêm giảm giá. Dưới mốc đầu chuyển tư vấn.
- Nhóm giá có mốc trùng nhưng xung đột, hoặc đơn giá tăng theo số lượng, bị chặn. Không ghép vật liệu, phương pháp in, biến thể hoặc nguồn khác nhau thành dãy bậc.
- Danh thiếp tính theo **hộp**, trần bậc 10 hộp. Trên 10 chỉ dùng cùng đơn giá khi nhóm nguồn có mốc 10 hộp công bố. Không quy đổi sang giá mỗi tấm.
- Giá gói hoặc `source_total` chỉ dùng đúng số lượng công bố, giữ nguyên tổng nguồn. Không chia gói thành đơn giá hoặc áp dụng bậc số lượng cho gói.
- Dòng có cơ sở số lượng danh nghĩa, mức tối thiểu chưa rõ hoặc ý nghĩa thanh toán cần xác nhận không được tự tính tổng. Thiếu quy cách, xung đột, gia công ngoài bảng hoặc hết hạn thì hỏi lại/Zalo.
- Tổng tính từ đơn giá là `computed-owner-tier`, kèm mốc nguồn và provenance `business-owner-policy`; tổng gói sẵn có là `published-package`. Không nhận tổng tính thành tổng website công bố. Không tự thêm VAT, phí, ưu đãi hay hứa thời hạn.

Ví dụ C300 Thanh Ấn: nguồn ghi 1/5/10 hộp tương ứng 90.000/80.000/70.000 ₫/hộp. Theo quy tắc chủ cơ sở, **12 × 70.000 = 840.000 ₫**, dùng mốc 10 hộp và ghi tổng tham khảo. Số tấm/hộp, kích thước và gia công chưa được nguồn xác minh vẫn phải nêu rõ, không tự điền. [Nguồn C300](https://innhanhtphcm.com/san-pham/in-danh-thiep-giay-c300-gia-re).

Catalogue A4 cần phân biệt bìa C250/ruột C150 với bìa và ruột đều C150, đồng thời giữ phương pháp in/nguồn. A5 có ví dụ ước tính riêng, không phải ma trận giá cố định; không suy từ A4 hay mặc định số lượng. Thẻ danh thiếp 20 hộp có xung đột 280.000/300.000 ₫ bị loại khỏi báo giá; thẻ thiếu quy cách không trở thành đơn giá tự động.

## Chuyển động và vị trí Mầm

Canvas cắt sprite Seedy v10/v2 nguyên gốc, không ghép thêm mắt, đầu, vai, tay hoặc laptop. Có 9 trạng thái, 16 hướng nhìn, 73 ô runtime. Khi mở, Mầm nằm ngoài bên trái panel trên màn hình rộng, phía trên bên trái khi viewport không quá 560px. Avatar và launcher cùng **96 × 104px**; header không có avatar nhỏ, demo không có nhân vật lớn ở hero.

Lúc rảnh chạy idle, chớp mắt và thỉnh thoảng nhảy theo sprite. Sau khoảng 18 giây yên tĩnh, Mầm luân phiên waiting → review → failed, chạy một chu kỳ gốc rồi về idle. Mắt xoắn/choáng và mắt tròn ngạc nhiên nằm trong failed, thỉnh thoảng xuất hiện lúc rảnh theo lựa chọn của người dùng. Không kích hoạt bởi lắc chuột hoặc nội dung trả lời.

Rê vào hoặc chạm Mầm mới bật chú ý: nhìn theo con trỏ gần bằng 16 hướng gốc khoảng 6 giây, rồi về giữa. Di chuyển chuột quanh trang không tự kích hoạt/kéo dài chú ý. Nhập hoặc gửi câu hỏi dùng tư thế laptop working; sau khoảng 10 giây không nhập/gửi thì đứng lại. Đây là chuyển động trang trí trong phiên; chờ Gemini có thông báo riêng. Reduced motion giữ frame tĩnh; pause, trang ẩn, đóng/làm mới/destroy hủy hoạt động và timer liên quan. Timing preview chưa được coi là timing đã xác minh của CD.

Chín trạng thái: idle, running-right, running-left, waving, jumping, failed, waiting, running, review. Greeting ánh xạ tới waving, working tới running. Mount có `attentionDurationMs` mặc định 6000 và `activityIdleMs` mặc định 10000. Rà soát từng frame tại `tests/mascot-preview.html`.

Asset: [sprite Seedy v10](https://chatgpt.com/cdn/assets/seedy-spritesheet-v10.c613f3fce1.webp), bản local `widget/seedy-spritesheet-v10.webp`, 1536 × 2288, lưới 8 × 11, mỗi ô 192 × 208. SHA-256: `4cc6c9f4bc61882379472dfa7fa91ca128b90933b0ae3cda9fff3da91dc6d1f8`.

## Gemini Free tùy chọn

Demo HTTP(S) mount `/api/mam-assist`; standalone và WordPress wrapper không dùng endpoint. Backend cần Vercel Production, đúng origin, edge country VN, khóa server và cờ xác nhận Free/quota đúng model. Mặc định `gemini-3.8-flash`, alternative cho phép `gemini-3.5-flash-lite`. Google hiện có Free Tier cho hai model, nhưng quota thực tế cần xem project/model AI Studio, tính theo project chứ không theo từng khóa. [Giá](https://ai.google.dev/gemini-api/docs/pricing), [quota](https://ai.google.dev/gemini-api/docs/rate-limits).

Khách tự tích đồng ý sau khi đọc thông báo và xác nhận 18+/Việt Nam. Local xử lý trước; chỉ câu mới nhất chưa hiểu được gửi, không lịch sử hoặc bảng giá. Model trả đúng `intent` và `categoryId`; khách xác nhận sản phẩm gợi ý rồi mới vào local hỏi số lượng/quy cách. Hết quota, timeout, output sai hoặc thiếu cấu hình quay về local.

Google có thể dùng input/output Free để cải thiện sản phẩm và có người rà soát; không gửi thông tin cá nhân/bí mật/tài liệu khách hàng. `store:false` tắt lưu Interaction để truy xuất, không thay thế điều khoản dữ liệu Free. Bộ lọc của prototype không nhận diện được mọi dữ liệu nhạy cảm. [Điều khoản](https://ai.google.dev/gemini-api/terms), [Interactions/lưu trữ](https://ai.google.dev/gemini-api/docs/interactions-overview).

Ứng dụng không lưu chat bền vững, không analytics, không gửi chat cho doanh nghiệp. Client cách lần gọi tối thiểu 10 giây. Server giới hạn **mỗi instance**: 6/IP/phút, 30 tổng/phút, 2 đồng thời; đây là best effort, không phải hard cap toàn deployment/tài khoản. Chi tiết ở [adapter](docs/llm-adapter.md).

## Tích hợp website thường

Chép `widget/` cùng origin, giữ sprite cạnh `mascot.js`, nạp ở cuối body:

```html
<script src="/widget/policy.js"></script>
<script src="/widget/mascot.js"></script>
<script src="/widget/price-menu.js"></script>
<script src="/widget/widget.js"></script>
<script src="/widget/bootstrap.js"></script>
```

Hoặc nạp bốn script đầu rồi gọi `ThanhAnChat.mount({dataUrl:'/widget/data.json',stylesheetUrl:'/widget/widget.css'})` khi đã có body. Promise trả instance `open()`, `close()`, `destroy()`; xử lý Promise bị từ chối nếu custom mount. Không trộn bootstrap tự động với custom mount. Mount lặp dùng chung instance kể cả đang tải. Nếu JSON/CSS/sprite lỗi tải/kiểm tra thì widget không hiện.

Gemini chỉ dùng khi endpoint cùng origin đã triển khai/cấu hình đúng: nạp `gemini-client.js` trước `widget.js`, custom mount có `aiEndpoint:'/api/mam-assist'`. Bootstrap/plugin hiện tại vẫn local. Không đưa khóa vào JS, HTML, JSON hay assets WordPress.

Widget không tự mở; panel modeless không khóa cuộn/backdrop. Escape khi focus trong widget đóng và trả focus về launcher. Header có nút ×; khi mở thì launcher ẩn. Ô nhập local tối đa 1.000 ký tự, Gemini tối đa 500. Giữ tối đa 50 khối tin trong bộ nhớ; Làm mới/reload xóa phiên, Làm mới bỏ đồng ý Gemini. Input dùng `textContent`.

Shadow DOM tách CSS selector, không phải ranh giới bảo mật với host script. JSON/CSS phải HTTP(S) cùng origin. Nếu CDN/plugin tối ưu đổi origin/thứ tự nạp cần kiểm tra staging.

## WordPress — gói mặc định tắt

`wordpress/ta-mam-chat` chưa cài/kích hoạt trên website. Plugin mặc định **không hiện widget ngay cả khi kích hoạt**. Không tạo option, endpoint, bảng dữ liệu, tài khoản, credential hoặc network write. Gemini Function thuộc Vercel, không đóng gói thành backend WordPress.

Sau review và kiểm tra staging, quản trị viên có thể bật filter trong child theme/plugin riêng:

```php
add_filter('ta_mam_chat_enabled', '__return_true');
```

Gỡ filter/deactivate để tắt; không sửa theme cha. Wrapper enqueue footer, cần `wp_footer()`, bỏ qua nếu thiếu/không đọc được một trong tám asset (năm script, CSS, JSON, WebP). Giữ cùng origin, không thêm async tùy tiện. Mtime version không bảo đảm xóa cache HTML/JSON/CSS do CDN khác giữ.

Chưa có PHP runtime/WordPress sandbox; chưa PHP lint, enqueue thực tế, tương thích theme/plugin hay staging/live. WordPress 6.0/PHP 7.4 là mục tiêu header, không phải nghiệm thu. Trên staging cần thử filter tắt/bật, asset/focus/link/giá thiếu quy cách/quá hạn/mobile/cuộn/form, lỗi tải, build/cập nhật cache và deactivate. Gói này không triển khai WordPress live.

## Snapshot và kiểm chứng

`widget/data.json` giữ nguyên 177 dòng/21 sản phẩm-biến thể, một ước tính A5 riêng. `verifiedAtUtc`, URL, context/evidence và priceFacts/ghi chú gốc phục vụ kiểm tra. SHA-256: `408e5bf6fcd517a429c34abc6fb7192460584d8e16daa50a6ebfc3976b9f1c99`.

FAQ/liên hệ từ [Thanh Ấn](https://innhanhtphcm.com/), có [nguồn giá bổ sung](https://invinhphat.com/). Snapshot không được đọc lại mỗi lượt. Engine dừng giá sau 30 ngày từ 00:00 UTC của snapshotDate theo đồng hồ browser; FAQ vẫn từ snapshot. Kiểm tra lại trước production, không chỉ đổi ngày để gia hạn. Chưa có endpoint WordPress hoặc đồng bộ giá live. Link Zalo/Gọi chỉ mở khi khách bấm, không tự nhắn/gửi chat.

QA 12/10/2026 là **baseline trước Gemini/bậc mới**: 253 policy, 19 menu, browser 101 ở mỗi viewport 1534×847, 390×844, 320×568, 844×390. 73 ô runtime khớp RGBA gốc. Không dùng số baseline để khẳng định flow giá/Gemini mới đã qua browser.

Gemini mock server **192/192**, client **42/42** đã đạt; không gọi Google thật. Kết quả policy/quote/browser mới phải lấy từ report chạy sau thay đổi. Mobile là viewport mô phỏng Chrome; WordPress staging chưa kiểm tra. Deployment Ready và Gemini thật cần xác minh riêng, không suy từ build/mock.

## GitHub và Vercel

Repo [Phanloc31012002/test-mam](https://github.com/Phanloc31012002/test-mam), không chứa khóa/dữ liệu khách/ảnh tài khoản. `vercel.json`: framework Other, build `node tools/build.mjs`, output public, Function `/api/mam-assist` maxDuration 10 giây. Demo local không cần biến môi trường; Gemini cần [cấu hình server có chủ đích](docs/gemini-free-setup.md), không tự tạo khóa/bật billing.

Git deployment đã bật trong config repo; liên kết project, commit thực tế và Ready cần đối chiếu Vercel, không xem sửa config là đã deploy. [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration).
