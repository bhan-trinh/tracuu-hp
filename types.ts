export type ReceiptItem = {
  dich_vu: string;
  hoc_sinh_info: InfoHs;
  thanh_toan: HoaDon[];
};

export type InfoHs = {
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
  id: string;
  ten_thanh_toan: string;
  chi_tiet: ChiTietHoaDon[];
  allow_online: string;
  dv_su_dung_id: undefined;
  source: string;
  dv_du_no: undefined;
};

export type ChiTietHoaDon = {
  ten: string;
  code: string;
  tong_tien: string;
  code_thu_huong: string;
};
