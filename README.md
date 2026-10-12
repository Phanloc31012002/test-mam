# Mầm — chatbot Thanh Ấn, bản thử để rà soát

Bản thử của Mầm dùng nguyên sprite Seedy v10/v2 của nhân vật cây pixel đang hiển thị trên trang ChatGPT đã được quan sát. Canvas cắt trực tiếp từng ô hình gốc, không dựng thêm mặt, đầu, thân hoặc bàn máy tính. Sprite có 9 trạng thái và 16 hướng nhìn, gồm 73 ô hình được sử dụng; hình nhìn theo và hình gõ laptop đều lấy từ asset này. Reduced motion giữ khung hình tĩnh. Đây là trợ lý FAQ/giá website theo dữ liệu đã xác minh; không có LLM, API key, analytics hoặc lưu chat bền vững.

Hướng nâng cấp AI tùy chọn nằm trong [`docs/llm-adapter.md`](docs/llm-adapter.md) và [`widget/intent-schema.json`](widget/intent-schema.json): model chạy phía server chỉ trích ý định/thông số, còn engine cố định quyết định mọi giá theo nguồn. Đây là thiết kế chưa kết nối; bản local không gọi model hoặc gửi nội dung khách hàng ra ngoài. Cần quyết định backend, model/chi phí và luồng dữ liệu khách hàng trước khi triển khai adapter.

## Xem bản thử

- Mở `demo-standalone.html` bằng trình duyệt: một tệp độc lập, không cần server để chat hoạt động.
- Hoặc chạy `npm start`, rồi vào `http://127.0.0.1:4173/`. Server chỉ lắng nghe localhost.
- `npm test` chạy bộ kiểm tra policy và menu giá. `node tools/build.mjs` cập nhật demo độc lập và bản sao assets trong plugin.

Các lệnh trên cần Node.js 20 trở lên; không cần `npm install` vì dự án không dùng dependency bên ngoài. Bản độc lập chứa sẵn dữ liệu, CSS, JavaScript và sprite WebP. Bản chạy qua HTTP(S) dùng bản sprite cục bộ cùng thư mục asset, không tải ảnh nhân vật từ ChatGPT trong mỗi phiên chat. Liên kết nguồn, Zalo hoặc Gọi vẫn cần trình duyệt/ứng dụng phù hợp khi người dùng chủ động bấm.

Trang demo chỉ là nền minh họa để thử widget ở góc trang; tích hợp website dùng riêng thư mục widget/plugin, không đưa toàn bộ bố cục demo lên website Thanh Ấn. Bản demo không có nhân vật lớn ở hero; công cụ rà soát sprite riêng nằm tại `tests/mascot-preview.html`.

Widget không tự mở. Bấm bé cây hoặc nút trò chuyện. Escape đóng khi focus đang ở widget và trả focus về launcher. Panel modeless, không khóa cuộn hoặc đặt backdrop lên trang. Khi mở, Mầm nằm ngoài panel, bên trái trên màn hình rộng và phía trên bên trái khi viewport rộng không quá 560px. Avatar và launcher cùng rộng 96px, cao 104px, lớn hơn khoảng 20% so với bản 80px trước đó; bố cục nhỏ chừa 114px phía trên để Mầm không bị cắt. Header chat không có avatar riêng. Khi mở chat, nút góc dưới ẩn để dành thêm vùng đọc; dấu × hoặc Escape đóng khung và trả focus về nút Mầm. Ô nhập giới hạn 1.000 ký tự; policy cũng từ chối câu hỏi dài hơn mức này. Giữ tối đa 50 khối tin trong bộ nhớ. Làm mới trang hoặc bấm “Làm mới” xóa phiên chat.

