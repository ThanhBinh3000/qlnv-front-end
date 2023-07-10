import * as moment from 'moment';

export const STORAGE_KEY = {
  ACCESS_TOKEN: 'access_token',
  ROLE: 'role',
  USER_INFO: 'user_info',
  PERMISSION: 'permission',
  DVQL: 'dvql'
};

export const STATUS_CODE = {
  SUCCESS: 200,
  ERROR: 201,
  UNAUTHORIZED: 401,
};

export const API_STATUS_CODE = {
  SUCCESS: 0,
  ERROR: 1,
};

export const API_STATUS = {
  SUCCESS: 1,
  ERROR: 0,
};

export const SYSTYPE_CONFIRM = {
  BE: 'Trong hệ thống',
  FE: 'Ngoài hệ thống',
};

export const DOCUMENT_TYPE_ID = {
  VAN_BAN_DEN: '1',
  VAN_BAN_DI: '2',
  VAN_BAN_DUTHAO: '3',
  TO_TRINH: '4',
  VAN_BAN_NOIBO: '5',
};

export const TYPE_MODAL = {
  CONG_BO: '1',
  XIN_Y_KIEN: '2',
};

export const EMPTY_ID = '00000000-0000-0000-0000-000000000000';
export const PAGE_SIZE_DEFAULT = 10;
export const MAXIMUM_FILE_UPLOAD = 20480000;

export const TABLE_LOG = {
  VanBanDen: 'DocumentIn',
  VanBanDi: 'DocumentOut',
};

export const ERROR_CODE = {
  ERROR_BOOKNUMBER: 'Error_BookNumber',
  ERROR_LANHDAO: 'ERROR_100',
};

export const DONVI_NGOAINGANH = {
  TRONG_BTC: '1',
  NGOAI_BTC: '2',
};

export const VANTHU_TONGCUC = {
  DEPT_CODE: '000.00.32.G12',
  ROLE_CODE: 'VT',
};

export const LANHDAO_DONVI = {
  DEPT_CODE: '000.00.32.G12',
  ROLE_CODE: 'LDDV',
};

export const LANHDAO_VANPHONG = {
  ROLE_CODE: 'LDVP',
};

export const LANHDAO_PHONG = {
  ROLE_CODE: 'LDP',
};

export const CHUYEN_VIEN = {
  ROLE_CODE: 'CV',
};

export const DATEPICKER_CONFIG = {
  format: 'DD/MM/YYYY',
  monthFormat: 'MMM YYYY',
  allowMultiSelect: false,
  weekDayFormat: 'dd',
  showNearMonthDays: true,
  yearFormat: 'YYYY',
  monthBtnFormat: 'MMM',
  locale: moment.locale('vi'),
  openOnClick: true,
  openOnFocus: true,
  disableKeypress: false,
};

export const ACTION_NEXT = {
  TRINH: 'action.name.send_process',
  CHUYEN_CAP_PHO: 'action.name.transform_to_pho',
  CHUYEN_DON_VI: 'action.name.unit',
  CHUYEN_PHONG_BAN: 'action.name.department',
  CHUYEN_CHI_CUC: 'action.name.office',
  CHUYEN_CA_NHAN: 'action.name.person',
  TRA_LAI: 'action.name.return',
  KY_THUA_LENH: 'action.name.transform_to_kythualenh',
  KY_THAY: 'action.name.transform_to_kythay',
  KY_UY_QUYEN: 'action.name.transform_to_kyuyquyen',
  CAP_SO: 'action.name.assign_number',
};

export const DOCUMENT_IN_STATUS = {
  DaHoanThanh: 4,
  TuChoi: 5,
  ThuHoi: 6,
};

export const PROCESS_STATUS = {
  DOING: 9,
  RETURN: 5,
  RECALL: 6,
  FINISH: 4,
};

export const STATUS_VAN_BAN = {
  TAO_MOI: 1,
  DANG_XU_LY: 2,
  DA_KY_DUYET: 3,
  TU_CHOI: 4,
  DA_CAP_SO: 6,
  PHAT_HANH: 5,
  THU_HOI: 7,
  DA_CHUYEN_DON_VI: 8,
};

export const TYPE_ACTION = {
  KY_THAY: 1,
  KY_THUA_LENH: 2,
  KY_UY_QUYEN: 3,
  DUYET: 4,
};

export const DEPT_TYPE = {
  TONGCUC: 0,
  CUCKHUVUC: 1,
  CHICUC: 2,
  VU: 4,
  VANPHONG: 3,
};

export const STATUS_TYPE_CHECK = {
  TAOMOI: 1,
  CHOPHEDUYET: 2,
  PHEDUYET: 3,
  TUCHOI: 4,
};

export const LOAI_QUYET_DINH = {
  NHAP: '00',
  XUAT: '01',
};

export const LOAI_HANG_DTQG = {
  GAO: '0102',
  THOC: '0101',
  MUOI: '04',
  VAT_TU: '02',
};

export const TEN_HANG_DTQG = {
  GAO: 'gao',
  THOC: 'thoc',
  MUOI: 'muoi',
  VAT_TU: 'vat-tu'
};

export const TEN_LOAI_VTHH = {
  GAO: 'Gạo tẻ',
  THOC: 'Thóc tẻ',
  MUOI: 'Muối trắng'
};

export const STATUS_USER = {
  HOAT_DONG: '01',
  KHOA: '00',
};
export const LEVEL = {
  TONG_CUC: 'tong-cuc',
  CUC: 'cuc',
  CHI_CUC: 'chi-cuc',
  TONG_CUC_SHOW: 'Tổng cục',
  CUC_SHOW: 'Cục',
  CHI_CUC_SHOW: 'Chi cục',
};
export const LEVEL_USER = {
  ADMIN: '1',
  CAN_BO_TONG_CUC: '1',
  CUC: '2',
  CHI_CUC: '3',
};
export const LIST_VAT_TU_HANG_HOA = [
  {
    value: LOAI_HANG_DTQG.THOC,
    text: 'Thóc',
    title: 'Thóc'
  },
  {
    value: LOAI_HANG_DTQG.GAO,
    text: 'Gạo',
    title: 'Gạo'
  },
  {
    value: LOAI_HANG_DTQG.MUOI,
    text: 'Muối',
    title: 'Muối'
  },
  {
    value: LOAI_HANG_DTQG.VAT_TU,
    text: 'Vật tư',
    title: 'Vật tư'
  }
]
export const STATUS_DA_DUYET = "29";

export const STATUS_DA_HOAN_THANH = "35";

export const TYPE_PAG = {
  GIA_MUA_TOI_DA: 'GMTDBTT',
  GIA_CU_THE: 'GCT',
};
//Loại danh mục sửa chữa
export const DM_SC_TYPE = {
  SC_THUONG_XUYEN: '01',
  SC_LON: '00',
};
//Loại qd giao chỉ tiêu kế hoạch năm
export const LOAI_QD_CTKH = {
  QD: '00',
  QD_DC: '01',
  PA: '02'
};
//Loại hàng hóa xuât khác
export const LOAI_HH_XUAT_KHAC = {
  LT_6_THANG: 'LT6',
  VT_12_THANG: 'VT12',
  VT_6_THANG: 'VT6'
};

export const KIEU_NHAP_XUAT = {
  '01': 'Nhập mua',
  '02': 'Nhập không chi tiền',
  '03': 'Xuất bán',
  '04': 'Xuất không thu tiền',
  '05': 'Khác'
};
