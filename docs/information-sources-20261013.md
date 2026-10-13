# Nguồn thông tin sản phẩm — 13/10/2026

Dữ liệu thông tin được lưu riêng tại `widget/information.json`. Toàn bộ 196 dòng giá, các điều kiện giá và SHA của `widget/data.json` giữ nguyên: `a72e39615ad3e1a878a6afe995515f695b5610ca3033fc954ac340114f26fa5f`. Có đủ 23 sản phẩm × 7 trường, với 98 thông tin có bằng chứng.

Lời trả lời thông thường dùng Dạ/ạ, không nêu tên nhà cung cấp hoặc kể cách tìm nguồn. URL, nhà cung cấp, thời điểm đọc, bằng chứng ngắn và điều kiện áp dụng nằm trong metadata. Ưu tiên Thanh Ấn theo từng trường; dữ liệu bổ sung chỉ là tham khảo và không tự gắn vào quy cách hay giá đang trao đổi.

| Trạng thái | Số trường |
| --- | ---: |
| verified | 13 |
| conditional | 85 |
| unknown | 61 |
| conflict | 2 |

| Sản phẩm | Trường có thông tin | Trường chưa đủ |
| --- | --- | --- |
| namecard-c300 | size, material, fileRequirements | sides (unknown), lamination (unknown), finishing (unknown), leadTime (conflict) |
| decal-paper | size, material, finishing | sides (unknown), lamination (unknown), leadTime (unknown), fileRequirements (unknown) |
| decal-plastic | material, finishing | size (unknown), sides (unknown), lamination (unknown), leadTime (unknown), fileRequirements (unknown) |
| flyer | size, material, sides, finishing, leadTime | lamination (unknown), fileRequirements (unknown) |
| catalogue | size, material, lamination, finishing, leadTime | sides (unknown), fileRequirements (unknown) |
| kraft-bag | size, material, sides, finishing, leadTime | lamination (unknown), fileRequirements (unknown) |
| paper-box | size, material, sides, lamination, finishing, leadTime | fileRequirements (unknown) |
| envelope-a5 | size, material | sides (unknown), lamination (unknown), finishing (unknown), leadTime (unknown), fileRequirements (unknown) |
| red-envelope | size, material, lamination, finishing, leadTime | sides (unknown), fileRequirements (unknown) |
| menu-paper | size, material, lamination, finishing | sides (unknown), leadTime (unknown), fileRequirements (unknown) |
| receipt | size, material, sides, finishing | lamination (unknown), leadTime (unknown), fileRequirements (unknown) |
| wedding | material, lamination, finishing | size (unknown), sides (unknown), leadTime (unknown), fileRequirements (unknown) |
| namecard-vp | size, material, sides, lamination, finishing, fileRequirements | leadTime (conflict) |
| namecard-digital-vp | size, material, sides, lamination, leadTime | finishing (unknown), fileRequirements (unknown) |
| decal-paper-vp | size, material, finishing, leadTime | sides (unknown), lamination (unknown), fileRequirements (unknown) |
| flyer-vp | size, material, sides, finishing, leadTime | lamination (unknown), fileRequirements (unknown) |
| envelope-vp | size, material, sides, finishing, leadTime | lamination (unknown), fileRequirements (unknown) |
| receipt-vp | size, material, sides, finishing | lamination (unknown), leadTime (unknown), fileRequirements (unknown) |
| paper-bag-vp | size, material, sides, lamination, finishing, leadTime | fileRequirements (unknown) |
| folder-vp | finishing | size (unknown), material (unknown), sides (unknown), lamination (unknown), leadTime (unknown), fileRequirements (unknown) |
| tag-vp | size, material, sides, lamination, finishing, leadTime | fileRequirements (unknown) |
| earring-tag-vp | size, material, sides, lamination, finishing, leadTime | fileRequirements (unknown) |
| namecard-offset-ta | finishing, leadTime, fileRequirements | size (unknown), material (unknown), sides (unknown), lamination (unknown) |

