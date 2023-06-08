export enum STATUS {
  DU_THAO = '00',
  CHO_DUYET_TP = '01',
  TU_CHOI_TP = '02',
  CHO_DUYET_LDC = '03',
  TU_CHOI_LDC = '04',
  DA_DUYET_LDC = '05',
  CHO_DUYET_TK = '06',
  CHO_DUYET_KTVBQ = '07',
  CHO_DUYET_KT = '08',
  TU_CHOI_TK = '09',
  TU_CHOI_KTVBQ = '10',
  TU_CHOI_KT = '11',
  DA_DUYET_TK = '12',
  DA_DUYET_KTVBQ = '13',
  DA_DUYET_KT = '14',
  CHO_DUYET_LDCC = '15',
  TU_CHOI_LDCC = '16',
  DA_DUYET_LDCC = '17',
  CHO_DUYET_LDV = '18',
  TU_CHOI_LDV = '19',
  DA_DUYET_LDV = '20',
  CHO_DUYET_LDTC = '21',
  TU_CHOI_LDTC = '22',
  DA_DUYET_LDTC = '23',
  CHUA_TONG_HOP = '24',
  DA_TONG_HOP = '25',
  CHUA_TAO_QD = '26',
  DA_DU_THAO_QD = '27',
  DA_BAN_HANH_QD = '28',
  BAN_HANH = '29',
  DA_KY = '30',
  CHUA_TAO_TT = '31',
  DA_TAO_TT = '32',
  CHUA_CAP_NHAT = '33',
  DANG_CAP_NHAT = '34',
  HOAN_THANH_CAP_NHAT = '35',
  HUY_THAU = '36',
  TRUNG_THAU = '37',
  CHODUYET_TBP_TVQT = '38',
  TUCHOI_TBP_TVQT = '39',
  THANH_CONG = '40',
  THAT_BAI = '41',
  TRUOT_THAU = '42',
  CHUA_THUC_HIEN = '43',
  DANG_THUC_HIEN = '44',
  DA_HOAN_THANH = '45',
  DA_NGHIEM_THU = '46',
  CHO_DUYET_TBP_KTBQ = '47',
  TU_CHOI_TBP_KTBQ = '48',
  CHODUYET_BTC = '49',
  TUCHOI_BTC = '50',
  DADUYET_BTC = '51',
  DA_TAO_CBV = '52',
  DA_DUYET_CBV = '53',
  TU_CHOI_CBV = '54',
  KHONG_BAN_HANH = '55',
  HET_HIEU_LUC = '56',
  DADUYET_CB_CUC = '57',
  TUCHOI_CB_CUC = '58',
  YC_CHICUC_PHANBO_DC = '59',
  DA_PHANBO_DC_CHODUYET_TBP_TVQT = '60',
  DA_PHANBO_DC_TUCHOI_TBP_TVQT = '61',
  DA_PHANBO_DC_CHODUYET_LDCC = '62',
  DA_PHANBO_DC_TUCHOI_LDCC = '63',
  DA_PHANBO_DC_DADUYET_LDCC = '64',
  DA_PHANBO_DC_CHODUYET_TP = '65',
  DA_PHANBO_DC_TUCHOI_TP = '66',
  DA_PHANBO_DC_CHODUYET_LDC = '67',
  DA_PHANBO_DC_TUCHOI_LDC = '68',
  DA_PHANBO_DC_DADUYET_LDC = '69',
  TU_CHOI_BAN_HANH_QD = '78'
}

export enum LoaiTaiLieu {
  VanBanDen = 1,
  VanBanDi = 3,
  ToTrinh = 4,
  VanBanNoiBo = 5,
  VanBanTraLoi = 6,
}

export enum LoaiDanhMuc {
  VAI_TRO = "VAI_TRO"
}

export enum TrangThaiHoatDong {
  HOAT_DONG = "01",
  KHONG_HOAT_DONG = "00"
}

export enum HienTrangMayMoc {
  DA_CHOT = '01',
  CHUA_CHOT = '00'
}


export enum LOAI_DON_VI {
  MLK = "MLK",
  PB = "PB",
  DV = "DV"
}

export enum KH_CT_LOAI_CHI_TIEU {
  NHAP = "01",
  XUAT = "00",
}

export enum LOAI_BIEN_BAN {
  BB_KTRA_NGOAI_QUAN = "BBKTNQ",
  BB_KTRA_VAN_HANH = "BBKTVH",
  BB_KTRA_HOSO_KYTHUAT = "BBKTHSKT",
}

export const STATUS_LABEL = {
  [STATUS.DU_THAO]: 'Dự thảo',
  [STATUS.BAN_HANH]: 'Ban hành',
  [STATUS.CHO_DUYET_LDV]: 'Chờ duyệt lãnh đạo vụ',
} as const;

export enum CHUC_NANG {
  XEM = 'XEM',
  SUA = 'SUA',
  DUYET_LDTC = 'DUYET_LDTC',
  DUYET_LDV = 'DUYET_LDV',
  DUYET_TP = 'DUYET_TP',
  DUYET_LDC = 'DUYET_LDC',
  DUYET_LDCC = 'DUYET_LDCC',
  XOA = 'XOA',
  DUYET_KTVBQ = 'DUYET_KTVBQ',
  DUYET_KT = 'DUYET_KT',
  TAO_QD = 'TAO_QD',
}


export enum TRANG_THAI_QUY_CHUAN_TIEU_CHUAN {
  CON_HIEU_LUC = "01",
  HET_HIEU_LUC = "00",
}


