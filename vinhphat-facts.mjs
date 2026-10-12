// Verified Vĩnh Phát source snapshot, 12 October 2026, 04:46–04:50 UTC.
// Pure data only. No network calls, customer text, generated quotes or runtime price arithmetic.
// Receipt totals are literal values explicitly published and verified at the source.
// Payment-basis/spec ambiguities are retained; consumer policy must preserve source precedence.

export const VP_VERIFICATION_WINDOW = {
  "start": "2026-10-12T04:46:00Z",
  "end": "2026-10-12T04:50:00Z"
};

export const VP_SOURCE_PRODUCTS = [
  {
    "id": "namecard-digital-vp",
    "name": "Danh thiếp in kỹ thuật số Vĩnh Phát",
    "aliases": [
      "danh thiếp in kỹ thuật số",
      "danh thiếp in nhanh Vĩnh Phát",
      "card kỹ thuật số",
      "card digital",
      "namecard digital"
    ],
    "variant": "Danh thiếp in kỹ thuật số Vĩnh Phát",
    "sourceUrl": "https://invinhphat.com/san-pham/cong-ty-in-danh-thiep-nhanh-gia-re-tphcm/",
    "displayPriceVnd": 0,
    "quantity": null,
    "unit": null,
    "specifications": [
      "Danh thiếp 90 × 54 mm; 100 tấm/hộp",
      "Nguồn ghi giá theo hộp; số lượng đơn và mức tối thiểu chưa được xác minh",
      "Số mặt in chưa được xác minh",
      "Giá chưa gồm VAT; nguồn chưa xác định tỷ lệ",
      "Nếu chưa có file, nguồn ghi phí thiết kế thêm 50.000–100.000 ₫; không tự cộng phí"
    ],
    "quotationStatus": "reference_only_requires_confirmation",
    "missingConditions": [
      "số lượng đơn/mức tối thiểu",
      "số mặt in",
      "VAT áp dụng"
    ],
    "sourceEvidence": "Bảng công khai Vĩnh Phát đã được kiểm tra trong khoảng 04:46–04:50 UTC ngày 12/10/2026; mỗi dòng giữ nguyên điều kiện và cơ sở số tiền.",
    "sourceContext": "Danh thiếp in kỹ thuật số Vĩnh Phát — nguồn Vĩnh Phát",
    "verifiedAtUtc": "2026-10-12T04:50:00Z",
    "provider": "vinh-phat",
    "verificationWindowUtc": {
      "start": "2026-10-12T04:46:00Z",
      "end": "2026-10-12T04:50:00Z"
    },
    "sessionFields": [
      "material",
      "variant"
    ],
    "quantityKey": "hop",
    "sessionQuestions": {
      "material": "Bạn chọn Briston 300gsm, Briston 350gsm hay nhóm giấy mỹ thuật/Fort/Kraft/giấy gân?",
      "variant": "Bạn chọn nhóm có cán màng hay nhóm giấy không cán màng đúng như bảng nguồn?"
    },
    "slotAliases": {
      "material": {
        "briston300": [
          "briston 300",
          "bristol 300",
          "briston300"
        ],
        "briston350": [
          "briston 350",
          "bristol 350",
          "briston350"
        ],
        "art-fort-kraft-textured": [
          "giấy mỹ thuật",
          "giấy fort",
          "giấy kraft",
          "giấy gân"
        ]
      },
      "variant": {
        "with-film": [
          "cán màng",
          "có cán màng"
        ],
        "no-film": [
          "không cán màng"
        ]
      }
    },
    "rawSourceFlags": {
      "quantityKey": "hop",
      "nominalQuantityBasisOnly": true,
      "sourceOrderQuantity": null,
      "minimumOrderUnknown": true,
      "sidesUnknown": true,
      "vatExcluded": true,
      "vatRatePercent": null,
      "designFeeIfNoFileVnd": {
        "min": 50000,
        "max": 100000
      },
      "missingConditions": [
        "số lượng đơn/mức tối thiểu",
        "số mặt in",
        "VAT áp dụng"
      ]
    },
    "priceFacts": [
      {
        "id": "vp-digital-briston300",
        "lookupQuery": "Xem dòng bảng giá danh thiếp kỹ thuật số Vĩnh Phát Briston 300gsm có cán màng",
        "quantity": 1,
        "quantityUnit": "hộp",
        "unit": "hộp",
        "priceVnd": 90000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Danh thiếp 90 × 54 mm; 100 tấm/hộp",
          "Nguồn ghi giá theo hộp; số lượng đơn và mức tối thiểu chưa được xác minh",
          "Số mặt in chưa được xác minh",
          "Giá chưa gồm VAT; nguồn chưa xác định tỷ lệ",
          "Nếu chưa có file, nguồn ghi phí thiết kế thêm 50.000–100.000 ₫; không tự cộng phí",
          "Briston 300gsm có cán màng",
          "Số 1 là cơ sở danh nghĩa cho giá mỗi hộp, không phải đơn 1 hộp đã được xác minh"
        ],
        "specs": {
          "size": "90x54",
          "dimensionsUnit": "mm",
          "material": "briston300",
          "variant": "with-film",
          "cardsPerBox": 100
        },
        "sourceNote": "Chỉ tham khảo giá nguồn theo hộp; chưa xác minh số lượng đơn, mức tối thiểu và số mặt in. Không quy đổi thành giá mỗi tấm hoặc tổng đơn.",
        "sourceUrl": "https://invinhphat.com/san-pham/cong-ty-in-danh-thiep-nhanh-gia-re-tphcm/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "hop",
          "nominalQuantityBasisOnly": true,
          "sourceOrderQuantity": null,
          "minimumOrderUnknown": true,
          "sidesUnknown": true,
          "vatExcluded": true,
          "vatRatePercent": null,
          "designFeeIfNoFileVnd": {
            "min": 50000,
            "max": 100000
          },
          "missingConditions": [
            "số lượng đơn/mức tối thiểu",
            "số mặt in",
            "VAT áp dụng"
          ],
          "sourcePriceBasis": "per-box"
        }
      },
      {
        "id": "vp-digital-briston350",
        "lookupQuery": "Xem dòng bảng giá danh thiếp kỹ thuật số Vĩnh Phát Briston 350gsm có cán màng",
        "quantity": 1,
        "quantityUnit": "hộp",
        "unit": "hộp",
        "priceVnd": 120000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Danh thiếp 90 × 54 mm; 100 tấm/hộp",
          "Nguồn ghi giá theo hộp; số lượng đơn và mức tối thiểu chưa được xác minh",
          "Số mặt in chưa được xác minh",
          "Giá chưa gồm VAT; nguồn chưa xác định tỷ lệ",
          "Nếu chưa có file, nguồn ghi phí thiết kế thêm 50.000–100.000 ₫; không tự cộng phí",
          "Briston 350gsm có cán màng",
          "Số 1 là cơ sở danh nghĩa cho giá mỗi hộp, không phải đơn 1 hộp đã được xác minh"
        ],
        "specs": {
          "size": "90x54",
          "dimensionsUnit": "mm",
          "material": "briston350",
          "variant": "with-film",
          "cardsPerBox": 100
        },
        "sourceNote": "Chỉ tham khảo giá nguồn theo hộp; chưa xác minh số lượng đơn, mức tối thiểu và số mặt in. Không quy đổi thành giá mỗi tấm hoặc tổng đơn.",
        "sourceUrl": "https://invinhphat.com/san-pham/cong-ty-in-danh-thiep-nhanh-gia-re-tphcm/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "hop",
          "nominalQuantityBasisOnly": true,
          "sourceOrderQuantity": null,
          "minimumOrderUnknown": true,
          "sidesUnknown": true,
          "vatExcluded": true,
          "vatRatePercent": null,
          "designFeeIfNoFileVnd": {
            "min": 50000,
            "max": 100000
          },
          "missingConditions": [
            "số lượng đơn/mức tối thiểu",
            "số mặt in",
            "VAT áp dụng"
          ],
          "sourcePriceBasis": "per-box"
        }
      },
      {
        "id": "vp-digital-art-fort-kraft-textured",
        "lookupQuery": "Xem dòng bảng giá danh thiếp kỹ thuật số Vĩnh Phát Giấy mỹ thuật/Fort/Kraft/giấy gân không cán màng",
        "quantity": 1,
        "quantityUnit": "hộp",
        "unit": "hộp",
        "priceVnd": 150000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Danh thiếp 90 × 54 mm; 100 tấm/hộp",
          "Nguồn ghi giá theo hộp; số lượng đơn và mức tối thiểu chưa được xác minh",
          "Số mặt in chưa được xác minh",
          "Giá chưa gồm VAT; nguồn chưa xác định tỷ lệ",
          "Nếu chưa có file, nguồn ghi phí thiết kế thêm 50.000–100.000 ₫; không tự cộng phí",
          "Giấy mỹ thuật/Fort/Kraft/giấy gân không cán màng",
          "Số 1 là cơ sở danh nghĩa cho giá mỗi hộp, không phải đơn 1 hộp đã được xác minh"
        ],
        "specs": {
          "size": "90x54",
          "dimensionsUnit": "mm",
          "material": "art-fort-kraft-textured",
          "variant": "no-film",
          "cardsPerBox": 100
        },
        "sourceNote": "Chỉ tham khảo giá nguồn theo hộp; chưa xác minh số lượng đơn, mức tối thiểu và số mặt in. Không quy đổi thành giá mỗi tấm hoặc tổng đơn.",
        "sourceUrl": "https://invinhphat.com/san-pham/cong-ty-in-danh-thiep-nhanh-gia-re-tphcm/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "hop",
          "nominalQuantityBasisOnly": true,
          "sourceOrderQuantity": null,
          "minimumOrderUnknown": true,
          "sidesUnknown": true,
          "vatExcluded": true,
          "vatRatePercent": null,
          "designFeeIfNoFileVnd": {
            "min": 50000,
            "max": 100000
          },
          "missingConditions": [
            "số lượng đơn/mức tối thiểu",
            "số mặt in",
            "VAT áp dụng"
          ],
          "sourcePriceBasis": "per-box"
        }
      }
    ]
  },
  {
    "id": "decal-paper-vp",
    "name": "Decal giấy Vĩnh Phát",
    "aliases": [
      "decal giấy Vĩnh Phát",
      "tem nhãn giấy Vĩnh Phát",
      "tem giấy Vĩnh Phát"
    ],
    "variant": "Decal giấy Vĩnh Phát",
    "sourceUrl": "https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/",
    "displayPriceVnd": 0,
    "quantity": null,
    "unit": null,
    "specifications": [
      "Decal giấy; in offset; cắt hình chữ nhật",
      "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
      "Số tiền nằm tại ô của từng mốc số lượng; tiêu đề “đơn giá” chưa đủ để xác định cơ sở thanh toán",
      "Không diễn giải số tiền thành giá mỗi tem và không tự tính tổng"
    ],
    "quotationStatus": "reference_only_requires_confirmation",
    "missingConditions": [
      "cơ sở thanh toán của ô bảng",
      "quy cách ngoài hình chữ nhật"
    ],
    "sourceEvidence": "Bảng công khai Vĩnh Phát đã được kiểm tra trong khoảng 04:46–04:50 UTC ngày 12/10/2026; mỗi dòng giữ nguyên điều kiện và cơ sở số tiền.",
    "sourceContext": "Decal giấy Vĩnh Phát — nguồn Vĩnh Phát",
    "verifiedAtUtc": "2026-10-12T04:50:00Z",
    "provider": "vinh-phat",
    "verificationWindowUtc": {
      "start": "2026-10-12T04:46:00Z",
      "end": "2026-10-12T04:50:00Z"
    },
    "sessionFields": [
      "quantity",
      "size"
    ],
    "quantityKey": "cai",
    "sessionQuestions": {
      "quantity": "Bạn cần 1.000, 2.000, 3.000 hay 5.000 tem?",
      "size": "Bạn chọn 9 × 5,5 cm, A6 theo nguồn 10 × 15 cm hay A4 21 × 29,7 cm?"
    },
    "slotAliases": {
      "size": {
        "9x5.5": [
          "9x5.5",
          "9 x 5,5",
          "9 x 5.5"
        ],
        "a6": [
          "a6",
          "10x15",
          "10 x 15"
        ],
        "a4": [
          "a4",
          "21x29.7",
          "21 x 29,7"
        ]
      }
    },
    "rawSourceFlags": {
      "quantityKey": "cai",
      "ambiguousPriceHeader": "đơn giá",
      "paymentBasisRequiresConfirmation": true,
      "vatExcluded": true,
      "vatRatePercent": 10,
      "designIncluded": true,
      "missingConditions": [
        "cơ sở thanh toán của ô bảng",
        "quy cách ngoài hình chữ nhật"
      ]
    },
    "priceFacts": [
      {
        "id": "vp-decal-9x5.5-1000",
        "lookupQuery": "Xem dòng bảng giá decal giấy Vĩnh Phát 9 × 5,5 cm 1000 tem",
        "quantity": 1000,
        "quantityUnit": "tem",
        "unit": "giá trị bảng",
        "priceVnd": 450000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Decal giấy; in offset; cắt hình chữ nhật",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Số tiền nằm tại ô của từng mốc số lượng; tiêu đề “đơn giá” chưa đủ để xác định cơ sở thanh toán",
          "Không diễn giải số tiền thành giá mỗi tem và không tự tính tổng",
          "9 × 5,5 cm",
          "Mốc số lượng 1000 tem"
        ],
        "specs": {
          "size": "9x5.5",
          "dimensions": "9x5.5",
          "dimensionsUnit": "cm",
          "material": "decal-paper",
          "printing": "offset",
          "finishing": "rectangle-cut"
        },
        "sourceNote": "Giữ nguyên giá trị ô bảng ứng với mốc số lượng. Cơ sở thanh toán còn cần xác nhận do tiêu đề đơn giá; không gắn nhãn /tem, không nhân hoặc chia số tiền.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "ambiguousPriceHeader": "đơn giá",
          "paymentBasisRequiresConfirmation": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "missingConditions": [
            "cơ sở thanh toán của ô bảng",
            "quy cách ngoài hình chữ nhật"
          ],
          "sourceAmountAtQuantityRowVnd": 450000
        }
      },
      {
        "id": "vp-decal-9x5.5-2000",
        "lookupQuery": "Xem dòng bảng giá decal giấy Vĩnh Phát 9 × 5,5 cm 2000 tem",
        "quantity": 2000,
        "quantityUnit": "tem",
        "unit": "giá trị bảng",
        "priceVnd": 750000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Decal giấy; in offset; cắt hình chữ nhật",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Số tiền nằm tại ô của từng mốc số lượng; tiêu đề “đơn giá” chưa đủ để xác định cơ sở thanh toán",
          "Không diễn giải số tiền thành giá mỗi tem và không tự tính tổng",
          "9 × 5,5 cm",
          "Mốc số lượng 2000 tem"
        ],
        "specs": {
          "size": "9x5.5",
          "dimensions": "9x5.5",
          "dimensionsUnit": "cm",
          "material": "decal-paper",
          "printing": "offset",
          "finishing": "rectangle-cut"
        },
        "sourceNote": "Giữ nguyên giá trị ô bảng ứng với mốc số lượng. Cơ sở thanh toán còn cần xác nhận do tiêu đề đơn giá; không gắn nhãn /tem, không nhân hoặc chia số tiền.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "ambiguousPriceHeader": "đơn giá",
          "paymentBasisRequiresConfirmation": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "missingConditions": [
            "cơ sở thanh toán của ô bảng",
            "quy cách ngoài hình chữ nhật"
          ],
          "sourceAmountAtQuantityRowVnd": 750000
        }
      },
      {
        "id": "vp-decal-9x5.5-3000",
        "lookupQuery": "Xem dòng bảng giá decal giấy Vĩnh Phát 9 × 5,5 cm 3000 tem",
        "quantity": 3000,
        "quantityUnit": "tem",
        "unit": "giá trị bảng",
        "priceVnd": 1040000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Decal giấy; in offset; cắt hình chữ nhật",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Số tiền nằm tại ô của từng mốc số lượng; tiêu đề “đơn giá” chưa đủ để xác định cơ sở thanh toán",
          "Không diễn giải số tiền thành giá mỗi tem và không tự tính tổng",
          "9 × 5,5 cm",
          "Mốc số lượng 3000 tem"
        ],
        "specs": {
          "size": "9x5.5",
          "dimensions": "9x5.5",
          "dimensionsUnit": "cm",
          "material": "decal-paper",
          "printing": "offset",
          "finishing": "rectangle-cut"
        },
        "sourceNote": "Giữ nguyên giá trị ô bảng ứng với mốc số lượng. Cơ sở thanh toán còn cần xác nhận do tiêu đề đơn giá; không gắn nhãn /tem, không nhân hoặc chia số tiền.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "ambiguousPriceHeader": "đơn giá",
          "paymentBasisRequiresConfirmation": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "missingConditions": [
            "cơ sở thanh toán của ô bảng",
            "quy cách ngoài hình chữ nhật"
          ],
          "sourceAmountAtQuantityRowVnd": 1040000
        }
      },
      {
        "id": "vp-decal-9x5.5-5000",
        "lookupQuery": "Xem dòng bảng giá decal giấy Vĩnh Phát 9 × 5,5 cm 5000 tem",
        "quantity": 5000,
        "quantityUnit": "tem",
        "unit": "giá trị bảng",
        "priceVnd": 1550000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Decal giấy; in offset; cắt hình chữ nhật",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Số tiền nằm tại ô của từng mốc số lượng; tiêu đề “đơn giá” chưa đủ để xác định cơ sở thanh toán",
          "Không diễn giải số tiền thành giá mỗi tem và không tự tính tổng",
          "9 × 5,5 cm",
          "Mốc số lượng 5000 tem"
        ],
        "specs": {
          "size": "9x5.5",
          "dimensions": "9x5.5",
          "dimensionsUnit": "cm",
          "material": "decal-paper",
          "printing": "offset",
          "finishing": "rectangle-cut"
        },
        "sourceNote": "Giữ nguyên giá trị ô bảng ứng với mốc số lượng. Cơ sở thanh toán còn cần xác nhận do tiêu đề đơn giá; không gắn nhãn /tem, không nhân hoặc chia số tiền.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "ambiguousPriceHeader": "đơn giá",
          "paymentBasisRequiresConfirmation": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "missingConditions": [
            "cơ sở thanh toán của ô bảng",
            "quy cách ngoài hình chữ nhật"
          ],
          "sourceAmountAtQuantityRowVnd": 1550000
        }
      },
      {
        "id": "vp-decal-a6-1000",
        "lookupQuery": "Xem dòng bảng giá decal giấy Vĩnh Phát A6 theo nguồn 10 × 15 cm 1000 tem",
        "quantity": 1000,
        "quantityUnit": "tem",
        "unit": "giá trị bảng",
        "priceVnd": 650000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Decal giấy; in offset; cắt hình chữ nhật",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Số tiền nằm tại ô của từng mốc số lượng; tiêu đề “đơn giá” chưa đủ để xác định cơ sở thanh toán",
          "Không diễn giải số tiền thành giá mỗi tem và không tự tính tổng",
          "A6 theo nguồn 10 × 15 cm",
          "Mốc số lượng 1000 tem"
        ],
        "specs": {
          "size": "a6",
          "dimensions": "10x15",
          "dimensionsUnit": "cm",
          "material": "decal-paper",
          "printing": "offset",
          "finishing": "rectangle-cut"
        },
        "sourceNote": "Giữ nguyên giá trị ô bảng ứng với mốc số lượng. Cơ sở thanh toán còn cần xác nhận do tiêu đề đơn giá; không gắn nhãn /tem, không nhân hoặc chia số tiền.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "ambiguousPriceHeader": "đơn giá",
          "paymentBasisRequiresConfirmation": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "missingConditions": [
            "cơ sở thanh toán của ô bảng",
            "quy cách ngoài hình chữ nhật"
          ],
          "sourceAmountAtQuantityRowVnd": 650000
        }
      },
      {
        "id": "vp-decal-a6-2000",
        "lookupQuery": "Xem dòng bảng giá decal giấy Vĩnh Phát A6 theo nguồn 10 × 15 cm 2000 tem",
        "quantity": 2000,
        "quantityUnit": "tem",
        "unit": "giá trị bảng",
        "priceVnd": 1100000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Decal giấy; in offset; cắt hình chữ nhật",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Số tiền nằm tại ô của từng mốc số lượng; tiêu đề “đơn giá” chưa đủ để xác định cơ sở thanh toán",
          "Không diễn giải số tiền thành giá mỗi tem và không tự tính tổng",
          "A6 theo nguồn 10 × 15 cm",
          "Mốc số lượng 2000 tem"
        ],
        "specs": {
          "size": "a6",
          "dimensions": "10x15",
          "dimensionsUnit": "cm",
          "material": "decal-paper",
          "printing": "offset",
          "finishing": "rectangle-cut"
        },
        "sourceNote": "Giữ nguyên giá trị ô bảng ứng với mốc số lượng. Cơ sở thanh toán còn cần xác nhận do tiêu đề đơn giá; không gắn nhãn /tem, không nhân hoặc chia số tiền.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "ambiguousPriceHeader": "đơn giá",
          "paymentBasisRequiresConfirmation": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "missingConditions": [
            "cơ sở thanh toán của ô bảng",
            "quy cách ngoài hình chữ nhật"
          ],
          "sourceAmountAtQuantityRowVnd": 1100000
        }
      },
      {
        "id": "vp-decal-a6-3000",
        "lookupQuery": "Xem dòng bảng giá decal giấy Vĩnh Phát A6 theo nguồn 10 × 15 cm 3000 tem",
        "quantity": 3000,
        "quantityUnit": "tem",
        "unit": "giá trị bảng",
        "priceVnd": 1530000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Decal giấy; in offset; cắt hình chữ nhật",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Số tiền nằm tại ô của từng mốc số lượng; tiêu đề “đơn giá” chưa đủ để xác định cơ sở thanh toán",
          "Không diễn giải số tiền thành giá mỗi tem và không tự tính tổng",
          "A6 theo nguồn 10 × 15 cm",
          "Mốc số lượng 3000 tem"
        ],
        "specs": {
          "size": "a6",
          "dimensions": "10x15",
          "dimensionsUnit": "cm",
          "material": "decal-paper",
          "printing": "offset",
          "finishing": "rectangle-cut"
        },
        "sourceNote": "Giữ nguyên giá trị ô bảng ứng với mốc số lượng. Cơ sở thanh toán còn cần xác nhận do tiêu đề đơn giá; không gắn nhãn /tem, không nhân hoặc chia số tiền.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "ambiguousPriceHeader": "đơn giá",
          "paymentBasisRequiresConfirmation": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "missingConditions": [
            "cơ sở thanh toán của ô bảng",
            "quy cách ngoài hình chữ nhật"
          ],
          "sourceAmountAtQuantityRowVnd": 1530000
        }
      },
      {
        "id": "vp-decal-a6-5000",
        "lookupQuery": "Xem dòng bảng giá decal giấy Vĩnh Phát A6 theo nguồn 10 × 15 cm 5000 tem",
        "quantity": 5000,
        "quantityUnit": "tem",
        "unit": "giá trị bảng",
        "priceVnd": 2300000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Decal giấy; in offset; cắt hình chữ nhật",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Số tiền nằm tại ô của từng mốc số lượng; tiêu đề “đơn giá” chưa đủ để xác định cơ sở thanh toán",
          "Không diễn giải số tiền thành giá mỗi tem và không tự tính tổng",
          "A6 theo nguồn 10 × 15 cm",
          "Mốc số lượng 5000 tem"
        ],
        "specs": {
          "size": "a6",
          "dimensions": "10x15",
          "dimensionsUnit": "cm",
          "material": "decal-paper",
          "printing": "offset",
          "finishing": "rectangle-cut"
        },
        "sourceNote": "Giữ nguyên giá trị ô bảng ứng với mốc số lượng. Cơ sở thanh toán còn cần xác nhận do tiêu đề đơn giá; không gắn nhãn /tem, không nhân hoặc chia số tiền.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "ambiguousPriceHeader": "đơn giá",
          "paymentBasisRequiresConfirmation": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "missingConditions": [
            "cơ sở thanh toán của ô bảng",
            "quy cách ngoài hình chữ nhật"
          ],
          "sourceAmountAtQuantityRowVnd": 2300000
        }
      },
      {
        "id": "vp-decal-a4-1000",
        "lookupQuery": "Xem dòng bảng giá decal giấy Vĩnh Phát A4 21 × 29,7 cm 1000 tem",
        "quantity": 1000,
        "quantityUnit": "tem",
        "unit": "giá trị bảng",
        "priceVnd": 2100000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Decal giấy; in offset; cắt hình chữ nhật",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Số tiền nằm tại ô của từng mốc số lượng; tiêu đề “đơn giá” chưa đủ để xác định cơ sở thanh toán",
          "Không diễn giải số tiền thành giá mỗi tem và không tự tính tổng",
          "A4 21 × 29,7 cm",
          "Mốc số lượng 1000 tem"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29.7",
          "dimensionsUnit": "cm",
          "material": "decal-paper",
          "printing": "offset",
          "finishing": "rectangle-cut"
        },
        "sourceNote": "Giữ nguyên giá trị ô bảng ứng với mốc số lượng. Cơ sở thanh toán còn cần xác nhận do tiêu đề đơn giá; không gắn nhãn /tem, không nhân hoặc chia số tiền.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "ambiguousPriceHeader": "đơn giá",
          "paymentBasisRequiresConfirmation": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "missingConditions": [
            "cơ sở thanh toán của ô bảng",
            "quy cách ngoài hình chữ nhật"
          ],
          "sourceAmountAtQuantityRowVnd": 2100000
        }
      },
      {
        "id": "vp-decal-a4-2000",
        "lookupQuery": "Xem dòng bảng giá decal giấy Vĩnh Phát A4 21 × 29,7 cm 2000 tem",
        "quantity": 2000,
        "quantityUnit": "tem",
        "unit": "giá trị bảng",
        "priceVnd": 3300000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Decal giấy; in offset; cắt hình chữ nhật",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Số tiền nằm tại ô của từng mốc số lượng; tiêu đề “đơn giá” chưa đủ để xác định cơ sở thanh toán",
          "Không diễn giải số tiền thành giá mỗi tem và không tự tính tổng",
          "A4 21 × 29,7 cm",
          "Mốc số lượng 2000 tem"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29.7",
          "dimensionsUnit": "cm",
          "material": "decal-paper",
          "printing": "offset",
          "finishing": "rectangle-cut"
        },
        "sourceNote": "Giữ nguyên giá trị ô bảng ứng với mốc số lượng. Cơ sở thanh toán còn cần xác nhận do tiêu đề đơn giá; không gắn nhãn /tem, không nhân hoặc chia số tiền.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "ambiguousPriceHeader": "đơn giá",
          "paymentBasisRequiresConfirmation": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "missingConditions": [
            "cơ sở thanh toán của ô bảng",
            "quy cách ngoài hình chữ nhật"
          ],
          "sourceAmountAtQuantityRowVnd": 3300000
        }
      },
      {
        "id": "vp-decal-a4-3000",
        "lookupQuery": "Xem dòng bảng giá decal giấy Vĩnh Phát A4 21 × 29,7 cm 3000 tem",
        "quantity": 3000,
        "quantityUnit": "tem",
        "unit": "giá trị bảng",
        "priceVnd": 4950000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Decal giấy; in offset; cắt hình chữ nhật",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Số tiền nằm tại ô của từng mốc số lượng; tiêu đề “đơn giá” chưa đủ để xác định cơ sở thanh toán",
          "Không diễn giải số tiền thành giá mỗi tem và không tự tính tổng",
          "A4 21 × 29,7 cm",
          "Mốc số lượng 3000 tem"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29.7",
          "dimensionsUnit": "cm",
          "material": "decal-paper",
          "printing": "offset",
          "finishing": "rectangle-cut"
        },
        "sourceNote": "Giữ nguyên giá trị ô bảng ứng với mốc số lượng. Cơ sở thanh toán còn cần xác nhận do tiêu đề đơn giá; không gắn nhãn /tem, không nhân hoặc chia số tiền.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "ambiguousPriceHeader": "đơn giá",
          "paymentBasisRequiresConfirmation": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "missingConditions": [
            "cơ sở thanh toán của ô bảng",
            "quy cách ngoài hình chữ nhật"
          ],
          "sourceAmountAtQuantityRowVnd": 4950000
        }
      },
      {
        "id": "vp-decal-a4-5000",
        "lookupQuery": "Xem dòng bảng giá decal giấy Vĩnh Phát A4 21 × 29,7 cm 5000 tem",
        "quantity": 5000,
        "quantityUnit": "tem",
        "unit": "giá trị bảng",
        "priceVnd": 7250000,
        "sourceTotalVnd": null,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Decal giấy; in offset; cắt hình chữ nhật",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Số tiền nằm tại ô của từng mốc số lượng; tiêu đề “đơn giá” chưa đủ để xác định cơ sở thanh toán",
          "Không diễn giải số tiền thành giá mỗi tem và không tự tính tổng",
          "A4 21 × 29,7 cm",
          "Mốc số lượng 5000 tem"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29.7",
          "dimensionsUnit": "cm",
          "material": "decal-paper",
          "printing": "offset",
          "finishing": "rectangle-cut"
        },
        "sourceNote": "Giữ nguyên giá trị ô bảng ứng với mốc số lượng. Cơ sở thanh toán còn cần xác nhận do tiêu đề đơn giá; không gắn nhãn /tem, không nhân hoặc chia số tiền.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tem-nhan-decal-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "ambiguousPriceHeader": "đơn giá",
          "paymentBasisRequiresConfirmation": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "missingConditions": [
            "cơ sở thanh toán của ô bảng",
            "quy cách ngoài hình chữ nhật"
          ],
          "sourceAmountAtQuantityRowVnd": 7250000
        }
      }
    ]
  },
  {
    "id": "flyer-vp",
    "name": "Tờ rơi Vĩnh Phát",
    "aliases": [
      "tờ rơi Vĩnh Phát",
      "tờ gấp Vĩnh Phát",
      "brochure Vĩnh Phát",
      "leaflet Vĩnh Phát"
    ],
    "variant": "Tờ rơi Vĩnh Phát",
    "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
    "displayPriceVnd": 0,
    "quantity": null,
    "unit": null,
    "specifications": [
      "In offset CMYK",
      "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
      "Giá chưa gồm VAT 10% và thiết kế",
      "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm"
    ],
    "quotationStatus": "reference_only_requires_confirmation",
    "missingConditions": [
      "số mặt in",
      "gấp/bế nếu cần"
    ],
    "sourceEvidence": "Bảng công khai Vĩnh Phát đã được kiểm tra trong khoảng 04:46–04:50 UTC ngày 12/10/2026; mỗi dòng giữ nguyên điều kiện và cơ sở số tiền.",
    "sourceContext": "Tờ rơi Vĩnh Phát — nguồn Vĩnh Phát",
    "verifiedAtUtc": "2026-10-12T04:50:00Z",
    "provider": "vinh-phat",
    "verificationWindowUtc": {
      "start": "2026-10-12T04:46:00Z",
      "end": "2026-10-12T04:50:00Z"
    },
    "sessionFields": [
      "quantity",
      "size",
      "material"
    ],
    "quantityKey": "to",
    "sessionQuestions": {
      "quantity": "Bạn cần 1.000, 2.000, 5.000 hay 10.000 tờ?",
      "size": "Bạn chọn A4 theo nguồn 21 × 29 cm hay A5 14,5 × 21 cm?",
      "material": "Bạn chọn giấy Couche 100, 150 hay 200gsm?"
    },
    "slotAliases": {
      "size": {
        "a4": [
          "a4",
          "21x29",
          "21 x 29"
        ],
        "a5": [
          "a5",
          "14.5x21",
          "14,5 x 21"
        ]
      },
      "material": {
        "c100": [
          "c100",
          "c100gsm",
          "couche 100",
          "couche 100gsm"
        ],
        "c150": [
          "c150",
          "c150gsm",
          "couche 150",
          "couche 150gsm"
        ],
        "c200": [
          "c200",
          "c200gsm",
          "couche 200",
          "couche 200gsm"
        ]
      }
    },
    "rawSourceFlags": {
      "quantityKey": "to",
      "vatExcluded": true,
      "vatRatePercent": 10,
      "designExcluded": true,
      "sidesUnknown": true,
      "foldingIncluded": false,
      "dieCutIncluded": false,
      "missingConditions": [
        "số mặt in",
        "gấp/bế nếu cần"
      ]
    },
    "priceFacts": [
      {
        "id": "vp-flyer-a4-c100-1000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A4 21 × 29 cm C100 1000 tờ",
        "quantity": 1000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 700000,
        "sourceTotalVnd": 700000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A4 21 × 29 cm",
          "Giấy Couche 100gsm",
          "Mốc số lượng 1000 tờ"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29",
          "dimensionsUnit": "cm",
          "material": "c100",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a4-c150-1000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A4 21 × 29 cm C150 1000 tờ",
        "quantity": 1000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 800000,
        "sourceTotalVnd": 800000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A4 21 × 29 cm",
          "Giấy Couche 150gsm",
          "Mốc số lượng 1000 tờ"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29",
          "dimensionsUnit": "cm",
          "material": "c150",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a4-c200-1000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A4 21 × 29 cm C200 1000 tờ",
        "quantity": 1000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 1450000,
        "sourceTotalVnd": 1450000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A4 21 × 29 cm",
          "Giấy Couche 200gsm",
          "Mốc số lượng 1000 tờ"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29",
          "dimensionsUnit": "cm",
          "material": "c200",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a4-c100-2000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A4 21 × 29 cm C100 2000 tờ",
        "quantity": 2000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 1100000,
        "sourceTotalVnd": 1100000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A4 21 × 29 cm",
          "Giấy Couche 100gsm",
          "Mốc số lượng 2000 tờ"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29",
          "dimensionsUnit": "cm",
          "material": "c100",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a4-c150-2000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A4 21 × 29 cm C150 2000 tờ",
        "quantity": 2000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 1300000,
        "sourceTotalVnd": 1300000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A4 21 × 29 cm",
          "Giấy Couche 150gsm",
          "Mốc số lượng 2000 tờ"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29",
          "dimensionsUnit": "cm",
          "material": "c150",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a4-c200-2000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A4 21 × 29 cm C200 2000 tờ",
        "quantity": 2000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 2800000,
        "sourceTotalVnd": 2800000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A4 21 × 29 cm",
          "Giấy Couche 200gsm",
          "Mốc số lượng 2000 tờ"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29",
          "dimensionsUnit": "cm",
          "material": "c200",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a4-c100-5000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A4 21 × 29 cm C100 5000 tờ",
        "quantity": 5000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 2250000,
        "sourceTotalVnd": 2250000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A4 21 × 29 cm",
          "Giấy Couche 100gsm",
          "Mốc số lượng 5000 tờ"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29",
          "dimensionsUnit": "cm",
          "material": "c100",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a4-c150-5000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A4 21 × 29 cm C150 5000 tờ",
        "quantity": 5000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 2750000,
        "sourceTotalVnd": 2750000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A4 21 × 29 cm",
          "Giấy Couche 150gsm",
          "Mốc số lượng 5000 tờ"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29",
          "dimensionsUnit": "cm",
          "material": "c150",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a4-c200-5000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A4 21 × 29 cm C200 5000 tờ",
        "quantity": 5000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 4250000,
        "sourceTotalVnd": 4250000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A4 21 × 29 cm",
          "Giấy Couche 200gsm",
          "Mốc số lượng 5000 tờ"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29",
          "dimensionsUnit": "cm",
          "material": "c200",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a4-c100-10000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A4 21 × 29 cm C100 10000 tờ",
        "quantity": 10000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 4000000,
        "sourceTotalVnd": 4000000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A4 21 × 29 cm",
          "Giấy Couche 100gsm",
          "Mốc số lượng 10000 tờ"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29",
          "dimensionsUnit": "cm",
          "material": "c100",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a4-c150-10000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A4 21 × 29 cm C150 10000 tờ",
        "quantity": 10000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 4500000,
        "sourceTotalVnd": 4500000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A4 21 × 29 cm",
          "Giấy Couche 150gsm",
          "Mốc số lượng 10000 tờ"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29",
          "dimensionsUnit": "cm",
          "material": "c150",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a4-c200-10000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A4 21 × 29 cm C200 10000 tờ",
        "quantity": 10000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 7000000,
        "sourceTotalVnd": 7000000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A4 21 × 29 cm",
          "Giấy Couche 200gsm",
          "Mốc số lượng 10000 tờ"
        ],
        "specs": {
          "size": "a4",
          "dimensions": "21x29",
          "dimensionsUnit": "cm",
          "material": "c200",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a5-c100-1000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A5 14,5 × 21 cm C100 1000 tờ",
        "quantity": 1000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 650000,
        "sourceTotalVnd": 650000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A5 14,5 × 21 cm",
          "Giấy Couche 100gsm",
          "Mốc số lượng 1000 tờ"
        ],
        "specs": {
          "size": "a5",
          "dimensions": "14.5x21",
          "dimensionsUnit": "cm",
          "material": "c100",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a5-c150-1000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A5 14,5 × 21 cm C150 1000 tờ",
        "quantity": 1000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 750000,
        "sourceTotalVnd": 750000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A5 14,5 × 21 cm",
          "Giấy Couche 150gsm",
          "Mốc số lượng 1000 tờ"
        ],
        "specs": {
          "size": "a5",
          "dimensions": "14.5x21",
          "dimensionsUnit": "cm",
          "material": "c150",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a5-c200-1000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A5 14,5 × 21 cm C200 1000 tờ",
        "quantity": 1000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 1250000,
        "sourceTotalVnd": 1250000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A5 14,5 × 21 cm",
          "Giấy Couche 200gsm",
          "Mốc số lượng 1000 tờ"
        ],
        "specs": {
          "size": "a5",
          "dimensions": "14.5x21",
          "dimensionsUnit": "cm",
          "material": "c200",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a5-c100-2000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A5 14,5 × 21 cm C100 2000 tờ",
        "quantity": 2000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 750000,
        "sourceTotalVnd": 750000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A5 14,5 × 21 cm",
          "Giấy Couche 100gsm",
          "Mốc số lượng 2000 tờ"
        ],
        "specs": {
          "size": "a5",
          "dimensions": "14.5x21",
          "dimensionsUnit": "cm",
          "material": "c100",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a5-c150-2000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A5 14,5 × 21 cm C150 2000 tờ",
        "quantity": 2000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 850000,
        "sourceTotalVnd": 850000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A5 14,5 × 21 cm",
          "Giấy Couche 150gsm",
          "Mốc số lượng 2000 tờ"
        ],
        "specs": {
          "size": "a5",
          "dimensions": "14.5x21",
          "dimensionsUnit": "cm",
          "material": "c150",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a5-c200-2000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A5 14,5 × 21 cm C200 2000 tờ",
        "quantity": 2000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 1500000,
        "sourceTotalVnd": 1500000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A5 14,5 × 21 cm",
          "Giấy Couche 200gsm",
          "Mốc số lượng 2000 tờ"
        ],
        "specs": {
          "size": "a5",
          "dimensions": "14.5x21",
          "dimensionsUnit": "cm",
          "material": "c200",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a5-c100-5000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A5 14,5 × 21 cm C100 5000 tờ",
        "quantity": 5000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 1450000,
        "sourceTotalVnd": 1450000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A5 14,5 × 21 cm",
          "Giấy Couche 100gsm",
          "Mốc số lượng 5000 tờ"
        ],
        "specs": {
          "size": "a5",
          "dimensions": "14.5x21",
          "dimensionsUnit": "cm",
          "material": "c100",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a5-c150-5000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A5 14,5 × 21 cm C150 5000 tờ",
        "quantity": 5000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 1700000,
        "sourceTotalVnd": 1700000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A5 14,5 × 21 cm",
          "Giấy Couche 150gsm",
          "Mốc số lượng 5000 tờ"
        ],
        "specs": {
          "size": "a5",
          "dimensions": "14.5x21",
          "dimensionsUnit": "cm",
          "material": "c150",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a5-c200-5000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A5 14,5 × 21 cm C200 5000 tờ",
        "quantity": 5000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 3400000,
        "sourceTotalVnd": 3400000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A5 14,5 × 21 cm",
          "Giấy Couche 200gsm",
          "Mốc số lượng 5000 tờ"
        ],
        "specs": {
          "size": "a5",
          "dimensions": "14.5x21",
          "dimensionsUnit": "cm",
          "material": "c200",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a5-c100-10000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A5 14,5 × 21 cm C100 10000 tờ",
        "quantity": 10000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 2400000,
        "sourceTotalVnd": 2400000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A5 14,5 × 21 cm",
          "Giấy Couche 100gsm",
          "Mốc số lượng 10000 tờ"
        ],
        "specs": {
          "size": "a5",
          "dimensions": "14.5x21",
          "dimensionsUnit": "cm",
          "material": "c100",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a5-c150-10000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A5 14,5 × 21 cm C150 10000 tờ",
        "quantity": 10000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 2900000,
        "sourceTotalVnd": 2900000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A5 14,5 × 21 cm",
          "Giấy Couche 150gsm",
          "Mốc số lượng 10000 tờ"
        ],
        "specs": {
          "size": "a5",
          "dimensions": "14.5x21",
          "dimensionsUnit": "cm",
          "material": "c150",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      },
      {
        "id": "vp-flyer-a5-c200-10000",
        "lookupQuery": "Xem dòng bảng giá tờ rơi Vĩnh Phát A5 14,5 × 21 cm C200 10000 tờ",
        "quantity": 10000,
        "quantityUnit": "tờ",
        "unit": "đơn hàng theo bảng",
        "priceVnd": 4400000,
        "sourceTotalVnd": 4400000,
        "priceKind": "source_total",
        "priceBasis": "published-order-amount",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK",
          "Số tiền công bố cho từng mốc số lượng; không phải giá mỗi tờ",
          "Giá chưa gồm VAT 10% và thiết kế",
          "Số mặt in chưa được xác minh; gấp và bế chưa được bao gồm",
          "A5 14,5 × 21 cm",
          "Giấy Couche 200gsm",
          "Mốc số lượng 10000 tờ"
        ],
        "specs": {
          "size": "a5",
          "dimensions": "14.5x21",
          "dimensionsUnit": "cm",
          "material": "c200",
          "printing": "offset-cmyk"
        },
        "sourceNote": "Số tiền công bố ứng với toàn bộ mốc số lượng trong bảng; không ghi /tờ, không chia ra đơn giá và không nhân lại. Chưa gồm VAT 10%, thiết kế, gấp hoặc bế; số mặt cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-to-roi-to-gap-brochure-leaflets-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "to",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "sidesUnknown": true,
          "foldingIncluded": false,
          "dieCutIncluded": false,
          "missingConditions": [
            "số mặt in",
            "gấp/bế nếu cần"
          ]
        }
      }
    ]
  },
  {
    "id": "envelope-vp",
    "name": "Bao thư Vĩnh Phát",
    "aliases": [
      "bao thư Vĩnh Phát",
      "bì thư Vĩnh Phát",
      "phong bì Vĩnh Phát"
    ],
    "variant": "Bao thư Vĩnh Phát",
    "sourceUrl": "https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/",
    "displayPriceVnd": 0,
    "quantity": null,
    "unit": null,
    "specifications": [
      "In offset CMYK một mặt; bế",
      "Giá theo cái; chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
      "Keo/dán và cửa sổ chưa được xác minh",
      "Không có dòng 18 × 25 cm trong bảng đã kiểm tra"
    ],
    "quotationStatus": "reference_only_requires_confirmation",
    "missingConditions": [
      "keo/dán",
      "cửa sổ nếu cần"
    ],
    "sourceEvidence": "Bảng công khai Vĩnh Phát đã được kiểm tra trong khoảng 04:46–04:50 UTC ngày 12/10/2026; mỗi dòng giữ nguyên điều kiện và cơ sở số tiền.",
    "sourceContext": "Bao thư Vĩnh Phát — nguồn Vĩnh Phát",
    "verifiedAtUtc": "2026-10-12T04:50:00Z",
    "provider": "vinh-phat",
    "verificationWindowUtc": {
      "start": "2026-10-12T04:46:00Z",
      "end": "2026-10-12T04:50:00Z"
    },
    "sessionFields": [
      "quantity",
      "size",
      "material"
    ],
    "quantityKey": "cai",
    "sessionQuestions": {
      "quantity": "Bạn cần 1.000, 2.000 hay 5.000 cái?",
      "size": "Bạn chọn 12 × 22 cm hay 25 × 35 cm? Bảng không có dòng 18 × 25 cm.",
      "material": "Bạn chọn giấy Fort 100gsm hay Fort 120gsm?"
    },
    "slotAliases": {
      "size": {
        "12x22": [
          "12x22",
          "12 x 22"
        ],
        "25x35": [
          "25x35",
          "25 x 35"
        ]
      },
      "material": {
        "fort100": [
          "fort100",
          "fort 100",
          "fort 100gsm"
        ],
        "fort120": [
          "fort120",
          "fort 120",
          "fort 120gsm"
        ]
      }
    },
    "rawSourceFlags": {
      "quantityKey": "cai",
      "vatExcluded": true,
      "vatRatePercent": 10,
      "designIncluded": true,
      "glueUnknown": true,
      "windowUnknown": true,
      "unsupportedSize": "18x25",
      "missingConditions": [
        "keo/dán",
        "cửa sổ nếu cần"
      ]
    },
    "priceFacts": [
      {
        "id": "vp-envelope-fort100-12x22-1000",
        "lookupQuery": "Xem dòng bảng giá bao thư Vĩnh Phát 12x22 cm fort100 1000 cái",
        "quantity": 1000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 1300,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK một mặt; bế",
          "Giá theo cái; chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Keo/dán và cửa sổ chưa được xác minh",
          "Không có dòng 18 × 25 cm trong bảng đã kiểm tra",
          "12 × 22 cm",
          "Giấy Fort 100gsm",
          "Số lượng 1000 cái"
        ],
        "specs": {
          "size": "12x22",
          "dimensionsUnit": "cm",
          "material": "fort100",
          "sides": 1,
          "printing": "offset-cmyk",
          "finishing": "diecut"
        },
        "sourceNote": "Giá công bố theo cái cho đúng mốc số lượng; không tự tính tổng. Chưa gồm VAT 10%; keo/dán và cửa sổ cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "glueUnknown": true,
          "windowUnknown": true,
          "unsupportedSize": "18x25",
          "missingConditions": [
            "keo/dán",
            "cửa sổ nếu cần"
          ]
        }
      },
      {
        "id": "vp-envelope-fort100-25x35-1000",
        "lookupQuery": "Xem dòng bảng giá bao thư Vĩnh Phát 25x35 cm fort100 1000 cái",
        "quantity": 1000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 1900,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK một mặt; bế",
          "Giá theo cái; chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Keo/dán và cửa sổ chưa được xác minh",
          "Không có dòng 18 × 25 cm trong bảng đã kiểm tra",
          "25 × 35 cm",
          "Giấy Fort 100gsm",
          "Số lượng 1000 cái"
        ],
        "specs": {
          "size": "25x35",
          "dimensionsUnit": "cm",
          "material": "fort100",
          "sides": 1,
          "printing": "offset-cmyk",
          "finishing": "diecut"
        },
        "sourceNote": "Giá công bố theo cái cho đúng mốc số lượng; không tự tính tổng. Chưa gồm VAT 10%; keo/dán và cửa sổ cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "glueUnknown": true,
          "windowUnknown": true,
          "unsupportedSize": "18x25",
          "missingConditions": [
            "keo/dán",
            "cửa sổ nếu cần"
          ]
        }
      },
      {
        "id": "vp-envelope-fort100-12x22-2000",
        "lookupQuery": "Xem dòng bảng giá bao thư Vĩnh Phát 12x22 cm fort100 2000 cái",
        "quantity": 2000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 1200,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK một mặt; bế",
          "Giá theo cái; chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Keo/dán và cửa sổ chưa được xác minh",
          "Không có dòng 18 × 25 cm trong bảng đã kiểm tra",
          "12 × 22 cm",
          "Giấy Fort 100gsm",
          "Số lượng 2000 cái"
        ],
        "specs": {
          "size": "12x22",
          "dimensionsUnit": "cm",
          "material": "fort100",
          "sides": 1,
          "printing": "offset-cmyk",
          "finishing": "diecut"
        },
        "sourceNote": "Giá công bố theo cái cho đúng mốc số lượng; không tự tính tổng. Chưa gồm VAT 10%; keo/dán và cửa sổ cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "glueUnknown": true,
          "windowUnknown": true,
          "unsupportedSize": "18x25",
          "missingConditions": [
            "keo/dán",
            "cửa sổ nếu cần"
          ]
        }
      },
      {
        "id": "vp-envelope-fort100-25x35-2000",
        "lookupQuery": "Xem dòng bảng giá bao thư Vĩnh Phát 25x35 cm fort100 2000 cái",
        "quantity": 2000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 1700,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK một mặt; bế",
          "Giá theo cái; chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Keo/dán và cửa sổ chưa được xác minh",
          "Không có dòng 18 × 25 cm trong bảng đã kiểm tra",
          "25 × 35 cm",
          "Giấy Fort 100gsm",
          "Số lượng 2000 cái"
        ],
        "specs": {
          "size": "25x35",
          "dimensionsUnit": "cm",
          "material": "fort100",
          "sides": 1,
          "printing": "offset-cmyk",
          "finishing": "diecut"
        },
        "sourceNote": "Giá công bố theo cái cho đúng mốc số lượng; không tự tính tổng. Chưa gồm VAT 10%; keo/dán và cửa sổ cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "glueUnknown": true,
          "windowUnknown": true,
          "unsupportedSize": "18x25",
          "missingConditions": [
            "keo/dán",
            "cửa sổ nếu cần"
          ]
        }
      },
      {
        "id": "vp-envelope-fort100-12x22-5000",
        "lookupQuery": "Xem dòng bảng giá bao thư Vĩnh Phát 12x22 cm fort100 5000 cái",
        "quantity": 5000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 700,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK một mặt; bế",
          "Giá theo cái; chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Keo/dán và cửa sổ chưa được xác minh",
          "Không có dòng 18 × 25 cm trong bảng đã kiểm tra",
          "12 × 22 cm",
          "Giấy Fort 100gsm",
          "Số lượng 5000 cái"
        ],
        "specs": {
          "size": "12x22",
          "dimensionsUnit": "cm",
          "material": "fort100",
          "sides": 1,
          "printing": "offset-cmyk",
          "finishing": "diecut"
        },
        "sourceNote": "Giá công bố theo cái cho đúng mốc số lượng; không tự tính tổng. Chưa gồm VAT 10%; keo/dán và cửa sổ cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "glueUnknown": true,
          "windowUnknown": true,
          "unsupportedSize": "18x25",
          "missingConditions": [
            "keo/dán",
            "cửa sổ nếu cần"
          ]
        }
      },
      {
        "id": "vp-envelope-fort100-25x35-5000",
        "lookupQuery": "Xem dòng bảng giá bao thư Vĩnh Phát 25x35 cm fort100 5000 cái",
        "quantity": 5000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 1450,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK một mặt; bế",
          "Giá theo cái; chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Keo/dán và cửa sổ chưa được xác minh",
          "Không có dòng 18 × 25 cm trong bảng đã kiểm tra",
          "25 × 35 cm",
          "Giấy Fort 100gsm",
          "Số lượng 5000 cái"
        ],
        "specs": {
          "size": "25x35",
          "dimensionsUnit": "cm",
          "material": "fort100",
          "sides": 1,
          "printing": "offset-cmyk",
          "finishing": "diecut"
        },
        "sourceNote": "Giá công bố theo cái cho đúng mốc số lượng; không tự tính tổng. Chưa gồm VAT 10%; keo/dán và cửa sổ cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "glueUnknown": true,
          "windowUnknown": true,
          "unsupportedSize": "18x25",
          "missingConditions": [
            "keo/dán",
            "cửa sổ nếu cần"
          ]
        }
      },
      {
        "id": "vp-envelope-fort120-12x22-1000",
        "lookupQuery": "Xem dòng bảng giá bao thư Vĩnh Phát 12x22 cm fort120 1000 cái",
        "quantity": 1000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 1350,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK một mặt; bế",
          "Giá theo cái; chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Keo/dán và cửa sổ chưa được xác minh",
          "Không có dòng 18 × 25 cm trong bảng đã kiểm tra",
          "12 × 22 cm",
          "Giấy Fort 120gsm",
          "Số lượng 1000 cái"
        ],
        "specs": {
          "size": "12x22",
          "dimensionsUnit": "cm",
          "material": "fort120",
          "sides": 1,
          "printing": "offset-cmyk",
          "finishing": "diecut"
        },
        "sourceNote": "Giá công bố theo cái cho đúng mốc số lượng; không tự tính tổng. Chưa gồm VAT 10%; keo/dán và cửa sổ cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "glueUnknown": true,
          "windowUnknown": true,
          "unsupportedSize": "18x25",
          "missingConditions": [
            "keo/dán",
            "cửa sổ nếu cần"
          ]
        }
      },
      {
        "id": "vp-envelope-fort120-25x35-1000",
        "lookupQuery": "Xem dòng bảng giá bao thư Vĩnh Phát 25x35 cm fort120 1000 cái",
        "quantity": 1000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 2000,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK một mặt; bế",
          "Giá theo cái; chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Keo/dán và cửa sổ chưa được xác minh",
          "Không có dòng 18 × 25 cm trong bảng đã kiểm tra",
          "25 × 35 cm",
          "Giấy Fort 120gsm",
          "Số lượng 1000 cái"
        ],
        "specs": {
          "size": "25x35",
          "dimensionsUnit": "cm",
          "material": "fort120",
          "sides": 1,
          "printing": "offset-cmyk",
          "finishing": "diecut"
        },
        "sourceNote": "Giá công bố theo cái cho đúng mốc số lượng; không tự tính tổng. Chưa gồm VAT 10%; keo/dán và cửa sổ cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "glueUnknown": true,
          "windowUnknown": true,
          "unsupportedSize": "18x25",
          "missingConditions": [
            "keo/dán",
            "cửa sổ nếu cần"
          ]
        }
      },
      {
        "id": "vp-envelope-fort120-12x22-2000",
        "lookupQuery": "Xem dòng bảng giá bao thư Vĩnh Phát 12x22 cm fort120 2000 cái",
        "quantity": 2000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 1250,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK một mặt; bế",
          "Giá theo cái; chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Keo/dán và cửa sổ chưa được xác minh",
          "Không có dòng 18 × 25 cm trong bảng đã kiểm tra",
          "12 × 22 cm",
          "Giấy Fort 120gsm",
          "Số lượng 2000 cái"
        ],
        "specs": {
          "size": "12x22",
          "dimensionsUnit": "cm",
          "material": "fort120",
          "sides": 1,
          "printing": "offset-cmyk",
          "finishing": "diecut"
        },
        "sourceNote": "Giá công bố theo cái cho đúng mốc số lượng; không tự tính tổng. Chưa gồm VAT 10%; keo/dán và cửa sổ cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "glueUnknown": true,
          "windowUnknown": true,
          "unsupportedSize": "18x25",
          "missingConditions": [
            "keo/dán",
            "cửa sổ nếu cần"
          ]
        }
      },
      {
        "id": "vp-envelope-fort120-25x35-2000",
        "lookupQuery": "Xem dòng bảng giá bao thư Vĩnh Phát 25x35 cm fort120 2000 cái",
        "quantity": 2000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 1750,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK một mặt; bế",
          "Giá theo cái; chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Keo/dán và cửa sổ chưa được xác minh",
          "Không có dòng 18 × 25 cm trong bảng đã kiểm tra",
          "25 × 35 cm",
          "Giấy Fort 120gsm",
          "Số lượng 2000 cái"
        ],
        "specs": {
          "size": "25x35",
          "dimensionsUnit": "cm",
          "material": "fort120",
          "sides": 1,
          "printing": "offset-cmyk",
          "finishing": "diecut"
        },
        "sourceNote": "Giá công bố theo cái cho đúng mốc số lượng; không tự tính tổng. Chưa gồm VAT 10%; keo/dán và cửa sổ cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "glueUnknown": true,
          "windowUnknown": true,
          "unsupportedSize": "18x25",
          "missingConditions": [
            "keo/dán",
            "cửa sổ nếu cần"
          ]
        }
      },
      {
        "id": "vp-envelope-fort120-12x22-5000",
        "lookupQuery": "Xem dòng bảng giá bao thư Vĩnh Phát 12x22 cm fort120 5000 cái",
        "quantity": 5000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 750,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK một mặt; bế",
          "Giá theo cái; chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Keo/dán và cửa sổ chưa được xác minh",
          "Không có dòng 18 × 25 cm trong bảng đã kiểm tra",
          "12 × 22 cm",
          "Giấy Fort 120gsm",
          "Số lượng 5000 cái"
        ],
        "specs": {
          "size": "12x22",
          "dimensionsUnit": "cm",
          "material": "fort120",
          "sides": 1,
          "printing": "offset-cmyk",
          "finishing": "diecut"
        },
        "sourceNote": "Giá công bố theo cái cho đúng mốc số lượng; không tự tính tổng. Chưa gồm VAT 10%; keo/dán và cửa sổ cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "glueUnknown": true,
          "windowUnknown": true,
          "unsupportedSize": "18x25",
          "missingConditions": [
            "keo/dán",
            "cửa sổ nếu cần"
          ]
        }
      },
      {
        "id": "vp-envelope-fort120-25x35-5000",
        "lookupQuery": "Xem dòng bảng giá bao thư Vĩnh Phát 25x35 cm fort120 5000 cái",
        "quantity": 5000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 1500,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In offset CMYK một mặt; bế",
          "Giá theo cái; chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Keo/dán và cửa sổ chưa được xác minh",
          "Không có dòng 18 × 25 cm trong bảng đã kiểm tra",
          "25 × 35 cm",
          "Giấy Fort 120gsm",
          "Số lượng 5000 cái"
        ],
        "specs": {
          "size": "25x35",
          "dimensionsUnit": "cm",
          "material": "fort120",
          "sides": 1,
          "printing": "offset-cmyk",
          "finishing": "diecut"
        },
        "sourceNote": "Giá công bố theo cái cho đúng mốc số lượng; không tự tính tổng. Chưa gồm VAT 10%; keo/dán và cửa sổ cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-bao-thu-bi-thu-phong-bi-gia-re-2/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "glueUnknown": true,
          "windowUnknown": true,
          "unsupportedSize": "18x25",
          "missingConditions": [
            "keo/dán",
            "cửa sổ nếu cần"
          ]
        }
      }
    ]
  },
  {
    "id": "receipt-vp",
    "name": "Phiếu thu Vĩnh Phát",
    "aliases": [
      "phiếu thu Vĩnh Phát",
      "biểu mẫu Vĩnh Phát",
      "phiếu carbonless Vĩnh Phát"
    ],
    "variant": "Phiếu thu Vĩnh Phát",
    "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
    "displayPriceVnd": 0,
    "quantity": null,
    "unit": null,
    "specifications": [
      "In một màu: đen, đỏ hoặc xanh dương; một mặt",
      "Cấn răng cưa và đóng cuốn",
      "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
      "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ"
    ],
    "quotationStatus": "reference_only_requires_confirmation",
    "missingConditions": [
      "VAT áp dụng",
      "số nhảy nếu cần"
    ],
    "sourceEvidence": "Bảng công khai Vĩnh Phát đã được kiểm tra trong khoảng 04:46–04:50 UTC ngày 12/10/2026; mỗi dòng giữ nguyên điều kiện và cơ sở số tiền.",
    "sourceContext": "Phiếu thu Vĩnh Phát — nguồn Vĩnh Phát",
    "verifiedAtUtc": "2026-10-12T04:50:00Z",
    "provider": "vinh-phat",
    "verificationWindowUtc": {
      "start": "2026-10-12T04:46:00Z",
      "end": "2026-10-12T04:50:00Z"
    },
    "sessionFields": [
      "quantity",
      "size",
      "material",
      "layers"
    ],
    "quantityKey": "cuon",
    "sessionQuestions": {
      "quantity": "Bạn cần mốc số lượng cuốn nào trong bảng của loại giấy/số liên đã chọn?",
      "size": "Bạn cần A4 hay A5?",
      "material": "Bạn chọn Fort 80gsm một liên hay giấy carbonless?",
      "layers": "Bạn chọn một, hai hay ba liên? Loại giấy phải khớp số liên của dòng nguồn."
    },
    "slotAliases": {
      "size": {
        "a4": [
          "a4"
        ],
        "a5": [
          "a5"
        ]
      },
      "material": {
        "fort80": [
          "fort80",
          "fort 80",
          "fort 80gsm"
        ],
        "carbonless": [
          "carbonless",
          "giấy carbonless"
        ]
      },
      "layers": {
        "1": [
          "1 liên",
          "một liên"
        ],
        "2": [
          "2 liên",
          "hai liên"
        ],
        "3": [
          "3 liên",
          "ba liên"
        ]
      }
    },
    "rawSourceFlags": {
      "quantityKey": "cuon",
      "vatRateUnknown": true,
      "publishedTotalsVerified": true,
      "numberingUnknown": true,
      "missingConditions": [
        "VAT áp dụng",
        "số nhảy nếu cần"
      ]
    },
    "priceFacts": [
      {
        "id": "vp-receipt-fort80-1-a5-10",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát Fort 80gsm 1 liên A5 10 cuốn",
        "quantity": 10,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 35000,
        "sourceTotalVnd": 350000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy Fort 80gsm 1 liên",
          "A5",
          "100 tờ vật lý/cuốn",
          "Số lượng 10 cuốn"
        ],
        "specs": {
          "size": "a5",
          "material": "fort80",
          "layers": 1,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 350000 ₫ cho mốc 10 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-fort80-1-a5-20",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát Fort 80gsm 1 liên A5 20 cuốn",
        "quantity": 20,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 33000,
        "sourceTotalVnd": 660000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy Fort 80gsm 1 liên",
          "A5",
          "100 tờ vật lý/cuốn",
          "Số lượng 20 cuốn"
        ],
        "specs": {
          "size": "a5",
          "material": "fort80",
          "layers": 1,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 660000 ₫ cho mốc 20 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-fort80-1-a5-30",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát Fort 80gsm 1 liên A5 30 cuốn",
        "quantity": 30,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 31000,
        "sourceTotalVnd": 930000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy Fort 80gsm 1 liên",
          "A5",
          "100 tờ vật lý/cuốn",
          "Số lượng 30 cuốn"
        ],
        "specs": {
          "size": "a5",
          "material": "fort80",
          "layers": 1,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 930000 ₫ cho mốc 30 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-fort80-1-a5-50",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát Fort 80gsm 1 liên A5 50 cuốn",
        "quantity": 50,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 27000,
        "sourceTotalVnd": 1350000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy Fort 80gsm 1 liên",
          "A5",
          "100 tờ vật lý/cuốn",
          "Số lượng 50 cuốn"
        ],
        "specs": {
          "size": "a5",
          "material": "fort80",
          "layers": 1,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 1350000 ₫ cho mốc 50 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-fort80-1-a5-100",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát Fort 80gsm 1 liên A5 100 cuốn",
        "quantity": 100,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 23000,
        "sourceTotalVnd": 2300000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy Fort 80gsm 1 liên",
          "A5",
          "100 tờ vật lý/cuốn",
          "Số lượng 100 cuốn"
        ],
        "specs": {
          "size": "a5",
          "material": "fort80",
          "layers": 1,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 2300000 ₫ cho mốc 100 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-fort80-1-a4-10",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát Fort 80gsm 1 liên A4 10 cuốn",
        "quantity": 10,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 55000,
        "sourceTotalVnd": 550000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy Fort 80gsm 1 liên",
          "A4",
          "100 tờ vật lý/cuốn",
          "Số lượng 10 cuốn"
        ],
        "specs": {
          "size": "a4",
          "material": "fort80",
          "layers": 1,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 550000 ₫ cho mốc 10 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-fort80-1-a4-20",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát Fort 80gsm 1 liên A4 20 cuốn",
        "quantity": 20,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 53000,
        "sourceTotalVnd": 1060000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy Fort 80gsm 1 liên",
          "A4",
          "100 tờ vật lý/cuốn",
          "Số lượng 20 cuốn"
        ],
        "specs": {
          "size": "a4",
          "material": "fort80",
          "layers": 1,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 1060000 ₫ cho mốc 20 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-fort80-1-a4-30",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát Fort 80gsm 1 liên A4 30 cuốn",
        "quantity": 30,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 51000,
        "sourceTotalVnd": 1530000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy Fort 80gsm 1 liên",
          "A4",
          "100 tờ vật lý/cuốn",
          "Số lượng 30 cuốn"
        ],
        "specs": {
          "size": "a4",
          "material": "fort80",
          "layers": 1,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 1530000 ₫ cho mốc 30 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-fort80-1-a4-50",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát Fort 80gsm 1 liên A4 50 cuốn",
        "quantity": 50,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 47000,
        "sourceTotalVnd": 2350000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy Fort 80gsm 1 liên",
          "A4",
          "100 tờ vật lý/cuốn",
          "Số lượng 50 cuốn"
        ],
        "specs": {
          "size": "a4",
          "material": "fort80",
          "layers": 1,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 2350000 ₫ cho mốc 50 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-fort80-1-a4-100",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát Fort 80gsm 1 liên A4 100 cuốn",
        "quantity": 100,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 44000,
        "sourceTotalVnd": 4400000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy Fort 80gsm 1 liên",
          "A4",
          "100 tờ vật lý/cuốn",
          "Số lượng 100 cuốn"
        ],
        "specs": {
          "size": "a4",
          "material": "fort80",
          "layers": 1,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 4400000 ₫ cho mốc 100 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-carbonless-2-a5-10",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 2 liên A5 10 cuốn",
        "quantity": 10,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 39000,
        "sourceTotalVnd": 390000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 2 liên",
          "A5",
          "100 tờ vật lý/cuốn, 50 bộ/cuốn",
          "Số lượng 10 cuốn"
        ],
        "specs": {
          "size": "a5",
          "material": "carbonless",
          "layers": 2,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 390000 ₫ cho mốc 10 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50,
          "setsUnknown": false
        }
      },
      {
        "id": "vp-receipt-carbonless-2-a5-20",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 2 liên A5 20 cuốn",
        "quantity": 20,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 37500,
        "sourceTotalVnd": 750000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 2 liên",
          "A5",
          "100 tờ vật lý/cuốn, 50 bộ/cuốn",
          "Số lượng 20 cuốn"
        ],
        "specs": {
          "size": "a5",
          "material": "carbonless",
          "layers": 2,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 750000 ₫ cho mốc 20 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50,
          "setsUnknown": false
        }
      },
      {
        "id": "vp-receipt-carbonless-2-a5-30",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 2 liên A5 30 cuốn",
        "quantity": 30,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 36000,
        "sourceTotalVnd": 1080000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 2 liên",
          "A5",
          "100 tờ vật lý/cuốn, 50 bộ/cuốn",
          "Số lượng 30 cuốn"
        ],
        "specs": {
          "size": "a5",
          "material": "carbonless",
          "layers": 2,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 1080000 ₫ cho mốc 30 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50,
          "setsUnknown": false
        }
      },
      {
        "id": "vp-receipt-carbonless-2-a5-50",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 2 liên A5 50 cuốn",
        "quantity": 50,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 33000,
        "sourceTotalVnd": 1650000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 2 liên",
          "A5",
          "100 tờ vật lý/cuốn, 50 bộ/cuốn",
          "Số lượng 50 cuốn"
        ],
        "specs": {
          "size": "a5",
          "material": "carbonless",
          "layers": 2,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 1650000 ₫ cho mốc 50 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50,
          "setsUnknown": false
        }
      },
      {
        "id": "vp-receipt-carbonless-2-a5-100",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 2 liên A5 100 cuốn",
        "quantity": 100,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 28000,
        "sourceTotalVnd": 2800000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 2 liên",
          "A5",
          "100 tờ vật lý/cuốn, 50 bộ/cuốn",
          "Số lượng 100 cuốn"
        ],
        "specs": {
          "size": "a5",
          "material": "carbonless",
          "layers": 2,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 2800000 ₫ cho mốc 100 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50,
          "setsUnknown": false
        }
      },
      {
        "id": "vp-receipt-carbonless-2-a4-10",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 2 liên A4 10 cuốn",
        "quantity": 10,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 57000,
        "sourceTotalVnd": 570000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 2 liên",
          "A4",
          "100 tờ vật lý/cuốn, 50 bộ/cuốn",
          "Số lượng 10 cuốn"
        ],
        "specs": {
          "size": "a4",
          "material": "carbonless",
          "layers": 2,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 570000 ₫ cho mốc 10 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50,
          "setsUnknown": false
        }
      },
      {
        "id": "vp-receipt-carbonless-2-a4-20",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 2 liên A4 20 cuốn",
        "quantity": 20,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 56000,
        "sourceTotalVnd": 1120000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 2 liên",
          "A4",
          "100 tờ vật lý/cuốn, 50 bộ/cuốn",
          "Số lượng 20 cuốn"
        ],
        "specs": {
          "size": "a4",
          "material": "carbonless",
          "layers": 2,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 1120000 ₫ cho mốc 20 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50,
          "setsUnknown": false
        }
      },
      {
        "id": "vp-receipt-carbonless-2-a4-30",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 2 liên A4 30 cuốn",
        "quantity": 30,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 55000,
        "sourceTotalVnd": 1650000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 2 liên",
          "A4",
          "100 tờ vật lý/cuốn, 50 bộ/cuốn",
          "Số lượng 30 cuốn"
        ],
        "specs": {
          "size": "a4",
          "material": "carbonless",
          "layers": 2,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 1650000 ₫ cho mốc 30 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50,
          "setsUnknown": false
        }
      },
      {
        "id": "vp-receipt-carbonless-2-a4-50",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 2 liên A4 50 cuốn",
        "quantity": 50,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 53000,
        "sourceTotalVnd": 2650000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 2 liên",
          "A4",
          "100 tờ vật lý/cuốn, 50 bộ/cuốn",
          "Số lượng 50 cuốn"
        ],
        "specs": {
          "size": "a4",
          "material": "carbonless",
          "layers": 2,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 2650000 ₫ cho mốc 50 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50,
          "setsUnknown": false
        }
      },
      {
        "id": "vp-receipt-carbonless-2-a4-100",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 2 liên A4 100 cuốn",
        "quantity": 100,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 50000,
        "sourceTotalVnd": 5000000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 2 liên",
          "A4",
          "100 tờ vật lý/cuốn, 50 bộ/cuốn",
          "Số lượng 100 cuốn"
        ],
        "specs": {
          "size": "a4",
          "material": "carbonless",
          "layers": 2,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 5000000 ₫ cho mốc 100 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 100,
          "setsPerBook": 50,
          "setsUnknown": false
        }
      },
      {
        "id": "vp-receipt-carbonless-3-a5-20",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 3 liên A5 20 cuốn",
        "quantity": 20,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 48000,
        "sourceTotalVnd": 960000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 3 liên",
          "A5",
          "150 tờ vật lý/cuốn",
          "Số lượng 20 cuốn",
          "Nguồn không xác nhận số bộ/cuốn cho loại ba liên"
        ],
        "specs": {
          "size": "a5",
          "material": "carbonless",
          "layers": 3,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 150
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 960000 ₫ cho mốc 20 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 150,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-carbonless-3-a5-30",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 3 liên A5 30 cuốn",
        "quantity": 30,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 46000,
        "sourceTotalVnd": 1380000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 3 liên",
          "A5",
          "150 tờ vật lý/cuốn",
          "Số lượng 30 cuốn",
          "Nguồn không xác nhận số bộ/cuốn cho loại ba liên"
        ],
        "specs": {
          "size": "a5",
          "material": "carbonless",
          "layers": 3,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 150
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 1380000 ₫ cho mốc 30 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 150,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-carbonless-3-a5-50",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 3 liên A5 50 cuốn",
        "quantity": 50,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 42000,
        "sourceTotalVnd": 2100000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 3 liên",
          "A5",
          "150 tờ vật lý/cuốn",
          "Số lượng 50 cuốn",
          "Nguồn không xác nhận số bộ/cuốn cho loại ba liên"
        ],
        "specs": {
          "size": "a5",
          "material": "carbonless",
          "layers": 3,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 150
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 2100000 ₫ cho mốc 50 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 150,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-carbonless-3-a5-100",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 3 liên A5 100 cuốn",
        "quantity": 100,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 37000,
        "sourceTotalVnd": 3700000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 3 liên",
          "A5",
          "150 tờ vật lý/cuốn",
          "Số lượng 100 cuốn",
          "Nguồn không xác nhận số bộ/cuốn cho loại ba liên"
        ],
        "specs": {
          "size": "a5",
          "material": "carbonless",
          "layers": 3,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 150
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 3700000 ₫ cho mốc 100 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 150,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-carbonless-3-a4-20",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 3 liên A4 20 cuốn",
        "quantity": 20,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 68000,
        "sourceTotalVnd": 1360000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 3 liên",
          "A4",
          "150 tờ vật lý/cuốn",
          "Số lượng 20 cuốn",
          "Nguồn không xác nhận số bộ/cuốn cho loại ba liên"
        ],
        "specs": {
          "size": "a4",
          "material": "carbonless",
          "layers": 3,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 150
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 1360000 ₫ cho mốc 20 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 150,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-carbonless-3-a4-30",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 3 liên A4 30 cuốn",
        "quantity": 30,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 67000,
        "sourceTotalVnd": 2010000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 3 liên",
          "A4",
          "150 tờ vật lý/cuốn",
          "Số lượng 30 cuốn",
          "Nguồn không xác nhận số bộ/cuốn cho loại ba liên"
        ],
        "specs": {
          "size": "a4",
          "material": "carbonless",
          "layers": 3,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 150
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 2010000 ₫ cho mốc 30 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 150,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-carbonless-3-a4-50",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 3 liên A4 50 cuốn",
        "quantity": 50,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 65000,
        "sourceTotalVnd": 3250000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 3 liên",
          "A4",
          "150 tờ vật lý/cuốn",
          "Số lượng 50 cuốn",
          "Nguồn không xác nhận số bộ/cuốn cho loại ba liên"
        ],
        "specs": {
          "size": "a4",
          "material": "carbonless",
          "layers": 3,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 150
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 3250000 ₫ cho mốc 50 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 150,
          "setsPerBook": null,
          "setsUnknown": true
        }
      },
      {
        "id": "vp-receipt-carbonless-3-a4-100",
        "lookupQuery": "Xem dòng bảng giá phiếu thu Vĩnh Phát carbonless 3 liên A4 100 cuốn",
        "quantity": 100,
        "quantityUnit": "cuốn",
        "unit": "cuốn",
        "priceVnd": 62000,
        "sourceTotalVnd": 6200000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "In một màu: đen, đỏ hoặc xanh dương; một mặt",
          "Cấn răng cưa và đóng cuốn",
          "Đơn giá theo cuốn; các tổng tương ứng được nguồn công bố và đã xác minh",
          "VAT chưa được xác minh; không tính thuế hoặc quy đổi giá mỗi tờ/bộ",
          "Giấy carbonless 3 liên",
          "A4",
          "150 tờ vật lý/cuốn",
          "Số lượng 100 cuốn",
          "Nguồn không xác nhận số bộ/cuốn cho loại ba liên"
        ],
        "specs": {
          "size": "a4",
          "material": "carbonless",
          "layers": 3,
          "sides": 1,
          "printing": "one-color",
          "finishing": "perforated-bound",
          "physicalSheetsPerBook": 150
        },
        "sourceNote": "Đơn giá theo cuốn và tổng 6200000 ₫ cho mốc 100 cuốn đều đã được nguồn công bố; tổng là dữ liệu lưu sẵn, không phải phép tính của chatbot. Không quy đổi giá theo tờ/bộ; VAT và số nhảy cần xác nhận.",
        "sourceUrl": "https://invinhphat.com/san-pham/phieu-thu-cac-loai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cuon",
          "vatRateUnknown": true,
          "publishedTotalsVerified": true,
          "numberingUnknown": true,
          "missingConditions": [
            "VAT áp dụng",
            "số nhảy nếu cần"
          ],
          "publishedTotalVerified": true,
          "physicalSheetsPerBook": 150,
          "setsPerBook": null,
          "setsUnknown": true
        }
      }
    ]
  },
  {
    "id": "paper-bag-vp",
    "name": "Túi giấy đứng Vĩnh Phát",
    "aliases": [
      "túi giấy đứng Vĩnh Phát",
      "túi giấy C250 Vĩnh Phát",
      "túi giấy Vĩnh Phát"
    ],
    "variant": "Túi giấy đứng Vĩnh Phát",
    "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
    "displayPriceVnd": 0,
    "quantity": null,
    "unit": null,
    "specifications": [
      "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
      "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
      "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
      "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo"
    ],
    "quotationStatus": "reference_only_requires_confirmation",
    "missingConditions": [
      "thứ tự trục kích thước",
      "quai/phụ kiện nếu cần"
    ],
    "sourceEvidence": "Bảng công khai Vĩnh Phát đã được kiểm tra trong khoảng 04:46–04:50 UTC ngày 12/10/2026; mỗi dòng giữ nguyên điều kiện và cơ sở số tiền.",
    "sourceContext": "Túi giấy đứng Vĩnh Phát — nguồn Vĩnh Phát",
    "verifiedAtUtc": "2026-10-12T04:50:00Z",
    "provider": "vinh-phat",
    "verificationWindowUtc": {
      "start": "2026-10-12T04:46:00Z",
      "end": "2026-10-12T04:50:00Z"
    },
    "sessionFields": [
      "quantity",
      "size"
    ],
    "quantityKey": "cai",
    "sessionQuestions": {
      "quantity": "Bạn cần 300, 500, 1.000 hay 2.000 cái?",
      "size": "Bạn chọn bộ kích thước 20 × 14 × 6, 25 × 18 × 8, 31 × 21 × 10 hay 37 × 27 × 10 cm như nguồn?"
    },
    "slotAliases": {
      "size": {
        "20x14x6": [
          "20x14x6",
          "20 x 14 x 6"
        ],
        "25x18x8": [
          "25x18x8",
          "25 x 18 x 8"
        ],
        "31x21x10": [
          "31x21x10",
          "31 x 21 x 10"
        ],
        "37x27x10": [
          "37x27x10",
          "37 x 27 x 10"
        ]
      }
    },
    "rawSourceFlags": {
      "quantityKey": "cai",
      "vatExcluded": true,
      "vatRatePercent": 10,
      "designExcluded": true,
      "dimensionAxesUnknown": true,
      "accessoriesUnknown": true,
      "missingConditions": [
        "thứ tự trục kích thước",
        "quai/phụ kiện nếu cần"
      ]
    },
    "priceFacts": [
      {
        "id": "vp-bag-20x14x6-300",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 20x14x6 cm 300 cái",
        "quantity": 300,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 9500,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 20 × 14 × 6 cm",
          "Số lượng 300 cái"
        ],
        "specs": {
          "size": "20x14x6",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-25x18x8-300",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 25x18x8 cm 300 cái",
        "quantity": 300,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 11500,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 25 × 18 × 8 cm",
          "Số lượng 300 cái"
        ],
        "specs": {
          "size": "25x18x8",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-31x21x10-300",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 31x21x10 cm 300 cái",
        "quantity": 300,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 12500,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 31 × 21 × 10 cm",
          "Số lượng 300 cái"
        ],
        "specs": {
          "size": "31x21x10",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-37x27x10-300",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 37x27x10 cm 300 cái",
        "quantity": 300,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 15000,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 37 × 27 × 10 cm",
          "Số lượng 300 cái"
        ],
        "specs": {
          "size": "37x27x10",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-20x14x6-500",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 20x14x6 cm 500 cái",
        "quantity": 500,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 7500,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 20 × 14 × 6 cm",
          "Số lượng 500 cái"
        ],
        "specs": {
          "size": "20x14x6",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-25x18x8-500",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 25x18x8 cm 500 cái",
        "quantity": 500,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 8500,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 25 × 18 × 8 cm",
          "Số lượng 500 cái"
        ],
        "specs": {
          "size": "25x18x8",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-31x21x10-500",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 31x21x10 cm 500 cái",
        "quantity": 500,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 9800,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 31 × 21 × 10 cm",
          "Số lượng 500 cái"
        ],
        "specs": {
          "size": "31x21x10",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-37x27x10-500",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 37x27x10 cm 500 cái",
        "quantity": 500,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 12000,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 37 × 27 × 10 cm",
          "Số lượng 500 cái"
        ],
        "specs": {
          "size": "37x27x10",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-20x14x6-1000",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 20x14x6 cm 1000 cái",
        "quantity": 1000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 5500,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 20 × 14 × 6 cm",
          "Số lượng 1000 cái"
        ],
        "specs": {
          "size": "20x14x6",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-25x18x8-1000",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 25x18x8 cm 1000 cái",
        "quantity": 1000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 6500,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 25 × 18 × 8 cm",
          "Số lượng 1000 cái"
        ],
        "specs": {
          "size": "25x18x8",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-31x21x10-1000",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 31x21x10 cm 1000 cái",
        "quantity": 1000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 7500,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 31 × 21 × 10 cm",
          "Số lượng 1000 cái"
        ],
        "specs": {
          "size": "31x21x10",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-37x27x10-1000",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 37x27x10 cm 1000 cái",
        "quantity": 1000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 9000,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 37 × 27 × 10 cm",
          "Số lượng 1000 cái"
        ],
        "specs": {
          "size": "37x27x10",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-20x14x6-2000",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 20x14x6 cm 2000 cái",
        "quantity": 2000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 4500,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 20 × 14 × 6 cm",
          "Số lượng 2000 cái"
        ],
        "specs": {
          "size": "20x14x6",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-25x18x8-2000",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 25x18x8 cm 2000 cái",
        "quantity": 2000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 5500,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 25 × 18 × 8 cm",
          "Số lượng 2000 cái"
        ],
        "specs": {
          "size": "25x18x8",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-31x21x10-2000",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 31x21x10 cm 2000 cái",
        "quantity": 2000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 5800,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 31 × 21 × 10 cm",
          "Số lượng 2000 cái"
        ],
        "specs": {
          "size": "31x21x10",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      },
      {
        "id": "vp-bag-37x27x10-2000",
        "lookupQuery": "Xem dòng bảng giá túi giấy đứng Vĩnh Phát 37x27x10 cm 2000 cái",
        "quantity": 2000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 7500,
        "sourceTotalVnd": null,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Túi đứng, giấy Couche 250gsm; in một mặt; cán màng",
          "Đơn giá theo cái; chưa gồm VAT 10% và thiết kế",
          "Nguồn chưa xác nhận thứ tự trục của ba kích thước; không tự gán dài/rộng/cao",
          "Không suy ra phụ kiện, quai túi hoặc chi phí kèm theo",
          "Bộ kích thước ghi tại nguồn: 37 × 27 × 10 cm",
          "Số lượng 2000 cái"
        ],
        "specs": {
          "size": "37x27x10",
          "dimensionsUnit": "cm",
          "material": "c250",
          "sides": 1,
          "variant": "vertical",
          "finishing": "film"
        },
        "sourceNote": "Giá theo cái cho đúng bộ kích thước và số lượng. Chưa gồm VAT 10% hoặc thiết kế; không tự tính tổng, gán trục kích thước hay giả định quai/phụ kiện.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tui-giay-gia-re/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designExcluded": true,
          "dimensionAxesUnknown": true,
          "accessoriesUnknown": true,
          "missingConditions": [
            "thứ tự trục kích thước",
            "quai/phụ kiện nếu cần"
          ]
        }
      }
    ]
  },
  {
    "id": "folder-vp",
    "name": "Folder kẹp file Vĩnh Phát — tham khảo",
    "aliases": [
      "folder kẹp file Vĩnh Phát",
      "folder Vĩnh Phát",
      "kẹp file Vĩnh Phát"
    ],
    "variant": "Folder kẹp file Vĩnh Phát — tham khảo",
    "sourceUrl": "https://invinhphat.com/san-pham/in-folder-kep-file/",
    "displayPriceVnd": 0,
    "quantity": null,
    "unit": null,
    "specifications": [
      "Dòng nguồn nêu túi 7 cm",
      "Giấy và kích thước tổng thể chưa được xác minh: chỉ tham khảo, cần tư vấn viên báo giá",
      "Giá chưa gồm VAT 10%",
      "Hai túi hoặc túi lớn hơn là quy cách khác; không áp dụng dòng này",
      "Nguồn /in-folder/ có thông tin xung đột và bị giữ khỏi báo giá"
    ],
    "quotationStatus": "reference_only_requires_confirmation",
    "missingConditions": [
      "giấy",
      "kích thước tổng thể",
      "số túi và chiều cao túi"
    ],
    "sourceEvidence": "Bảng công khai Vĩnh Phát đã được kiểm tra trong khoảng 04:46–04:50 UTC ngày 12/10/2026; mỗi dòng giữ nguyên điều kiện và cơ sở số tiền.",
    "sourceContext": "Folder kẹp file Vĩnh Phát — tham khảo — nguồn Vĩnh Phát",
    "verifiedAtUtc": "2026-10-12T04:50:00Z",
    "provider": "vinh-phat",
    "verificationWindowUtc": {
      "start": "2026-10-12T04:46:00Z",
      "end": "2026-10-12T04:50:00Z"
    },
    "sessionFields": [
      "quantity"
    ],
    "quantityKey": "cai",
    "sessionQuestions": {
      "quantity": "Bạn muốn xem mốc 500, 1.000 hay 2.000 cái? Giấy và khổ tổng thể còn cần tư vấn viên xác nhận."
    },
    "slotAliases": {},
    "rawSourceFlags": {
      "quantityKey": "cai",
      "referenceOnly": true,
      "paperUnknown": true,
      "overallSizeUnknown": true,
      "vatExcluded": true,
      "vatRatePercent": 10,
      "quarantinedConflictingSourcePath": "/in-folder/",
      "missingConditions": [
        "giấy",
        "kích thước tổng thể",
        "số túi và chiều cao túi"
      ]
    },
    "priceFacts": [
      {
        "id": "vp-folder-pocket7-500",
        "lookupQuery": "Xem dòng bảng giá folder kẹp file Vĩnh Phát túi 7 cm 500 cái",
        "quantity": 500,
        "quantityUnit": "cái",
        "unit": "giá trị bảng",
        "priceVnd": 8400,
        "sourceTotalVnd": 4200000,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Dòng nguồn nêu túi 7 cm",
          "Giấy và kích thước tổng thể chưa được xác minh: chỉ tham khảo, cần tư vấn viên báo giá",
          "Giá chưa gồm VAT 10%",
          "Hai túi hoặc túi lớn hơn là quy cách khác; không áp dụng dòng này",
          "Nguồn /in-folder/ có thông tin xung đột và bị giữ khỏi báo giá",
          "Mốc số lượng 500 cái",
          "Ô đơn giá ghi 8400 ₫ và tổng nguồn ghi 4200000 ₫"
        ],
        "specs": {
          "pocketHeightCm": 7
        },
        "sourceNote": "Chỉ tham khảo giá trị nguồn; chưa đủ giấy và kích thước tổng thể để báo giá cố định. Không chọn giá thấp hơn hoặc dùng nguồn /in-folder/ xung đột.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-folder-kep-file/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "referenceOnly": true,
          "paperUnknown": true,
          "overallSizeUnknown": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "quarantinedConflictingSourcePath": "/in-folder/",
          "missingConditions": [
            "giấy",
            "kích thước tổng thể",
            "số túi và chiều cao túi"
          ],
          "publishedUnitPriceVnd": 8400,
          "publishedTotalVnd": 4200000
        }
      },
      {
        "id": "vp-folder-pocket7-1000",
        "lookupQuery": "Xem dòng bảng giá folder kẹp file Vĩnh Phát túi 7 cm 1000 cái",
        "quantity": 1000,
        "quantityUnit": "cái",
        "unit": "giá trị bảng",
        "priceVnd": 5400,
        "sourceTotalVnd": 5400000,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Dòng nguồn nêu túi 7 cm",
          "Giấy và kích thước tổng thể chưa được xác minh: chỉ tham khảo, cần tư vấn viên báo giá",
          "Giá chưa gồm VAT 10%",
          "Hai túi hoặc túi lớn hơn là quy cách khác; không áp dụng dòng này",
          "Nguồn /in-folder/ có thông tin xung đột và bị giữ khỏi báo giá",
          "Mốc số lượng 1000 cái",
          "Ô đơn giá ghi 5400 ₫ và tổng nguồn ghi 5400000 ₫"
        ],
        "specs": {
          "pocketHeightCm": 7
        },
        "sourceNote": "Chỉ tham khảo giá trị nguồn; chưa đủ giấy và kích thước tổng thể để báo giá cố định. Không chọn giá thấp hơn hoặc dùng nguồn /in-folder/ xung đột.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-folder-kep-file/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "referenceOnly": true,
          "paperUnknown": true,
          "overallSizeUnknown": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "quarantinedConflictingSourcePath": "/in-folder/",
          "missingConditions": [
            "giấy",
            "kích thước tổng thể",
            "số túi và chiều cao túi"
          ],
          "publishedUnitPriceVnd": 5400,
          "publishedTotalVnd": 5400000
        }
      },
      {
        "id": "vp-folder-pocket7-2000",
        "lookupQuery": "Xem dòng bảng giá folder kẹp file Vĩnh Phát túi 7 cm 2000 cái",
        "quantity": 2000,
        "quantityUnit": "cái",
        "unit": "giá trị bảng",
        "priceVnd": 4600,
        "sourceTotalVnd": 9200000,
        "priceKind": "reference_display",
        "priceBasis": "reference",
        "provider": "vinh-phat",
        "conditions": [
          "Dòng nguồn nêu túi 7 cm",
          "Giấy và kích thước tổng thể chưa được xác minh: chỉ tham khảo, cần tư vấn viên báo giá",
          "Giá chưa gồm VAT 10%",
          "Hai túi hoặc túi lớn hơn là quy cách khác; không áp dụng dòng này",
          "Nguồn /in-folder/ có thông tin xung đột và bị giữ khỏi báo giá",
          "Mốc số lượng 2000 cái",
          "Ô đơn giá ghi 4600 ₫ và tổng nguồn ghi 9200000 ₫"
        ],
        "specs": {
          "pocketHeightCm": 7
        },
        "sourceNote": "Chỉ tham khảo giá trị nguồn; chưa đủ giấy và kích thước tổng thể để báo giá cố định. Không chọn giá thấp hơn hoặc dùng nguồn /in-folder/ xung đột.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-folder-kep-file/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "referenceOnly": true,
          "paperUnknown": true,
          "overallSizeUnknown": true,
          "vatExcluded": true,
          "vatRatePercent": 10,
          "quarantinedConflictingSourcePath": "/in-folder/",
          "missingConditions": [
            "giấy",
            "kích thước tổng thể",
            "số túi và chiều cao túi"
          ],
          "publishedUnitPriceVnd": 4600,
          "publishedTotalVnd": 9200000
        }
      }
    ]
  },
  {
    "id": "tag-vp",
    "name": "Tag treo Vĩnh Phát",
    "aliases": [
      "tag treo Vĩnh Phát",
      "thẻ bài Vĩnh Phát",
      "nhãn treo Vĩnh Phát"
    ],
    "variant": "Tag treo Vĩnh Phát",
    "sourceUrl": "https://invinhphat.com/san-pham/in-tag-treo-the-bai/",
    "displayPriceVnd": 0,
    "quantity": null,
    "unit": null,
    "specifications": [
      "Giấy Couche 300gsm; in offset nhiều màu hai mặt",
      "Hình chữ nhật hoặc vuông, có lỗ",
      "Nguồn chưa nhất quán giữa cán màng mờ và không cán màng; không tự chọn một phương án",
      "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
      "Bế hình khác là hạng mục riêng, không áp giá dòng chữ nhật/vuông"
    ],
    "quotationStatus": "reference_only_requires_confirmation",
    "missingConditions": [
      "cán màng mờ hay không cán màng"
    ],
    "sourceEvidence": "Bảng công khai Vĩnh Phát đã được kiểm tra trong khoảng 04:46–04:50 UTC ngày 12/10/2026; mỗi dòng giữ nguyên điều kiện và cơ sở số tiền.",
    "sourceContext": "Tag treo Vĩnh Phát — nguồn Vĩnh Phát",
    "verifiedAtUtc": "2026-10-12T04:50:00Z",
    "provider": "vinh-phat",
    "verificationWindowUtc": {
      "start": "2026-10-12T04:46:00Z",
      "end": "2026-10-12T04:50:00Z"
    },
    "sessionFields": [
      "quantity",
      "size"
    ],
    "quantityKey": "cai",
    "sessionQuestions": {
      "quantity": "Bạn cần mốc số lượng nào trong bảng đúng kích thước tag đã chọn?",
      "size": "Bạn chọn 50 × 30, 45 × 45, 90 × 27 hay 90 × 54 mm?"
    },
    "slotAliases": {
      "size": {
        "50x30": [
          "50x30",
          "50 x 30"
        ],
        "45x45": [
          "45x45",
          "45 x 45"
        ],
        "90x27": [
          "90x27",
          "90 x 27"
        ],
        "90x54": [
          "90x54",
          "90 x 54"
        ]
      }
    },
    "rawSourceFlags": {
      "quantityKey": "cai",
      "vatExcluded": true,
      "vatRatePercent": 10,
      "designIncluded": true,
      "laminationAmbiguous": true,
      "otherDieCutSeparate": true,
      "missingConditions": [
        "cán màng mờ hay không cán màng"
      ]
    },
    "priceFacts": [
      {
        "id": "vp-tag-50x30-1500",
        "lookupQuery": "Xem dòng bảng giá tag treo Vĩnh Phát 50x30 mm 1500 cái",
        "quantity": 1500,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 120,
        "sourceTotalVnd": 180000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Giấy Couche 300gsm; in offset nhiều màu hai mặt",
          "Hình chữ nhật hoặc vuông, có lỗ",
          "Nguồn chưa nhất quán giữa cán màng mờ và không cán màng; không tự chọn một phương án",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Bế hình khác là hạng mục riêng, không áp giá dòng chữ nhật/vuông",
          "50 × 30 mm",
          "Số lượng 1500 cái"
        ],
        "specs": {
          "size": "50x30",
          "dimensionsUnit": "mm",
          "material": "c300",
          "sides": 2,
          "printing": "offset-multicolor",
          "finishing": "rectangle-square-hole"
        },
        "sourceNote": "Đơn giá và tổng đều là số tiền công bố cho dòng nguồn. Cán màng mờ/không cán màng chưa nhất quán; yêu cầu xác định cán màng cần tư vấn viên xác nhận, không suy ra đã bao gồm. Chưa gồm VAT 10%; bế hình khác tính riêng.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tag-treo-the-bai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "laminationAmbiguous": true,
          "otherDieCutSeparate": true,
          "missingConditions": [
            "cán màng mờ hay không cán màng"
          ],
          "publishedTotalVerified": true
        }
      },
      {
        "id": "vp-tag-50x30-3000",
        "lookupQuery": "Xem dòng bảng giá tag treo Vĩnh Phát 50x30 mm 3000 cái",
        "quantity": 3000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 100,
        "sourceTotalVnd": 300000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Giấy Couche 300gsm; in offset nhiều màu hai mặt",
          "Hình chữ nhật hoặc vuông, có lỗ",
          "Nguồn chưa nhất quán giữa cán màng mờ và không cán màng; không tự chọn một phương án",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Bế hình khác là hạng mục riêng, không áp giá dòng chữ nhật/vuông",
          "50 × 30 mm",
          "Số lượng 3000 cái"
        ],
        "specs": {
          "size": "50x30",
          "dimensionsUnit": "mm",
          "material": "c300",
          "sides": 2,
          "printing": "offset-multicolor",
          "finishing": "rectangle-square-hole"
        },
        "sourceNote": "Đơn giá và tổng đều là số tiền công bố cho dòng nguồn. Cán màng mờ/không cán màng chưa nhất quán; yêu cầu xác định cán màng cần tư vấn viên xác nhận, không suy ra đã bao gồm. Chưa gồm VAT 10%; bế hình khác tính riêng.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tag-treo-the-bai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "laminationAmbiguous": true,
          "otherDieCutSeparate": true,
          "missingConditions": [
            "cán màng mờ hay không cán màng"
          ],
          "publishedTotalVerified": true
        }
      },
      {
        "id": "vp-tag-50x30-6000",
        "lookupQuery": "Xem dòng bảng giá tag treo Vĩnh Phát 50x30 mm 6000 cái",
        "quantity": 6000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 90,
        "sourceTotalVnd": 540000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Giấy Couche 300gsm; in offset nhiều màu hai mặt",
          "Hình chữ nhật hoặc vuông, có lỗ",
          "Nguồn chưa nhất quán giữa cán màng mờ và không cán màng; không tự chọn một phương án",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Bế hình khác là hạng mục riêng, không áp giá dòng chữ nhật/vuông",
          "50 × 30 mm",
          "Số lượng 6000 cái"
        ],
        "specs": {
          "size": "50x30",
          "dimensionsUnit": "mm",
          "material": "c300",
          "sides": 2,
          "printing": "offset-multicolor",
          "finishing": "rectangle-square-hole"
        },
        "sourceNote": "Đơn giá và tổng đều là số tiền công bố cho dòng nguồn. Cán màng mờ/không cán màng chưa nhất quán; yêu cầu xác định cán màng cần tư vấn viên xác nhận, không suy ra đã bao gồm. Chưa gồm VAT 10%; bế hình khác tính riêng.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tag-treo-the-bai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "laminationAmbiguous": true,
          "otherDieCutSeparate": true,
          "missingConditions": [
            "cán màng mờ hay không cán màng"
          ],
          "publishedTotalVerified": true
        }
      },
      {
        "id": "vp-tag-45x45-1000",
        "lookupQuery": "Xem dòng bảng giá tag treo Vĩnh Phát 45x45 mm 1000 cái",
        "quantity": 1000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 170,
        "sourceTotalVnd": 170000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Giấy Couche 300gsm; in offset nhiều màu hai mặt",
          "Hình chữ nhật hoặc vuông, có lỗ",
          "Nguồn chưa nhất quán giữa cán màng mờ và không cán màng; không tự chọn một phương án",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Bế hình khác là hạng mục riêng, không áp giá dòng chữ nhật/vuông",
          "45 × 45 mm",
          "Số lượng 1000 cái"
        ],
        "specs": {
          "size": "45x45",
          "dimensionsUnit": "mm",
          "material": "c300",
          "sides": 2,
          "printing": "offset-multicolor",
          "finishing": "rectangle-square-hole"
        },
        "sourceNote": "Đơn giá và tổng đều là số tiền công bố cho dòng nguồn. Cán màng mờ/không cán màng chưa nhất quán; yêu cầu xác định cán màng cần tư vấn viên xác nhận, không suy ra đã bao gồm. Chưa gồm VAT 10%; bế hình khác tính riêng.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tag-treo-the-bai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "laminationAmbiguous": true,
          "otherDieCutSeparate": true,
          "missingConditions": [
            "cán màng mờ hay không cán màng"
          ],
          "publishedTotalVerified": true
        }
      },
      {
        "id": "vp-tag-45x45-2000",
        "lookupQuery": "Xem dòng bảng giá tag treo Vĩnh Phát 45x45 mm 2000 cái",
        "quantity": 2000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 140,
        "sourceTotalVnd": 280000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Giấy Couche 300gsm; in offset nhiều màu hai mặt",
          "Hình chữ nhật hoặc vuông, có lỗ",
          "Nguồn chưa nhất quán giữa cán màng mờ và không cán màng; không tự chọn một phương án",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Bế hình khác là hạng mục riêng, không áp giá dòng chữ nhật/vuông",
          "45 × 45 mm",
          "Số lượng 2000 cái"
        ],
        "specs": {
          "size": "45x45",
          "dimensionsUnit": "mm",
          "material": "c300",
          "sides": 2,
          "printing": "offset-multicolor",
          "finishing": "rectangle-square-hole"
        },
        "sourceNote": "Đơn giá và tổng đều là số tiền công bố cho dòng nguồn. Cán màng mờ/không cán màng chưa nhất quán; yêu cầu xác định cán màng cần tư vấn viên xác nhận, không suy ra đã bao gồm. Chưa gồm VAT 10%; bế hình khác tính riêng.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tag-treo-the-bai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "laminationAmbiguous": true,
          "otherDieCutSeparate": true,
          "missingConditions": [
            "cán màng mờ hay không cán màng"
          ],
          "publishedTotalVerified": true
        }
      },
      {
        "id": "vp-tag-45x45-4000",
        "lookupQuery": "Xem dòng bảng giá tag treo Vĩnh Phát 45x45 mm 4000 cái",
        "quantity": 4000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 110,
        "sourceTotalVnd": 440000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Giấy Couche 300gsm; in offset nhiều màu hai mặt",
          "Hình chữ nhật hoặc vuông, có lỗ",
          "Nguồn chưa nhất quán giữa cán màng mờ và không cán màng; không tự chọn một phương án",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Bế hình khác là hạng mục riêng, không áp giá dòng chữ nhật/vuông",
          "45 × 45 mm",
          "Số lượng 4000 cái"
        ],
        "specs": {
          "size": "45x45",
          "dimensionsUnit": "mm",
          "material": "c300",
          "sides": 2,
          "printing": "offset-multicolor",
          "finishing": "rectangle-square-hole"
        },
        "sourceNote": "Đơn giá và tổng đều là số tiền công bố cho dòng nguồn. Cán màng mờ/không cán màng chưa nhất quán; yêu cầu xác định cán màng cần tư vấn viên xác nhận, không suy ra đã bao gồm. Chưa gồm VAT 10%; bế hình khác tính riêng.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tag-treo-the-bai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "laminationAmbiguous": true,
          "otherDieCutSeparate": true,
          "missingConditions": [
            "cán màng mờ hay không cán màng"
          ],
          "publishedTotalVerified": true
        }
      },
      {
        "id": "vp-tag-90x27-1000",
        "lookupQuery": "Xem dòng bảng giá tag treo Vĩnh Phát 90x27 mm 1000 cái",
        "quantity": 1000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 170,
        "sourceTotalVnd": 170000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Giấy Couche 300gsm; in offset nhiều màu hai mặt",
          "Hình chữ nhật hoặc vuông, có lỗ",
          "Nguồn chưa nhất quán giữa cán màng mờ và không cán màng; không tự chọn một phương án",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Bế hình khác là hạng mục riêng, không áp giá dòng chữ nhật/vuông",
          "90 × 27 mm",
          "Số lượng 1000 cái"
        ],
        "specs": {
          "size": "90x27",
          "dimensionsUnit": "mm",
          "material": "c300",
          "sides": 2,
          "printing": "offset-multicolor",
          "finishing": "rectangle-square-hole"
        },
        "sourceNote": "Đơn giá và tổng đều là số tiền công bố cho dòng nguồn. Cán màng mờ/không cán màng chưa nhất quán; yêu cầu xác định cán màng cần tư vấn viên xác nhận, không suy ra đã bao gồm. Chưa gồm VAT 10%; bế hình khác tính riêng.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tag-treo-the-bai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "laminationAmbiguous": true,
          "otherDieCutSeparate": true,
          "missingConditions": [
            "cán màng mờ hay không cán màng"
          ],
          "publishedTotalVerified": true
        }
      },
      {
        "id": "vp-tag-90x27-2000",
        "lookupQuery": "Xem dòng bảng giá tag treo Vĩnh Phát 90x27 mm 2000 cái",
        "quantity": 2000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 140,
        "sourceTotalVnd": 280000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Giấy Couche 300gsm; in offset nhiều màu hai mặt",
          "Hình chữ nhật hoặc vuông, có lỗ",
          "Nguồn chưa nhất quán giữa cán màng mờ và không cán màng; không tự chọn một phương án",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Bế hình khác là hạng mục riêng, không áp giá dòng chữ nhật/vuông",
          "90 × 27 mm",
          "Số lượng 2000 cái"
        ],
        "specs": {
          "size": "90x27",
          "dimensionsUnit": "mm",
          "material": "c300",
          "sides": 2,
          "printing": "offset-multicolor",
          "finishing": "rectangle-square-hole"
        },
        "sourceNote": "Đơn giá và tổng đều là số tiền công bố cho dòng nguồn. Cán màng mờ/không cán màng chưa nhất quán; yêu cầu xác định cán màng cần tư vấn viên xác nhận, không suy ra đã bao gồm. Chưa gồm VAT 10%; bế hình khác tính riêng.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tag-treo-the-bai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "laminationAmbiguous": true,
          "otherDieCutSeparate": true,
          "missingConditions": [
            "cán màng mờ hay không cán màng"
          ],
          "publishedTotalVerified": true
        }
      },
      {
        "id": "vp-tag-90x27-4000",
        "lookupQuery": "Xem dòng bảng giá tag treo Vĩnh Phát 90x27 mm 4000 cái",
        "quantity": 4000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 110,
        "sourceTotalVnd": 440000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Giấy Couche 300gsm; in offset nhiều màu hai mặt",
          "Hình chữ nhật hoặc vuông, có lỗ",
          "Nguồn chưa nhất quán giữa cán màng mờ và không cán màng; không tự chọn một phương án",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Bế hình khác là hạng mục riêng, không áp giá dòng chữ nhật/vuông",
          "90 × 27 mm",
          "Số lượng 4000 cái"
        ],
        "specs": {
          "size": "90x27",
          "dimensionsUnit": "mm",
          "material": "c300",
          "sides": 2,
          "printing": "offset-multicolor",
          "finishing": "rectangle-square-hole"
        },
        "sourceNote": "Đơn giá và tổng đều là số tiền công bố cho dòng nguồn. Cán màng mờ/không cán màng chưa nhất quán; yêu cầu xác định cán màng cần tư vấn viên xác nhận, không suy ra đã bao gồm. Chưa gồm VAT 10%; bế hình khác tính riêng.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tag-treo-the-bai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "laminationAmbiguous": true,
          "otherDieCutSeparate": true,
          "missingConditions": [
            "cán màng mờ hay không cán màng"
          ],
          "publishedTotalVerified": true
        }
      },
      {
        "id": "vp-tag-90x54-500",
        "lookupQuery": "Xem dòng bảng giá tag treo Vĩnh Phát 90x54 mm 500 cái",
        "quantity": 500,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 300,
        "sourceTotalVnd": 150000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Giấy Couche 300gsm; in offset nhiều màu hai mặt",
          "Hình chữ nhật hoặc vuông, có lỗ",
          "Nguồn chưa nhất quán giữa cán màng mờ và không cán màng; không tự chọn một phương án",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Bế hình khác là hạng mục riêng, không áp giá dòng chữ nhật/vuông",
          "90 × 54 mm",
          "Số lượng 500 cái"
        ],
        "specs": {
          "size": "90x54",
          "dimensionsUnit": "mm",
          "material": "c300",
          "sides": 2,
          "printing": "offset-multicolor",
          "finishing": "rectangle-square-hole"
        },
        "sourceNote": "Đơn giá và tổng đều là số tiền công bố cho dòng nguồn. Cán màng mờ/không cán màng chưa nhất quán; yêu cầu xác định cán màng cần tư vấn viên xác nhận, không suy ra đã bao gồm. Chưa gồm VAT 10%; bế hình khác tính riêng.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tag-treo-the-bai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "laminationAmbiguous": true,
          "otherDieCutSeparate": true,
          "missingConditions": [
            "cán màng mờ hay không cán màng"
          ],
          "publishedTotalVerified": true
        }
      },
      {
        "id": "vp-tag-90x54-1000",
        "lookupQuery": "Xem dòng bảng giá tag treo Vĩnh Phát 90x54 mm 1000 cái",
        "quantity": 1000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 210,
        "sourceTotalVnd": 210000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Giấy Couche 300gsm; in offset nhiều màu hai mặt",
          "Hình chữ nhật hoặc vuông, có lỗ",
          "Nguồn chưa nhất quán giữa cán màng mờ và không cán màng; không tự chọn một phương án",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Bế hình khác là hạng mục riêng, không áp giá dòng chữ nhật/vuông",
          "90 × 54 mm",
          "Số lượng 1000 cái"
        ],
        "specs": {
          "size": "90x54",
          "dimensionsUnit": "mm",
          "material": "c300",
          "sides": 2,
          "printing": "offset-multicolor",
          "finishing": "rectangle-square-hole"
        },
        "sourceNote": "Đơn giá và tổng đều là số tiền công bố cho dòng nguồn. Cán màng mờ/không cán màng chưa nhất quán; yêu cầu xác định cán màng cần tư vấn viên xác nhận, không suy ra đã bao gồm. Chưa gồm VAT 10%; bế hình khác tính riêng.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tag-treo-the-bai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "laminationAmbiguous": true,
          "otherDieCutSeparate": true,
          "missingConditions": [
            "cán màng mờ hay không cán màng"
          ],
          "publishedTotalVerified": true
        }
      },
      {
        "id": "vp-tag-90x54-2000",
        "lookupQuery": "Xem dòng bảng giá tag treo Vĩnh Phát 90x54 mm 2000 cái",
        "quantity": 2000,
        "quantityUnit": "cái",
        "unit": "cái",
        "priceVnd": 180,
        "sourceTotalVnd": 360000,
        "priceKind": "per_unit",
        "priceBasis": "per-unit",
        "provider": "vinh-phat",
        "conditions": [
          "Giấy Couche 300gsm; in offset nhiều màu hai mặt",
          "Hình chữ nhật hoặc vuông, có lỗ",
          "Nguồn chưa nhất quán giữa cán màng mờ và không cán màng; không tự chọn một phương án",
          "Giá chưa gồm VAT 10%; thiết kế miễn phí theo nguồn",
          "Bế hình khác là hạng mục riêng, không áp giá dòng chữ nhật/vuông",
          "90 × 54 mm",
          "Số lượng 2000 cái"
        ],
        "specs": {
          "size": "90x54",
          "dimensionsUnit": "mm",
          "material": "c300",
          "sides": 2,
          "printing": "offset-multicolor",
          "finishing": "rectangle-square-hole"
        },
        "sourceNote": "Đơn giá và tổng đều là số tiền công bố cho dòng nguồn. Cán màng mờ/không cán màng chưa nhất quán; yêu cầu xác định cán màng cần tư vấn viên xác nhận, không suy ra đã bao gồm. Chưa gồm VAT 10%; bế hình khác tính riêng.",
        "sourceUrl": "https://invinhphat.com/san-pham/in-tag-treo-the-bai/",
        "verifiedAtUtc": "2026-10-12T04:50:00Z",
        "verificationWindowUtc": {
          "start": "2026-10-12T04:46:00Z",
          "end": "2026-10-12T04:50:00Z"
        },
        "rawSourceFlags": {
          "quantityKey": "cai",
          "vatExcluded": true,
          "vatRatePercent": 10,
          "designIncluded": true,
          "laminationAmbiguous": true,
          "otherDieCutSeparate": true,
          "missingConditions": [
            "cán màng mờ hay không cán màng"
          ],
          "publishedTotalVerified": true
        }
      }
    ],
    "uncertainFinishingTokens": [
      "can mang",
      "khong can mang"
    ]
  }
];

export const VP_SOURCE_ROWS = VP_SOURCE_PRODUCTS.flatMap(product =>
  product.priceFacts.map(fact => ({ productId: product.id, ...fact }))
);