Bấm **Xem giá** hoặc gõ `xem giá` để chọn sản phẩm, chọn quy cách rồi xem toàn bộ bảng cho phương án đó. Bảng giữ số lượng, đơn vị/ý nghĩa giá và nguồn/ngày; mục "Xem toàn bộ điều kiện của từng dòng" cho phép kiểm tra đầy đủ quy cách. Các nguồn và phương pháp in khác nhau có lựa chọn riêng. Bảng bổ sung hiển thị nhãn “Giá tham khảo”; tên nhà in bổ sung không xuất hiện trong lời chào, lựa chọn hoặc nội dung chat. Provider, URL nguồn, giá và điều kiện gốc vẫn được giữ nguyên bên trong dữ liệu để kiểm tra; không đổi tên nguồn đó thành Thanh Ấn. A5 chỉ có ước tính thì hiển thị cảnh báo riêng, không tạo bảng giá cố định. Cuối bảng có lời nhắc Zalo in đậm và ba liên hệ đã xác minh; nút Quay lại giúp đổi quy cách hoặc sản phẩm. Câu hỏi gõ vẫn dùng phiên tra bảng như trước, và Làm mới xóa cả menu lẫn hội thoại.

## Chuyển động của Mầm

Lúc rảnh Mầm vẫn chạy hoạt cảnh `idle`, chớp mắt và thỉnh thoảng nhảy theo sprite gốc. Sau khoảng 18 giây yên tĩnh, Mầm luân phiên các biểu cảm `waiting` → `review` → `failed`, chạy đúng một chu kỳ nguyên gốc rồi trở về `idle`; mắt xoắn/choáng và mắt tròn ngạc nhiên nằm trong hàng `failed`. Nhảy/chớp mắt tự nhiên không làm mất mốc yên tĩnh; nếu đến hạn khi đang nhảy, biểu cảm chờ nhảy xong. Rê vào hoặc chạm Mầm để bật chú ý: Mầm dùng 16 ô hướng nhìn gốc để nhìn theo chuột ở gần trong khoảng 6 giây, rồi tự trở về giữa. Chú ý, nhập/gửi câu hỏi hoặc chào sẽ hủy biểu cảm và bắt đầu lại khoảng yên tĩnh; không phát lại biểu cảm đang chờ sau khi làm việc. Không có trigger choáng theo lắc chuột hoặc nội dung câu trả lời. Pause, trang bị ẩn, reduced motion và destroy hủy biểu cảm/timer; reduced motion giữ khung hình tĩnh. Di chuyển chuột quanh trang không tự kích hoạt hoặc kéo dài khoảng chú ý; chạm trên thiết bị cảm ứng không tạo hover liên tục. Khoảng 18 giây và thời lượng phát là cấu hình cục bộ của bản thử, không phải timing/trigger CD đã được xác minh.

Khi bắt đầu nhập câu hỏi hoặc gửi câu hỏi, Mầm ngồi ở bàn và gõ máy. Câu trả lời xuất hiện ngay sau tra cứu local; hình gõ máy được giữ như một tư thế trang trí khi đang trò chuyện, không biểu thị model hoặc tác vụ mạng đang chạy. Sau khoảng 10 giây không nhập hoặc gửi thêm, Mầm đứng lại. Đóng/làm mới/destroy widget hủy tư thế và các timer liên quan.

Có thể cấu hình khi gọi mount: attentionDurationMs mặc định 6000 (500–30000 ms), activityIdleMs mặc định 10000 (100–60000 ms). onStateChange báo tư thế mascot; host.dataset.activity là trạng thái tra cứu thực tế, tách khỏi host.dataset.mascotState là tư thế trang trí.

