# Mầm — chatbot Thanh Ấn, bản thử để rà soát

Bản thử cục bộ: Mầm là bé cây pixel màu kem, hai lá non, má hồng, có thân, tay và laptop. Đầu và thân nối liền; mắt chấm nhìn rất nhẹ, đầu chỉ nghiêng tối đa 2° ở cổ và không dịch lên xuống. Mascot có ba trạng thái `idle`, `greeting`, `working`; mắt nhìn theo con trỏ ở gần, có chớp mắt và chuyển động nhẹ. Nhãn “Đang tra cứu” chỉ biểu thị tra bảng trong trình duyệt, không tạo độ trễ gọi LLM. Giao diện và trả lời bằng tiếng Việt. Đây là trợ lý FAQ/giá website theo dữ liệu đã xác minh, không phải AI tổng quát. Không có LLM, API key, analytics hoặc lưu chat bền vững.

Hướng nâng cấp AI tùy chọn nằm trong [`docs/llm-adapter.md`](docs/llm-adapter.md) và [`widget/intent-schema.json`](widget/intent-schema.json): model chạy phía server chỉ trích ý định/thông số, còn engine cố định quyết định mọi giá theo nguồn. Đây là thiết kế chưa kết nối; bản local không gọi model hoặc gửi nội dung khách hàng ra ngoài. Cần quyết định backend, model/chi phí và luồng dữ liệu khách hàng trước khi triển khai adapter.

## Xem bản thử

- Mở `demo-standalone.html` bằng trình duyệt: một tệp độc lập, không cần server để chat hoạt động.
- Hoặc chạy `npm start`, rồi vào `http://127.0.0.1:4173/`. Server chỉ lắng nghe localhost.
- `npm test` chạy bộ kiểm tra policy. `node tools/build.mjs` cập nhật demo độc lập và bản sao assets trong plugin.

Các lệnh trên cần Node.js 20 trở lên; không cần `npm install` vì dự án không dùng dependency bên ngoài. Bản độc lập chứa sẵn dữ liệu, CSS và JavaScript. Liên kết nguồn, Zalo hoặc Gọi vẫn cần trình duyệt/ứng dụng phù hợp khi người dùng chủ động bấm.

Widget không tự mở. Bấm bé cây hoặc nút trò chuyện. Escape đóng khi focus đang ở widget và trả focus về launcher. Panel modeless, không khóa cuộn hoặc đặt backdrop lên trang. Ô nhập giới hạn 1.000 ký tự; policy cũng từ chối câu hỏi dài hơn mức này. Giữ tối đa 50 khối tin trong bộ nhớ. Làm mới trang hoặc bấm “Làm mới” xóa phiên chat.

## Tích hợp WordPress — chỉ sau rà soát trên staging

Thư mục `wordpress/ta-mam-chat` là plugin nhỏ có thể đóng gói ZIP. Chưa được cài hoặc kích hoạt trên website. Plugin mặc định **không hiển thị widget ngay cả khi được kích hoạt**. Không tạo option, endpoint, bảng dữ liệu, tài khoản, credential hoặc network write.

Sau khi đã review và kiểm tra trên staging, người quản trị có thể chủ động bật bằng filter trong child theme hoặc plugin riêng:

```php
add_filter('ta_mam_chat_enabled', '__return_true');
```

Gỡ filter hoặc deactivate plugin để tắt. Không sửa theme cha. Không đưa đoạn bật này vào bản production khi snapshot giá chưa được kiểm tra lại. Wrapper dùng API enqueue thông thường, nạp script ở footer theo dependency; đối số footer dạng boolean hỗ trợ cả WordPress 6.0 và bản mới hơn. Theme cần gọi `wp_footer()`. Wrapper bỏ qua toàn bộ widget nếu thiếu hoặc không đọc được một trong sáu asset cục bộ; thời gian sửa mới nhất của cả sáu asset được dùng làm version cho script; bootstrap chuyển version đó sang URL CSS/JSON.

CSS nằm trong Shadow DOM để tách selector của widget khỏi website; đây không phải ranh giới bảo mật đối với script hoặc quy tắc nhắm trực tiếp vào host của trang. Loader chỉ chấp nhận URL dữ liệu/CSS dùng HTTP(S) và cùng origin với trang. Nếu plugin tối ưu hoặc CDN đổi origin của bootstrap, dữ liệu hoặc CSS, giữ các asset này ở origin và kiểm tra lại thứ tự nạp. Không thêm `async` tùy tiện vào bốn script.

