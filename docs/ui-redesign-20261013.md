# Bố cục khung Mầm — 13/10/2026

Widget/build đã có giao diện bên dưới. Node đạt 814/814; mock đạt 101/101 ở desktop và mobile; native/widget đạt 112/112. Deployment cuối được ghi trong bằng chứng bàn giao. Không thiết kế lại trang Thanh Ấn, không sửa WordPress hoặc SEO.

## Một vùng nội dung đang hiển thị

Panel chỉ hiển thị chat **hoặc** phần phụ trợ bảng giá/quyền riêng tư/tư vấn. Hai phần dùng cùng chỗ ở giữa khung, không chồng bảng dài vào lịch sử chat. Chỉ phần đang hiển thị có cuộn dọc; phần ẩn không chiếm chiều cao hay nhận focus.

- Chat giữ các câu hỏi ngắn, phản hồi báo giá hai dòng và ô nhập.
- **Xem bảng giá** mở bảng trong phần phụ trợ. Quay lại trả về chat; bảng được dọn khỏi phần phụ trợ khi quay lại hoặc làm mới.
- Nút thông tin có accessible name **Thông tin & quyền riêng tư** mở phần phụ trợ riêng.
- **Tư vấn**, accessible name **Tư vấn qua Zalo**, mở ba liên hệ đã xác minh. Lời dẫn nói rõ website chưa có đủ mọi giá/quy cách; link chỉ mở theo click của khách.
- Nút **← Trò chuyện** hoặc Escape quay về chat và trả focus về điều khiển đã mở phần phụ trợ nếu còn tồn tại; nếu không thì về ô nhập. Khi vào phần phụ trợ, focus tới nút quay lại.
- Escape từ phần phụ trợ quay về chat; Escape tiếp ở chat đóng panel và trả focus về launcher. Nút × vẫn đóng panel.
- Làm mới ở header xóa phiên/đồng ý theo handler hiện có và trả focus về ô nhập.

Nguồn của phản hồi không phải báo giá nằm trong mục thu gọn. Điều kiện/nguồn của báo giá vẫn mở riêng khi cần. Không lặp một khối Zalo lớn bên cạnh nội dung đã hướng dẫn liên hệ; lối đi tới liên hệ vẫn có và chỉ mở link khi khách bấm.

## Điều khiển hiểu câu hỏi

Dòng điều khiển gọn dùng **Bật hiểu sâu**, với helper **Giúp Mầm hiểu câu hỏi rõ hơn**. Không dùng tên model/backend trong chat hoặc trạng thái chung. Checkbox vẫn là điều khiển đồng ý hiện có: không tự tích, không thêm bước kích hoạt hoặc tự bật khi mở panel.

Phần quyền riêng tư riêng vẫn giải thích đầy đủ: câu chưa hiểu có thể được gửi cho Google; dịch vụ Free có thể dùng input/output để cải thiện sản phẩm và có người rà soát; khách xác nhận 18+, đang ở Việt Nam và đồng ý; không nhập dữ liệu cá nhân/bí mật. Nội dung này phải truy cập được bằng bàn phím. Lịch sử do Mầm giữ chỉ trong phiên trang, không coi đó là cam kết lưu trữ của Google.

Local tiếp tục xử lý trước, rồi bộ nhớ cụm từ đã duyệt, sau đó mới dùng phần hiểu câu hỏi tùy chọn nếu còn unknown và đã đồng ý. Không đổi consent payload, timeout, cooldown, quota gate hoặc reset/abort. Ba seed vẫn pending, chưa có approved.

## Giữ nguyên nghiệp vụ và nhân vật

Đợt này bổ sung ba dòng offset 2/5/10 hộp và chính sách chủ cơ sở từ 10 hộp là 16.000 ₫/hộp; dữ liệu 193 dòng trước giữ nguyên. Không tự chọn quy cách còn thiếu. Câu hỏi thông tin ưu tiên trước báo giá và giữ ngữ cảnh số lượng. Mascot, sprite và lịch hoạt động không đổi; tên gọi điều khiển mới không biến Mầm thành trợ lý AI tổng quát.

Bong bóng `.ta-message-typing` chỉ hiện cho yêu cầu bất đồng bộ thật. Nó có nền xám và ba `.ta-typing-dot`; nhãn cho trình đọc màn hình được ẩn bằng `.ta-sr-only`. Không hiện chữ đang tra trong trạng thái chung. Reduced motion tắt nhún chấm. Hoàn tất/lỗi/timeout/làm mới/đóng/destroy bỏ bong bóng và kết quả muộn bị chặn.

Build mặc định được đổi để chỉ tạo demo độc lập/public runtime, không sao chép assets WordPress. Cờ `--wordpress-assets` dành cho công việc riêng đã được cho phép chuẩn bị assets plugin; không chạy cờ này trong đợt sửa UI. Plugin cũ giữ nguyên, mặc định tắt và chưa cài/kích hoạt website. Source widget mới không đồng nghĩa plugin đã nhận UI mới.

```text
npm run build
```

Lệnh trên tạo `demo-standalone.html` và `public/`, không vào nhánh sao chép WordPress. Chỉ công việc riêng đã cho phép mới dùng `node tools/build.mjs --wordpress-assets`. Build không tự cài plugin, sửa website/SEO hoặc triển khai Vercel.

Selector cho QA: `.ta-content` chứa `.ta-log` và `.ta-aux-view`; aux có `data-view="prices"`, `"privacy"` hoặc `"contacts"`, nút `.ta-view-back`, nội dung `.ta-aux-body`. Nguồn không phải quote dùng `.ta-source-details`. Đồng ý vẫn qua checkbox `.ta-ai-consent`; nút thông tin có `aria-controls` tới aux và `aria-expanded` theo trạng thái.

## Điều kiện nghiệm thu

Đối chiếu code cuối và kiểm tra desktop/mobile trước khi ghi kết quả: chỉ một vùng cuộn hiển thị; bảng/quyền riêng tư/back/Escape; focus/clear/close; input ở màn hình thấp; không tràn ngang; checkbox/đồng ý không đổi; nguồn thu gọn; không khối Zalo trùng; dữ liệu/mascot/seeds và assets WordPress giữ nguyên. Các report 693/75/107 của bản trước không chứng nhận bố cục mới.

Root đã chạy build, kiểm thử browser và kiểm tra thủ công bản độc lập ở 390×844. Lời trả lời kích thước C300 ngắn 9 × 5,4 cm, nguồn/điều kiện thu gọn, ngữ cảnh 5 hộp được giữ. Báo cáo mới không sử dụng lại số QA cũ.
