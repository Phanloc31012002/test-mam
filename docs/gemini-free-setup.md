# Cấu hình Gemini Free trên Vercel

Mã đã có, tính năng mặc định tắt. Chưa kiểm chứng gọi thật/quota project-model. FAQ/báo giá local vẫn hoạt động khi không cấu hình. Gói không chứa khóa, không tự tạo khóa hay bật billing.

## Kiểm tra trước

Chủ sở hữu dùng khóa có sẵn trong **Default Gemini Project**, không tạo thêm. Trong AI Studio tự kiểm tra đúng project ở Free Tier, model chọn có Free Tier và quota đang hoạt động. Ảnh chỉ “Free tier / Set up billing” chưa xác minh quota model. Không gửi key trong chat/tài liệu/screenshot/console.

Default `gemini-3.8-flash`; alternative cho phép `gemini-3.5-flash-lite`. Ngày 13/10/2026 trang Google liệt kê Free cho hai model. Quota RPM/TPM/RPD phụ thuộc project/model, không hứa lượt/ngày hoặc dùng bảng cũ thay AI Studio hiện tại. [Giá](https://ai.google.dev/gemini-api/docs/pricing), [model](https://ai.google.dev/gemini-api/docs/models), [quota](https://ai.google.dev/gemini-api/docs/rate-limits).

Free có thể dùng dữ liệu để cải thiện sản phẩm và người rà soát; không gửi thông tin cá nhân/nhạy cảm/bí mật. Bản thử chỉ người xác nhận 18+ tại Việt Nam. [Điều khoản](https://ai.google.dev/gemini-api/terms).

## Biến Production sau khi được chấp thuận

Persistent credential cần chủ sở hữu chấp thuận cụ thể project Vercel, scope Production và việc server gửi câu đã đồng ý tới Google. Chủ khóa tự nhập vào UI Environment Variables bảo mật của [test-mam](https://vercel.com/httpsgithubcomphanloc31012002/test-mam/settings/environment-variables); không chuyển key cho người hỗ trợ. Chọn **Production**, không dùng PUBLIC_*/NEXT_PUBLIC_* hoặc commit key.

| Biến server | Giá trị |
| --- | --- |
| GEMINI_API_KEY | Khóa có sẵn, chủ sở hữu tự nhập dưới dạng secret |
| GEMINI_MODEL | gemini-3.8-flash hoặc gemini-3.5-flash-lite |
| GEMINI_FREE_TIER_VERIFIED_MODEL | Chính xác model đã kiểm tra Free trong project |
| GEMINI_QUOTA_VERIFIED | true, chỉ sau kiểm tra quota project/model thực tế |

VERCEL/VERCEL_ENV do nền tảng cung cấp, không giả lập để bật local. APP_ORIGIN mặc định `https://test-mam.vercel.app`; domain khác phải đúng HTTPS origin, không slash/path/wildcard. Preview mặc định tắt; chỉ mở có chủ đích với APP_ALLOW_PREVIEW=true và APP_ORIGIN chính xác. Không tự mở scope secret sang Preview/Development.

Cờ Free/quota chỉ ghi nhận kiểm tra thủ công, app không tự xác minh billing. Khi model/quota/điều khoản đổi, bỏ cờ xác nhận và review trước khi bật. Không thêm billing/paid upgrade để vượt quota trong phạm vi này.

Biến Vercel mới áp dụng ở deployment sau lưu/redeploy. Cần Ready và đúng commit chứa endpoint, lưu biến chưa chứng minh deployment dùng cấu hình mới. [Environment variables](https://vercel.com/docs/environment-variables), [Node Function](https://vercel.com/docs/functions/runtimes/node-js).

## Nghiệm thu không lộ khóa

1. Từ Việt Nam mở đúng deployment, chat và phần Gemini. GET chỉ trả version/enabled/privacyVersion. Checkbox tắt thì kiểm tra scope/origin/region/flags/quota qua UI, không log key.
2. Đọc thông báo rồi xác nhận 18+/Việt Nam/đồng ý. Dùng câu thử không riêng tư mà local chưa nhận diện. Model chỉ gợi ý intent/category; khách xác nhận rồi local hỏi số lượng/quy cách.
3. Hỏi giá/FAQ local hiểu không gọi Google; response không model text/giá/link lạ. Hết quota/lỗi/timeout quay local, không retry/tự đổi model.
4. Revoke/Làm mới/đóng/destroy hủy request/kết quả muộn, reload không giữ chat/đồng ý. Không dùng thông tin khách thật.
5. Ghi riêng **mock** và **gọi thật**. Chỉ kết luận Gemini hoạt động sau gọi thật thành công bằng cấu hình đã duyệt/quota đã kiểm tra. Evidence không chứa key/header request.

Limiter best effort **mỗi instance** (6/IP/phút, 30 tổng/phút, 2 đồng thời), không hard cap toàn deployment/tài khoản. Google 429 khi chạm quota project/model thì app fallback. Muốn kiểm soát tổng usage chặt hơn cần hạ tầng riêng, không suy từ bộ đếm RAM. [Giới hạn và dữ liệu](llm-adapter.md).

## Tắt và phạm vi

Gỡ GEMINI_QUOTA_VERIFIED, làm cờ model không khớp hoặc gỡ secret rồi deploy lại để tắt; GET enabled:false, local vẫn hoạt động. Không sửa policy giá để xử lý lỗi Gemini.

Standalone không endpoint; WordPress plugin mặc định tắt/không backend Gemini, chưa cài website Thanh Ấn. Không sửa bảo mật/hosting WordPress, không tự nhắn khách/doanh nghiệp, không gửi lịch sử/lưu chat bền vững/bật billing.