Không có PHP runtime hoặc WordPress sandbox trong môi trường hiện tại. Wrapper mới được rà soát mã tĩnh; chưa chạy PHP lint, enqueue thực tế, kiểm tra theme/plugin hoặc cài đặt trên staging/live. Header plugin yêu cầu WordPress 6.0 và PHP 7.4 trở lên; đây là mục tiêu tương thích, không phải kết quả kiểm thử WordPress.

Checklist cho người quản trị khi có môi trường staging:

1. Chạy tests/build, rà soát lại nguồn và ngày dữ liệu, rồi đóng gói thư mục `ta-mam-chat` ở cấp gốc của ZIP. Cài trên staging và xác nhận khi chưa thêm filter không có widget/script của Mầm.
2. Thêm filter bật ở child theme hoặc plugin riêng trên staging. Kiểm tra bốn script, JSON và CSS tải thành công từ cùng origin; không có lỗi console. Nếu có plugin gộp, trì hoãn hoặc đổi URL asset, kiểm tra từng cấu hình đó.
3. Kiểm tra mở/đóng, Escape và focus, nguồn/ba liên hệ, câu hỏi giá thiếu điều kiện, snapshot quá hạn, màn hình nhỏ, cuộn trang và các nút/form sẵn có của website. Chặn tải dữ liệu/CSS để kiểm tra trang vẫn dùng được khi widget không tải được.
4. Sau mỗi cập nhật, chạy build để sao chép đúng asset, cập nhật cả thư mục plugin và xóa cache trang/CDN/CSS cần thiết. Version script không tự xóa cache của JSON, CSS hoặc trang HTML do hạ tầng khác giữ.
5. Gỡ filter hoặc deactivate và kiểm tra widget biến mất sau khi xóa cache trang. Chỉ quyết định triển khai live sau khi các bước trên đạt và snapshot đã được kiểm tra lại; gói này không thực hiện triển khai.

## Tích hợp website thường

Chép thư mục `widget/` vào một đường dẫn cùng origin. Đặt các script theo thứ tự này ở cuối `body`:

```html
<script src="/widget/policy.js"></script>
<script src="/widget/mascot.js"></script>
<script src="/widget/widget.js"></script>
<script src="/widget/bootstrap.js"></script>
```

Hoặc tự gọi `ThanhAnChat.mount({dataUrl:'/widget/data.json',stylesheetUrl:'/widget/widget.css'})` sau khi nạp ba script đầu và `document.body` đã có. Hàm trả Promise; instance có `open()`, `close()`, `destroy()`. Mount lặp lại, kể cả khi đang tải, dùng chung một instance. Dùng một cách khởi tạo; không trộn bootstrap tự động với custom mount. Xử lý Promise bị từ chối nếu tự mount. Nếu tải/kiểm tra JSON hoặc tải CSS thất bại, widget không hiển thị; bootstrap ghi cảnh báo trong console.

## Dữ liệu và chính sách giá

