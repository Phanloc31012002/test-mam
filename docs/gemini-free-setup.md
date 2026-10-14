# Cấu hình Gemini Free trên Vercel

**Bản sửa hiểu sâu mặc định được chuẩn bị từ `6aee189`.** Kết quả kiểm thử/build và trạng thái triển khai được ghi riêng trong báo cáo bàn giao; các kết quả gọi thật và nghiệm thu lịch sử bên dưới thuộc những bản trước.

Cấu hình Production đã được chấp thuận và kiểm chứng **hai lần phân loại Gemini thật/UI xác nhận thành công** ngày **13/10/2026**, trên commit `6907`. Chủ sở hữu tự lưu khóa có sẵn dưới dạng **Secret, Production**; người hỗ trợ chỉ xác nhận tên/loại/phạm vi biến, không đọc giá trị. Không tạo khóa mới hoặc bật billing. Gói mã không chứa khóa; khi thiếu cấu hình, FAQ/báo giá local vẫn hoạt động.

Production commit `6907`, redeploy Vercel `5RbbRAEtkL3ALgZgk2d1KdNA3Ust` đã Ready. [Demo Production](https://test-mam.vercel.app/) dùng `gemini-3.5-flash-lite`. Một câu thử tổng hợp là “quyển giới thiệu bộ sưu tập quần áo”: local chưa hiểu, Gemini gợi ý catalogue và UI xác nhận đúng. Không gửi thông tin cá nhân/lịch sử khách. Deployment cuối của dữ liệu/giao diện mới còn chờ xác nhận.

## Kiểm tra trước

Đã kiểm tra trong AI Studio xác thực: **Default Gemini Project**, Free Tier và quota thực tế của model. Dùng khóa có sẵn của project, không tạo thêm. Không gửi key trong chat/tài liệu/screenshot/console.

Production chọn **gemini-3.5-flash-lite**; mã cũng cho phép gemini-3.8-flash và dùng nó làm default nếu không đặt model. Quota quan sát ngày 13/10/2026 trong project:

| Model | RPM | TPM | RPD |
| --- | --- | --- | --- |
| gemini-3.5-flash-lite — đang dùng | 15 | 250K | 500 |
| gemini-3.8-flash — chưa chọn | 5 | 250K | 20 |

Các số là **giới hạn hiển thị lúc kiểm tra**, không phải số lượt/token còn lại hoặc bảo đảm hạn mức cố định. Quota tính theo project/model, không từng khóa; cần kiểm tra lại khi thay model hoặc Google đổi hạn mức. [Giá](https://ai.google.dev/gemini-api/docs/pricing), [model](https://ai.google.dev/gemini-api/docs/models), [quota](https://ai.google.dev/gemini-api/docs/rate-limits).

Free có thể dùng dữ liệu để cải thiện sản phẩm và người rà soát; không gửi thông tin cá nhân/nhạy cảm/bí mật. API yêu cầu 18+; bản Free này chỉ gate Việt Nam. Client dùng mặc định hiểu sâu, không có checkbox xác nhận tuổi hoặc đồng ý riêng trong phiên. [Điều khoản](https://ai.google.dev/gemini-api/terms).

## Biến Production đã lưu

Chủ sở hữu đã chấp thuận project Vercel/scope Production và việc gửi câu đã đồng ý tới Google, rồi tự nhập khóa trong UI Environment Variables bảo mật của [test-mam](https://vercel.com/httpsgithubcomphanloc31012002/test-mam/settings/environment-variables). Không chuyển key cho người hỗ trợ, không dùng PUBLIC_*/NEXT_PUBLIC_* hoặc commit key.

| Biến server | Giá trị |
| --- | --- |
| GEMINI_API_KEY | Khóa có sẵn; Secret, Production; chủ sở hữu tự nhập |
| GEMINI_MODEL | gemini-3.5-flash-lite; Production |
| GEMINI_FREE_TIER_VERIFIED_MODEL | gemini-3.5-flash-lite; Production |
| GEMINI_QUOTA_VERIFIED | true; Production; đã kiểm tra quota project/model |

VERCEL/VERCEL_ENV do nền tảng cung cấp, không giả lập để bật local. APP_ORIGIN mặc định `https://test-mam.vercel.app`; domain khác phải đúng HTTPS origin, không slash/path/wildcard. Preview mặc định tắt; chỉ mở có chủ đích với APP_ALLOW_PREVIEW=true và APP_ORIGIN chính xác. Không tự mở scope secret sang Preview/Development.

Cờ Free/quota chỉ ghi nhận kiểm tra thủ công, app không tự xác minh billing. Khi model/quota/điều khoản đổi, bỏ cờ xác nhận và review trước khi bật. Không thêm billing/paid upgrade để vượt quota trong phạm vi này.

Đã redeploy và kiểm tra Ready sau lưu biến; lần phân loại thật xác nhận endpoint dùng cấu hình mới. Khi thay đổi tiếp, biến mới cần deployment mới, không suy từ thao tác lưu. [Environment variables](https://vercel.com/docs/environment-variables), [Node Function](https://vercel.com/docs/functions/runtimes/node-js).

## Nghiệm thu không lộ khóa

1. Với bản sửa ngày 14/10/2026, kiểm tra local/mock trước; kiểm tra deployment chỉ khi bản sửa đã được phát hành riêng. Widget/demo không còn nút i **Thông tin & quyền riêng tư**, panel thông tin, thông báo hay link thay thế, cả standalone/chỉ chạy local. Panel bị bỏ chỉ cung cấp thông tin, không phải checkbox đồng ý hoặc điều khiển gửi AI. Cơ chế mặc định hiểu sâu và các kiểm soát AI giữ nguyên.
2. GET metadata cùng origin chỉ trả version/enabled/privacyVersion, không chứa chat. Widget chỉ tự gọi `setConsent(true)` sau khi metadata hợp lệ báo `enabled:true`. Dùng câu thử không riêng tư mà local và bộ nhớ cụm từ đã duyệt chưa nhận diện; nếu GET còn chờ, chỉ câu mới nhất chờ metadata rồi qua bộ lọc trước POST. Payload giữ `consent:'google-free-v1'`, `adult:true` để tương thích backend; đây là mặc định client, không phải bằng chứng checkbox được xác nhận hoặc tuổi được kiểm chứng. Model chỉ gợi ý intent/category; khách xác nhận rồi local hỏi số lượng/quy cách.
3. Hỏi giá/FAQ local hiểu không gọi Google; response không model text/giá/link lạ. Hết quota/lỗi/timeout quay local, không retry/tự đổi model.
4. Làm mới/đóng/gửi câu mới hủy POST và câu đang chờ metadata, chặn kết quả muộn và giữ mặc định hiểu sâu. GET không chứa chat được phép hoàn tất sau các thao tác này; destroy hủy cả GET. Không tự gửi lại câu đã hủy; reload không giữ chat và lần mount mới dùng mặc định nếu metadata khả dụng. Ứng dụng không thu thập chat riêng, không gửi lịch sử hoặc lưu chat bền vững. Bộ lọc không nhận diện mọi dữ liệu nhạy cảm; không dùng thông tin khách thật để thử.
5. Ghi riêng **mock** và **gọi thật**. Chỉ kết luận Gemini hoạt động sau gọi thật thành công bằng cấu hình đã duyệt/quota đã kiểm tra. Evidence không chứa key/header request.

Limiter best effort **mỗi instance** (6/IP/phút, 30 tổng/phút, 2 đồng thời), không hard cap toàn deployment/tài khoản. Google 429 khi chạm quota project/model thì app fallback. Muốn kiểm soát tổng usage chặt hơn cần hạ tầng riêng, không suy từ bộ đếm RAM. [Giới hạn và dữ liệu](llm-adapter.md).

## Tắt và phạm vi

Gỡ GEMINI_QUOTA_VERIFIED, làm cờ model không khớp hoặc gỡ secret rồi deploy lại để tắt; GET enabled:false, local vẫn hoạt động. Không sửa policy giá để xử lý lỗi Gemini.

Standalone không endpoint và không còn nút i/panel thông tin; WordPress plugin mặc định tắt/không backend Gemini, chưa cài website Thanh Ấn. Assets WordPress cũ giữ opt-in và không được đồng bộ trong đợt sửa widget/demo này. Không sửa bảo mật/hosting WordPress, không tự nhắn khách/doanh nghiệp, không gửi lịch sử/lưu chat bền vững/bật billing.

Lần gọi thật/Ready ở trên thuộc commit `6907`, không phải xác nhận bản sửa giá/giao diện mới đã phát hành. Runtime đã hoàn tất giá/metadata với 193 dòng/22 sản phẩm-biến thể, gồm 62 owner-revision. Source cuối đạt **652/652 Node**, **55/55 mock** ở cả 1280×720 và 320×568, cùng **107/107 native/widget** ở 1280×720 sau chạy lại đúng source, không có lỗi. Deployment cuối vẫn cần đối chiếu Ready/commit thực tế. Website updates là công việc riêng; dataset giữ baseline lịch sử và không khẳng định từng giá sửa đã công bố chính xác trên web.

Quy cách bông tai nay có C300/offset hai mặt từ [nguồn tham khảo thứ hai](https://invinhphat.com/san-pham/in-tag-treo-khuyen-tai/). Chỉ còn cán màng mờ hoặc không cán và việc giá đã gồm phương án nào cần xác nhận; ownerRecipeIncomplete vẫn true nên chuyển tư vấn. Nguồn này không đổi giá/VAT, không thay URL null của record chủ cơ sở hoặc tạo đồng bộ live.
