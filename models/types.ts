export type ReceiptItem = {
  dich_vu: string;
  hoc_sinh_info: InfoHs;
  thanh_toan: HoaDon[];
};

export type InfoHs = {
  id: number;
  ten_hoc_sinh: string;
  ten_lop: string;
  ten_truong: string;
  truong_id: string;
  tinh_id: string;
  lop_hoc_id: Number;
};

export type HoaDon = {
  tong_tien: string;
  noi_dung: string;
  id: number;
  ten_thanh_toan: string;
  chi_tiet: ChiTietHoaDon[];
  allow_online: string;
  dv_su_dung_id: string;
  source: string;
  dv_du_no: string;
};

export type ChiTietHoaDon = {
  ten: string;
  code: string;
  tong_tien: string;
  code_thu_huong: string;
};

/*
// Receipt Item Model
  {
    dich_vu: "vnedu",
    hoc_sinh_info: {
      ten_hoc_sinh: "Hoàng Bảo Chao",
      ten_lop: "MẪU GIÁO GHÉP 5-6 TUỔI LỦNG SIÊN",
      ten_truong: "Trường Mầm non Vũ Muộn",
      truong_id: "VNEDU125431",
      tinh_id: "4",
      lop_hoc_id: 5000227061,
    },
    thanh_toan: [
      {
        tong_tien: "307000",
        noi_dung: "Tiền bán trú tháng 2",
        id: "3275867601",
        ten_thanh_toan:
          "Tiền ăn, trông trưa, chất đốt, cô nuôi tháng 02 năm 2025",
        chi_tiet: [
          {
            ten: "TIỀN CÔ NUÔI",
            code: "CONUOI",
            tong_tien: "22000",
            code_thu_huong: "3",
          },
          {
            ten: "TIỀN CHẤT ĐỐT",
            code: "CHATDOT",
            tong_tien: "45000",
            code_thu_huong: "4",
          },
          {
            ten: "TIỀN ĂN BÁN TRÚ",
            code: "ANBANTRU",
            tong_tien: "192000",
            code_thu_huong: "3",
          },
          {
            ten: "TIỀN TRÔNG TRƯA",
            code: "TRONGTRUA",
            tong_tien: "48000",
            code_thu_huong: "3",
          },
        ],
        allow_online: "1",
        dv_su_dung_id: null,
        source: "0",
        dv_du_no: null,
      },
    ],
  }
};
*/