`widget/data.json` lưu snapshot nghiên cứu ngày 12/10/2026; xem `verifiedAtUtc` để biết mốc kiểm tra của từng nguồn/dòng. `sourceUrl`, `sourceContext`, `sourceEvidence` và `priceFacts` giữ nguồn, quy cách và loại giá đã công bố. FAQ và liên hệ lấy từ website Thanh Ấn [innhanhtphcm.com](https://innhanhtphcm.com/); bảng giá có thêm quy cách được kiểm tra từ [invinhphat.com](https://invinhphat.com/). Nguồn được ghi lại khi nghiên cứu, không được đọc lại trong mỗi lượt chat. FAQ dùng địa chỉ 174–174A Thái Phiên, Phường Bình Thới; giờ T2–T6 08:00–12:00 / 13:00–17:00, T7 08:00–16:00, CN nghỉ. Liên hệ và số điện thoại/Zalo nằm trong snapshot đã xác minh.

- **Ưu tiên theo đúng dòng và nguồn:** nếu Thanh Ấn có đúng sản phẩm, quy cách và số lượng, dùng dòng Thanh Ấn khi giá khác nhau. Vĩnh Phát bổ sung sản phẩm hoặc biến thể Thanh Ấn chưa có. Không chọn giá rẻ nhất, không gộp bảng và không coi hai dòng tương đương khi thiếu thông tin. Mỗi giá luôn giữ nguồn, đơn vị, điều kiện và ghi chú riêng; trường hợp chưa xác định được biến thể cần hỏi lại.
- **Catalogue A4 phải rõ giấy bìa/ruột:** bảng Thanh Ấn là bìa C250gsm, ruột C150gsm, 12/16/20/24/28/32/36 trang ở các mốc 200/500/1.000 cuốn. Thanh Ấn mô tả in KTS; Vĩnh Phát có bảng offset riêng cho bìa C250/ruột C150, và bảng dùng C150gsm cho cả bìa và ruột, 12/16/20/24/28/32 trang ở các mốc 200/500/1.000 cuốn. “A4, 16 trang, 500 cuốn” chưa phân biệt được hai quy cách; Mầm cần hỏi vật liệu trước khi trả đúng dòng. Không tự đổi bìa C250 thành C150 để áp giá khác.
- **Catalogue A5 chỉ có giá tham khảo ước tính:** trường hợp nguồn nêu 1.000 cuốn, 12 trang, khoảng 5.800 ₫/cuốn không phải ma trận giá cố định cho mọi đơn A5. Không mặc định 200 cuốn, không lấy mốc 200 của bảng A4 làm điều kiện chung cho A5 và không suy ra giá A5 cho số lượng/trang khác. Cần tư vấn viên xác nhận đơn thực tế.
- **Danh thiếp giữ đúng loại giá:** dòng Thanh Ấn C300, 5 hộp ghi 80.000 ₫/hộp với các điều kiện và phần chưa rõ của nguồn Thanh Ấn. Dòng Vĩnh Phát 100 tấm/hộp, 90 × 54 mm, in offset ghi tổng công bố 2 hộp = 90.000 ₫, 5 hộp = 120.000 ₫, 10 hộp = 160.000 ₫. Không tự thay giá Thanh Ấn bằng tổng Vĩnh Phát, không quy đổi tổng thành giá mỗi hộp/tấm và không coi các dòng tương đương nếu quy cách chưa được xác nhận.
- **Ghi chú thuế đi theo nguồn:** nhiều bảng Vĩnh Phát ghi chưa bao gồm VAT 10%; các bảng khác không chốt tỷ lệ hoặc chưa rõ VAT, nên giữ ghi chú từng hàng. Các dòng Thanh Ấn giữ ghi chú của nguồn Thanh Ấn. Mầm không tự cộng thuế hoặc xác nhận số tiền thanh toán cuối cùng.
- Giữ các dòng Thanh Ấn đã kiểm tra cho lì xì lớn và phiếu thu carbonless. Các thẻ có giá thiếu quy cách chỉ là “Giá hiển thị trên website”; không suy ra đơn giá hoặc tổng. Bao thư A5/1.350 và phiếu thu 2 liên/23.000 chưa khớp quy cách bảng nên không dùng để báo giá tự động; danh thiếp 20 hộp có xung đột 280.000/300.000 ₫ cũng bị loại khỏi báo giá.
- Mầm nhớ sản phẩm, số lượng, khổ, trang và vật liệu trong phiên. Chỉ trả giá dòng bảng khi khớp đầy đủ các điều kiện cần thiết. Không nội suy số lượng, giảm giá, tổng, phí giao, thời hạn, thuế hoặc ưu đãi; tổng chỉ được hiển thị nếu chính nguồn đã ghi cho đúng dòng và phải được gắn nhãn tổng công bố.
- Bản hiện tại dừng đưa giá khi vượt 30 ngày tính từ 00:00 UTC của `snapshotDate`, theo đồng hồ trình duyệt, rồi chuyển nguồn/tư vấn viên. Thông tin FAQ vẫn được trả lời từ snapshot; ngày dữ liệu luôn có ở đầu panel, một số câu trả lời kèm ngày/nguồn. Đây là giới hạn bảo thủ, không đảm bảo thông tin đúng trong 30 ngày; cần refresh ngay trước production.
- Nội dung nhập được hiển thị bằng `textContent`; policy dùng quy tắc cố định, không diễn giải prompt để đổi dữ liệu. Widget không dùng localStorage/sessionStorage, không lưu chat bền vững, không có analytics hoặc LLM. Bản phục vụ qua HTTP(S) đọc các tệp JSON/CSS/script cùng origin; nội dung chat chỉ được xử lý trong bộ nhớ trình duyệt, không gửi kèm các yêu cầu này. Link nguồn, Zalo/Gọi chỉ mở sau khi người dùng bấm; widget không tự gọi API liên hệ hoặc gửi cuộc trò chuyện. Chính sách của website/hạ tầng và ứng dụng ngoài khi mở liên kết cần được quản trị viên kiểm tra riêng trên staging.

Để cập nhật, kiểm tra trang gốc, sửa snapshot/điều kiện và chạy tests/build lại. Không chỉ đổi ngày để kéo dài thời hạn khi chưa kiểm tra nội dung. `mount()` có thể đọc JSON từ URL HTTP(S) cùng origin và kiểm tra cấu trúc trước khi hiển thị. Một endpoint tự cập nhật trong tương lai cần thiết kế và kiểm tra riêng. Chưa có đồng bộ giá live hoặc endpoint WordPress như vậy.

## Kết quả và phạm vi kiểm thử

Policy 250/250 và browser 60/60 đạt ở bốn viewport 1534×847, 390×844, 320×568 và 844×390. Đã kiểm tra mắt/đầu, nối đầu–thân ở các góc cực trị, ba tư thế, reduced motion, focus và hủy lookup khi clear/destroy. Có 177 hàng có nguồn trong 21 sản phẩm/biến thể, gồm 18 hàng cần tư vấn xác nhận, và ước tính A5 riêng. Standalone đã build và kiểm tra cấu trúc; chưa chạy browser file:// vì policy. Bằng chứng cục bộ trong evidence/ không được đưa lên GitHub. Mobile là viewport Chrome mô phỏng; WordPress chưa được chạy trên staging. Thiết kế pixel nguyên bản theo đặc tả được phép.


## Hội thoại nhiều lượt, không dùng API

Bản hiện tại nhận diện ý định và thông số bằng logic local, có aliases/typo giới hạn; không cần model, API key hoặc phí gọi API. Đây là trợ lý tra bảng có nhớ ngữ cảnh trong phiên, không phải mô hình sinh văn bản tổng quát. `ThanhAnFAQ.createSession(data)` trả `{answer(text), reset()}`; mỗi widget có một phiên riêng.

Ví dụ để rà soát hành vi của bản cập nhật:

- `giá card` → làm rõ vật liệu/quy cách và bảng áp dụng; dòng C300 5 hộp Thanh Ấn vẫn là **80.000 ₫/hộp**, còn dòng Vĩnh Phát 5 hộp × 100 tấm, 90 × 54 mm, in offset là **tổng công bố 120.000 ₫**. Phải giữ điều kiện và đơn vị của từng nguồn.
- `catalogue A4 16 trang 500 cuốn` → hỏi bìa C250/ruột C150 hay bìa và ruột đều C150 → tra đúng bảng. Không chọn một quy cách từ giá thấp hơn.
- Đổi số lượng trong cùng phiên giữ những thông số đã rõ; đổi sản phẩm xóa thông số không còn áp dụng. Nếu một điều kiện mới làm dòng trước không còn khớp, Mầm hỏi lại hoặc chuyển tư vấn viên.
- `catalogue A5` → trình bày giới hạn giá ước tính đã công bố và xin quy cách/số lượng; không mặc định 200 cuốn. 18 trang hoặc 300 cuốn không có dòng cố định thì không nội suy. Gia công khác như ép kim lì xì không dùng giá dòng thường.

Bấm “Làm mới” xóa cả tin nhắn và thông số hội thoại. Reload hoặc đóng trang không giữ phiên. Tài liệu adapter LLM chỉ là đề xuất chưa nối, không cần dùng cho bản hoàn chỉnh này.


## Tự triển khai Vercel từ GitHub

Repo người dùng chỉ định: https://github.com/Phanloc31012002/test-mam . Source không gồm ảnh, report chạy tests, khóa hoặc dữ liệu khách hàng.

`npm run build` tạo thư mục `public/` chỉ chứa demo runtime và mã test harness. `vercel.json` đặt framework Other, build command `node tools/build.mjs`, output `public`, không cần install dependency hoặc environment variable. Người dùng tự thực hiện import/deploy trên tài khoản và gói phù hợp; gói này không triển khai Vercel hoặc WordPress.

`git.deploymentEnabled` đang là `false` để commit source không tự kích hoạt deployment từ kết nối Git đã có. Khi người dùng quyết định bật auto deploy, tự đổi thành `true` hoặc xóa khóa này rồi commit. Cấu hình đó chỉ điều khiển deploy theo Git; cấu trúc build đã sẵn để review. Xem [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration) và kiểm tra điều khoản gói đang dùng trước khi triển khai.