Nguồn ảnh: [Seedy spritesheet v10 trên CDN ChatGPT](https://chatgpt.com/cdn/assets/seedy-spritesheet-v10.c613f3fce1.webp), lấy từ asset của trang Chrome đã quan sát. Bản cục bộ là `widget/seedy-spritesheet-v10.webp`, kích thước 1536 × 2288; mỗi ô 192 × 208 trên lưới 8 × 11. SHA-256 của file nguyên vẹn: `4cc6c9f4bc61882379472dfa7fa91ca128b90933b0ae3cda9fff3da91dc6d1f8`.

Chín trạng thái là `idle`, `running-right`, `running-left`, `waving`, `jumping`, `failed`, `waiting`, `running`, `review`; `greeting` ánh xạ tới `waving`, `working` ánh xạ tới `running` có laptop. Hai hàng cuối giữ 16 hướng nhìn. `failed` có khung mắt xoắn/choáng trong sprite; chưa xác minh sự kiện nào kích hoạt trạng thái đó trong ứng dụng CD, nên bản thử không tự gán cho một thao tác của khách. Thời lượng khung hình, khoảng chú ý, nhảy lúc rảnh và thời gian nghỉ bàn là cấu hình của bản preview; việc dùng đúng asset không chứng minh timing trùng với ứng dụng native. `tests/mascot-preview.html` cho phép rà soát từng trạng thái và hướng nhìn.

## Tích hợp WordPress — chỉ sau rà soát trên staging

Thư mục `wordpress/ta-mam-chat` là plugin nhỏ có thể đóng gói ZIP. Chưa được cài hoặc kích hoạt trên website. Plugin mặc định **không hiển thị widget ngay cả khi được kích hoạt**. Không tạo option, endpoint, bảng dữ liệu, tài khoản, credential hoặc network write.

Sau khi đã review và kiểm tra trên staging, người quản trị có thể chủ động bật bằng filter trong child theme hoặc plugin riêng:

```php
add_filter('ta_mam_chat_enabled', '__return_true');
```

Gỡ filter hoặc deactivate plugin để tắt. Không sửa theme cha. Không đưa đoạn bật này vào bản production khi snapshot giá chưa được kiểm tra lại. Wrapper dùng API enqueue thông thường, nạp script ở footer theo dependency; đối số footer dạng boolean hỗ trợ cả WordPress 6.0 và bản mới hơn. Theme cần gọi `wp_footer()`. Wrapper bỏ qua toàn bộ widget nếu thiếu hoặc không đọc được một trong tám asset cục bộ: năm script, `widget.css`, `data.json` và `seedy-spritesheet-v10.webp`. Thời gian sửa mới nhất của cả tám asset được dùng làm version cho script; bootstrap chuyển version đó sang URL CSS/JSON.

CSS nằm trong Shadow DOM để tách selector của widget khỏi website; đây không phải ranh giới bảo mật đối với script hoặc quy tắc nhắm trực tiếp vào host của trang. Loader chỉ chấp nhận URL dữ liệu/CSS dùng HTTP(S) và cùng origin với trang. Nếu plugin tối ưu hoặc CDN đổi origin của bootstrap, dữ liệu hoặc CSS, giữ các asset này ở origin và kiểm tra lại thứ tự nạp. Sprite cần giữ trong cùng thư mục với `mascot.js`; widget chờ CSS và cả hai instance sprite tải xong trước khi hiển thị. Không thêm `async` tùy tiện vào năm script.

Không có PHP runtime hoặc WordPress sandbox trong môi trường hiện tại. Wrapper mới được rà soát mã tĩnh; chưa chạy PHP lint, enqueue thực tế, kiểm tra theme/plugin hoặc cài đặt trên staging/live. Header plugin yêu cầu WordPress 6.0 và PHP 7.4 trở lên; đây là mục tiêu tương thích, không phải kết quả kiểm thử WordPress.

Checklist cho người quản trị khi có môi trường staging:

1. Chạy tests/build, rà soát lại nguồn và ngày dữ liệu, rồi đóng gói thư mục `ta-mam-chat` ở cấp gốc của ZIP. Cài trên staging và xác nhận khi chưa thêm filter không có widget/script của Mầm.
2. Thêm filter bật ở child theme hoặc plugin riêng trên staging. Kiểm tra năm script, JSON, CSS và sprite WebP tải thành công từ cùng origin; không có lỗi console. Nếu có plugin gộp, trì hoãn hoặc đổi URL asset, kiểm tra từng cấu hình đó.
3. Kiểm tra mở/đóng, Escape và focus, nguồn/ba liên hệ, câu hỏi giá thiếu điều kiện, snapshot quá hạn, màn hình nhỏ, cuộn trang và các nút/form sẵn có của website. Chặn tải dữ liệu/CSS để kiểm tra trang vẫn dùng được khi widget không tải được.
4. Sau mỗi cập nhật, chạy build để sao chép đúng asset, cập nhật cả thư mục plugin và xóa cache trang/CDN/CSS cần thiết. Version script không tự xóa cache của JSON, CSS hoặc trang HTML do hạ tầng khác giữ.
5. Gỡ filter hoặc deactivate và kiểm tra widget biến mất sau khi xóa cache trang. Chỉ quyết định triển khai live sau khi các bước trên đạt và snapshot đã được kiểm tra lại; gói này không thực hiện triển khai.

## Tích hợp website thường

Chép thư mục `widget/` vào một đường dẫn cùng origin. Đặt các script theo thứ tự này ở cuối `body`:

```html
<script src="/widget/policy.js"></script>
<script src="/widget/mascot.js"></script>
<script src="/widget/price-menu.js"></script>
<script src="/widget/widget.js"></script>
<script src="/widget/bootstrap.js"></script>
```

Hoặc tự gọi `ThanhAnChat.mount({dataUrl:'/widget/data.json',stylesheetUrl:'/widget/widget.css'})` sau khi nạp bốn script đầu và `document.body` đã có. Giữ `seedy-spritesheet-v10.webp` bên cạnh `mascot.js`. Hàm trả Promise; instance có `open()`, `close()`, `destroy()`. Mount lặp lại, kể cả khi đang tải, dùng chung một instance. Dùng một cách khởi tạo; không trộn bootstrap tự động với custom mount. Xử lý Promise bị từ chối nếu tự mount. Nếu tải/kiểm tra JSON, tải CSS hoặc sprite thất bại, widget không hiển thị; bootstrap ghi cảnh báo trong console.

## Dữ liệu và chính sách giá

`widget/data.json` lưu snapshot nghiên cứu ngày 12/10/2026; xem `verifiedAtUtc` để biết mốc kiểm tra của từng nguồn/dòng. `sourceUrl`, `sourceContext`, `sourceEvidence` và `priceFacts` giữ nguồn, quy cách và loại giá đã công bố. FAQ và liên hệ lấy từ website Thanh Ấn [innhanhtphcm.com](https://innhanhtphcm.com/); bảng giá có thêm quy cách được kiểm tra từ [Nguồn giá tham khảo](https://invinhphat.com/). Nguồn được ghi lại khi nghiên cứu, không được đọc lại trong mỗi lượt chat. FAQ dùng địa chỉ 174–174A Thái Phiên, Phường Bình Thới; giờ T2–T6 08:00–12:00 / 13:00–17:00, T7 08:00–16:00, CN nghỉ. Liên hệ và số điện thoại/Zalo nằm trong snapshot đã xác minh.

- **Ưu tiên theo đúng dòng và nguồn:** nếu Thanh Ấn có đúng sản phẩm, quy cách và số lượng, dùng dòng Thanh Ấn khi giá khác nhau. nguồn giá tham khảo bổ sung sản phẩm hoặc biến thể Thanh Ấn chưa có. Không chọn giá rẻ nhất, không gộp bảng và không coi hai dòng tương đương khi thiếu thông tin. Mỗi giá luôn giữ nguồn, đơn vị, điều kiện và ghi chú riêng; trường hợp chưa xác định được biến thể cần hỏi lại.
- **Catalogue A4 phải rõ giấy bìa/ruột:** bảng Thanh Ấn là bìa C250gsm, ruột C150gsm, 12/16/20/24/28/32/36 trang ở các mốc 200/500/1.000 cuốn. Thanh Ấn mô tả in KTS; nguồn giá tham khảo có bảng offset riêng cho bìa C250/ruột C150, và bảng dùng C150gsm cho cả bìa và ruột, 12/16/20/24/28/32 trang ở các mốc 200/500/1.000 cuốn. “A4, 16 trang, 500 cuốn” chưa phân biệt được hai quy cách; Mầm cần hỏi vật liệu trước khi trả đúng dòng. Không tự đổi bìa C250 thành C150 để áp giá khác.
- **Catalogue A5 chỉ có giá tham khảo ước tính:** trường hợp nguồn nêu 1.000 cuốn, 12 trang, khoảng 5.800 ₫/cuốn không phải ma trận giá cố định cho mọi đơn A5. Không mặc định 200 cuốn, không lấy mốc 200 của bảng A4 làm điều kiện chung cho A5 và không suy ra giá A5 cho số lượng/trang khác. Cần tư vấn viên xác nhận đơn thực tế.
- **Danh thiếp giữ đúng loại giá:** dòng Thanh Ấn C300, 5 hộp ghi 80.000 ₫/hộp với các điều kiện và phần chưa rõ của nguồn Thanh Ấn. Dòng nguồn giá tham khảo 100 tấm/hộp, 90 × 54 mm, in offset ghi tổng công bố 2 hộp = 90.000 ₫, 5 hộp = 120.000 ₫, 10 hộp = 160.000 ₫. Không tự thay giá Thanh Ấn bằng tổng nguồn giá tham khảo, không quy đổi tổng thành giá mỗi hộp/tấm và không coi các dòng tương đương nếu quy cách chưa được xác nhận.
- **Ghi chú thuế đi theo nguồn:** nhiều bảng nguồn giá tham khảo ghi chưa bao gồm VAT 10%; các bảng khác không chốt tỷ lệ hoặc chưa rõ VAT, nên giữ ghi chú từng hàng. Các dòng Thanh Ấn giữ ghi chú của nguồn Thanh Ấn. Mầm không tự cộng thuế hoặc xác nhận số tiền thanh toán cuối cùng.
- Giữ các dòng Thanh Ấn đã kiểm tra cho lì xì lớn và phiếu thu carbonless. Các thẻ có giá thiếu quy cách chỉ là “Giá hiển thị trên website”; không suy ra đơn giá hoặc tổng. Bao thư A5/1.350 và phiếu thu 2 liên/23.000 chưa khớp quy cách bảng nên không dùng để báo giá tự động; danh thiếp 20 hộp có xung đột 280.000/300.000 ₫ cũng bị loại khỏi báo giá.
- Mầm nhớ sản phẩm, số lượng, khổ, trang và vật liệu trong phiên. Chỉ trả giá dòng bảng khi khớp đầy đủ các điều kiện cần thiết. Không nội suy số lượng, giảm giá, tổng, phí giao, thời hạn, thuế hoặc ưu đãi; tổng chỉ được hiển thị nếu chính nguồn đã ghi cho đúng dòng và phải được gắn nhãn tổng công bố.
- Bản hiện tại dừng đưa giá khi vượt 30 ngày tính từ 00:00 UTC của `snapshotDate`, theo đồng hồ trình duyệt, rồi chuyển nguồn/tư vấn viên. Thông tin FAQ vẫn được trả lời từ snapshot; ngày dữ liệu luôn có ở đầu panel, một số câu trả lời kèm ngày/nguồn. Đây là giới hạn bảo thủ, không đảm bảo thông tin đúng trong 30 ngày; cần refresh ngay trước production.
- Nội dung nhập được hiển thị bằng `textContent`; policy dùng quy tắc cố định, không diễn giải prompt để đổi dữ liệu. Widget không dùng localStorage/sessionStorage, không lưu chat bền vững, không có analytics hoặc LLM. Bản phục vụ qua HTTP(S) đọc các tệp JSON/CSS/script cùng origin; nội dung chat chỉ được xử lý trong bộ nhớ trình duyệt, không gửi kèm các yêu cầu này. Link nguồn, Zalo/Gọi chỉ mở sau khi người dùng bấm; widget không tự gọi API liên hệ hoặc gửi cuộc trò chuyện. Chính sách của website/hạ tầng và ứng dụng ngoài khi mở liên kết cần được quản trị viên kiểm tra riêng trên staging.

Để cập nhật, kiểm tra trang gốc, sửa snapshot/điều kiện và chạy tests/build lại. Không chỉ đổi ngày để kéo dài thời hạn khi chưa kiểm tra nội dung. `mount()` có thể đọc JSON từ URL HTTP(S) cùng origin và kiểm tra cấu trúc trước khi hiển thị. Một endpoint tự cập nhật trong tương lai cần thiết kế và kiểm tra riêng. Chưa có đồng bộ giá live hoặc endpoint WordPress như vậy.

## Kết quả và phạm vi kiểm thử

Policy 253/253, menu giá 19/19 và browser (1534×847: 101/101; 390×844: 101/101; 320×568: 101/101; 844×390: 101/101) đều đạt. Sprite Seedy v10 gốc: 57 frame của 9 trạng thái và 16 hướng nhìn (73 ô runtime) khớp từng byte RGBA với ô nguồn giải mã độc lập trong browser; alpha/padding không có ghost hoặc lộ frame cạnh. Canvas192×208 chỉ chép ô gốc, không vẽ thêm bộ phận/màu/mặt. Asset lossless1536×2288 giữ nguyên SHA-256 4cc6c9f4bc61882379472dfa7fa91ca128b90933b0ae3cda9fff3da91dc6d1f8. Idle chỉ dùng cột0–5; cột dư stock vẫn được giữ nguyên trong tệp. Đã kiểm tra hết chu kỳ playback, original failed frame2 có mắt xoắn, look theo16 góc native, gaze bị chặn ở mọi trạng thái ngoài idle, pause/blur/reduced motion, frame không bị reset khi gõ liên tục, và dọn timer/listener. Hover/chạm mới bật chú ý6 giây; global pointer không gia hạn. Nhập/gửi giữ tư thế working đến hạn10 giây không hoạt động; trạng thái tra cứu kết thúc khi có kết quả, còn tư thế working tiếp tục theo cửa sổ hoạt động. Harness kiểm tra default6/10 giây và timer ngắn riêng cho refresh/inactivity. Mầm nằm ngoài hộp chat ở phía trái, cùng kích thước96×104px với launcher (tăng20% từ80px); màn hình nhỏ đặt Mầm phía trên bên trái để giữ toàn bộ nhân vật trong viewport. Header không có avatar thu nhỏ. Sau18 giây yên tĩnh, Mầm luân phiên waiting/review/failed bằng đúng một chu kỳ gốc rồi về idle; biểu cảm mắt xoắn và mắt to nằm trong failed. Nhảy/chớp mắt không làm đói mốc quiet; làm việc hoặc chú ý hủy biểu cảm và không phát lại hàng chờ. Pause/reduced motion/ẩn/destroy dọn lịch và trả biểu cảm về idle. Không có trigger theo lắc chuột hay câu trả lời. Timing phát frame và ngưỡng quiet là cấu hình preview, chưa khẳng định trùng CD native từng mili giây. Menu giá 19/19: Xem giá → sản phẩm → quy cách → toàn bộ bảng. Giữ nguyên177 hàng giá trong21 sản phẩm/biến thể (132 giá theo đơn vị,27 tổng tiền nguồn,18 dòng tham khảo cần đủ điều kiện); chỉ ẩn tên nhà cung cấp bổ sung ở giao diện, không xóa giá hay đổi nguồn gốc dữ liệu. Từng hàng giữ số lượng, số trang, giá, ý nghĩa thanh toán, điều kiện, nguồn/ngày; Thanh Ấn21 dòng catalogue và bảng tham khảo toàn C150 đủ18 dòng; tổng gói danh thiếp không đổi thành giá mỗi hộp; A5 có ước tính riêng với cảnh báo đúng. Các biến thể bổ sung dùng nhãn Giá tham khảo, nút nguồn dùng nhãn chung và vẫn trỏ đúng URL đã xác minh. CTA Zalo in đậm/ba liên hệ đúng, quay lại/focus, heading và hàng đầu đọc được khi cuộn, hội thoại gõ sau menu, expiry/XSS và cleanup đều được kiểm tra. SHA-256 dữ liệu giữ nguyên 408e5bf6fcd517a429c34abc6fb7192460584d8e16daa50a6ebfc3976b9f1c99. Có 177 hàng giá có nguồn trong 21 sản phẩm/biến thể và ước tính A5 riêng. Standalone đã build/static checked; browser file:// chưa chạy vì policy. Evidence cục bộ không đưa lên GitHub. Mobile là viewport Chrome mô phỏng; WordPress chưa chạy staging.


## Hội thoại nhiều lượt, không dùng API

Bản hiện tại nhận diện ý định và thông số bằng logic local, có aliases/typo giới hạn; không cần model, API key hoặc phí gọi API. Đây là trợ lý tra bảng có nhớ ngữ cảnh trong phiên, không phải mô hình sinh văn bản tổng quát. `ThanhAnFAQ.createSession(data)` trả `{answer(text), reset()}`; mỗi widget có một phiên riêng.

Ví dụ để rà soát hành vi của bản cập nhật:

- `giá card` → làm rõ vật liệu/quy cách và bảng áp dụng; dòng C300 5 hộp Thanh Ấn vẫn là **80.000 ₫/hộp**, còn dòng nguồn giá tham khảo 5 hộp × 100 tấm, 90 × 54 mm, in offset là **tổng công bố 120.000 ₫**. Phải giữ điều kiện và đơn vị của từng nguồn.
- `catalogue A4 16 trang 500 cuốn` → hỏi bìa C250/ruột C150 hay bìa và ruột đều C150 → tra đúng bảng. Không chọn một quy cách từ giá thấp hơn.
- Đổi số lượng trong cùng phiên giữ những thông số đã rõ; đổi sản phẩm xóa thông số không còn áp dụng. Nếu một điều kiện mới làm dòng trước không còn khớp, Mầm hỏi lại hoặc chuyển tư vấn viên.
- `catalogue A5` → trình bày giới hạn giá ước tính đã công bố và xin quy cách/số lượng; không mặc định 200 cuốn. 18 trang hoặc 300 cuốn không có dòng cố định thì không nội suy. Gia công khác như ép kim lì xì không dùng giá dòng thường.

Bấm “Làm mới” xóa cả tin nhắn và thông số hội thoại. Reload hoặc đóng trang không giữ phiên. Tài liệu adapter LLM chỉ là đề xuất chưa nối, không cần dùng cho bản hoàn chỉnh này.


## Vercel cập nhật từ GitHub

Repo người dùng chỉ định: https://github.com/Phanloc31012002/test-mam . Source không gồm ảnh chụp màn hình, report chạy tests, khóa hoặc dữ liệu khách hàng.

`npm run build` tạo thư mục `public/` chỉ chứa demo runtime và mã test harness. `vercel.json` đặt framework Other, build command `node tools/build.mjs`, output `public`, không cần dependency hoặc environment variable.

Theo yêu cầu mới của người dùng, `git.deploymentEnabled` là `true`: khi project Vercel đã liên kết repo này, commit Git có thể tự kích hoạt deployment của bản thử. WordPress vẫn chưa được cài hoặc kích hoạt. Cấu hình project, trạng thái deployment và commit thực tế cần được đối chiếu trong Vercel; sửa config trong repo không tự chứng minh deployment đã Ready. Xem [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration).