Các phạm vi cần giữ: danh thiếp 9 × 5,4 cm là khổ thông dụng, không phải điều kiện giá hay kích thước khách đã chọn. Catalogue C300/C150, cán mặt ngoài và đóng kim chỉ thuộc nhóm A4 offset. Bao thư A5 Thanh Ấn giữ đúng 17 × 23 cm/F120; không lấy khổ A6 hoặc khổ bao thư nguồn khác. Folder 7 cm là tay gấp, không phải kích thước toàn tấm. Lựa chọn một/hai mặt hoặc cán màng không tự trở thành phần đã gồm trong giá.

Thời gian chỉ là tham khảo có điều kiện theo file, số lượng và quy cách, không hứa ngày nhận. Danh thiếp C300 Thanh Ấn có mốc 30 phút và 2–3 tiếng chưa thống nhất; danh thiếp offset nguồn bổ sung có mốc 1 và 2 ngày chưa thống nhất. Hai trường này là conflict với facts rỗng, chuyển Zalo để xác nhận. Không tự chọn mốc 2 giờ để giải mâu thuẫn.

Yêu cầu file kỹ thuật phần lớn chưa được công bố. Các lời hỗ trợ thiết kế hay nhận file qua email không được đổi thành yêu cầu DPI/định dạng/chừa xén. Yêu cầu AI/Corel/PDF/Photoshop và ảnh từ 300 ppi cho danh thiếp nguồn bổ sung được giữ là tham khảo, cần nhân viên kiểm tra theo mẫu.

Trước khi trả lời trực tuyến, backend kiểm tra lại trang chính thức, bỏ nội dung script/style và đối chiếu tất cả chuỗi bằng chứng đã rà soát. Không khớp bằng chứng, lỗi đọc, trường unknown/conflict hoặc phạm vi chưa phù hợp phải trả về trạng thái cần xác nhận. Khách không cung cấp URL; không có dữ liệu khách gửi tới nguồn sản phẩm.

Nguồn đã rà soát:

- [Trang sản phẩm](https://innhanhtphcm.com/san-pham/in-bao-li-xi)
- [Trang sản phẩm](https://innhanhtphcm.com/san-pham/in-bao-thu-a5-in-nhanh-gia-re)
- [Trang sản phẩm](https://innhanhtphcm.com/san-pham/in-card-visit-offset)
- [Trang sản phẩm](https://innhanhtphcm.com/san-pham/in-catalogue-so-luong-it)
- [Trang sản phẩm](https://innhanhtphcm.com/san-pham/in-danh-thiep-chuan-gia-re)
- [Trang sản phẩm](https://innhanhtphcm.com/san-pham/in-danh-thiep-giay-c300-gia-re)
- [Trang sản phẩm](https://innhanhtphcm.com/san-pham/in-decal-giay-re-dep)
- [Trang sản phẩm](https://innhanhtphcm.com/san-pham/in-decal-nhua)
- [Trang sản phẩm](https://innhanhtphcm.com/san-pham/in-hop-giay-tphcm)
- [Trang sản phẩm](https://innhanhtphcm.com/san-pham/in-menu-giay)
- [Trang sản phẩm](https://innhanhtphcm.com/san-pham/in-phieu-thu-2-lien-tai-phuong-cho-lon-q5)
- [Trang sản phẩm](https://innhanhtphcm.com/san-pham/in-thiep-cuoi-gia-re-tai-thanh-an)
- [Trang sản phẩm](https://innhanhtphcm.com/san-pham/in-to-roi-to-gap)
- [Trang sản phẩm](https://innhanhtphcm.com/san-pham/thanh-an-in-tui-giay-kraft)
- [Trang sản phẩm](https://invinhphat.com/san-pham/cong-ty-in-danh-thiep-nhanh-gia-re-tphcm/)
- [Trang sản phẩm](https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/)
- [Trang sản phẩm](https://invinhphat.com/san-pham/in-folder-kep-file/)
- [Trang sản phẩm](https://invinhphat.com/san-pham/in-name-card-visit-danh-thiep-gia-re/)
- [Trang sản phẩm](https://invinhphat.com/san-pham/in-tag-treo-khuyen-tai/)
- [Trang sản phẩm](https://invinhphat.com/san-pham/in-tag-treo-the-bai/)
- [Trang sản phẩm](https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/)
- [Trang sản phẩm](https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/)
- [Trang sản phẩm](https://invinhphat.com/san-pham/in-tui-giay-gia-re/)
- [Trang sản phẩm](https://invinhphat.com/san-pham/phieu-thu-cac-loai/)
