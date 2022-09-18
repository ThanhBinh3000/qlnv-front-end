import { MAIN_ROUTES } from 'src/app/layout/main/main-routing.constant';
import { GDT, ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import { DU_TOAN_NSNN } from '../../ke-hoach.constant';
import { DuToanNSNN } from '../du-toan-nsnn.type';

export const MAIN_ROUTE_KE_HOACH = MAIN_ROUTES.kehoach;
export const MAIN_ROUTE_DU_TOAN = DU_TOAN_NSNN;
export const GIAO_DU_TOAN = 'giao-du-toan-chi-nsnn';

export const NHAN_VIEN_CC = {
  unit: Utils.CHI_CUC,
  role: ROLE_CAN_BO,
}

export const TRUONG_BP_CC = {
  unit: Utils.CHI_CUC,
  role: ROLE_TRUONG_BO_PHAN,
}

export const LANH_DAO_CC = {
  unit: Utils.CHI_CUC,
  role: ROLE_LANH_DAO,
}

export const NHAN_VIEN_CKV = {
  unit: Utils.CUC_KHU_VUC,
  role: ROLE_CAN_BO,
}

export const TRUONG_BP_CKV = {
  unit: Utils.CUC_KHU_VUC,
  role: ROLE_TRUONG_BO_PHAN,
}

export const LANH_DAO_CKV = {
  unit: Utils.CUC_KHU_VUC,
  role: ROLE_LANH_DAO,
}

export const NHAN_VIEN_TC = {
  unit: Utils.TONG_CUC,
  role: ROLE_CAN_BO,
}

export const TRUONG_BP_TC = {
  unit: Utils.TONG_CUC,
  role: ROLE_TRUONG_BO_PHAN,
}

export const LANH_DAO_TC = {
  unit: Utils.TONG_CUC,
  role: ROLE_LANH_DAO,
}


export const GIAO_DU_TOAN_CHI_NSNN_NSNN_LIST: DuToanNSNN[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'NHẬP QUYẾT ĐỊNH GIAO DỰ TOÁN CHI NSNN TỪ BTC',
    description: 'NHẬP QUYẾT ĐỊNH GIAO DỰ TOÁN CHI NSNN TỪ BTC',
    url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${GIAO_DU_TOAN}/tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN`,
    Role: [
      GDT.VIEW_REPORT_PA_PBDT,
      GDT.ADD_REPORT_CV_QD_GIAO_PA_PBDT,
      GDT.EDIT_REPORT_CV_QD_GIAO_PA_PBDT,
      GDT.DELETE_REPORT_CV_QD_GIAO_PA_PBDT,
    ],
    isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'DANH SÁCH PHƯƠNG ÁN PHÂN BỔ GIAO DỰ TOÁN CHI NSNN TẠI ĐƠN VỊ',
    description: 'DANH SÁCH PHƯƠNG ÁN PHÂN BỔ GIAO DỰ TOÁN CHI NSNN TẠI ĐƠN VỊ',
    url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${GIAO_DU_TOAN}/tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi`,
    Role: [
      GDT.VIEW_REPORT_PA_PBDT,
      GDT.DELETE_REPORT_PA_PBDT,
      GDT.EDIT_REPORT_PA_PBDT,
      GDT.ADD_REPORT_CV_QD_GIAO_PA_PBDT,
    ],
    isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'DANH SÁCH GIAO DỰ TOÁN CHI NSNN CHO ĐƠN VỊ CẤP DƯỚI',
    description: 'DANH SÁCH GIAO DỰ TOÁN CHI NSNN CHO ĐƠN VỊ CẤP DƯỚI',
    url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${GIAO_DU_TOAN}/tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi`,
    Role: [
      GDT.GIAO_PA_PBDT
    ],
    isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'DANH SÁCH NHẬN DỰ TOÁN CHI NSNN CỦA CÁC ĐƠN VỊ',
    description: 'DANH SÁCH NHẬN DỰ TOÁN CHI NSNN CỦA CÁC ĐƠN VỊ',
    url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${GIAO_DU_TOAN}/tim-kiem-nhan-du-toan-chi-NSNN-cua-cac-don-vi`,
    Role: [
      GDT.NHAN_PA_PBDT
    ],
    isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'DANH SÁCH DUYỆT BÁO CÁO PHÂN BỔ GIAO, ĐIỀU CHỈNH DỰ TOÁN TỪ CÁC ĐƠN VỊ CẤP DƯỚI',
    description: 'DANH SÁCH DUYỆT BÁO CÁO PHÂN BỔ GIAO, ĐIỀU CHỈNH DỰ TOÁN TỪ CÁC ĐƠN VỊ CẤP DƯỚI',
    url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${GIAO_DU_TOAN}/danh-sach-duyet-bao-cao-phan-bo-giao-dieu-chinh-du-toan`,
    Role: [
      GDT.DUYET_TUCHOI_PA_TH_PBDT,
      GDT.PHEDUYET_TUCHOI_PA_TH_PBDT,
      GDT.XEM_PA_TONGHOP_PBDT
    ],
    isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'KIỂM TRA TÌNH TRẠNG NHẬN DỰ TOÁN CHI CỦA ĐƠN VỊ CẤP DƯỚI',
    description: 'KIỂM TRA TÍNH TRẠNG NHẬN DỰ TOÁN CHI CỦA ĐƠN VỊ CẤP DƯỚI',
    url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${GIAO_DU_TOAN}/kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc`,
    Role: [
      GDT.XEM_PA_TONGHOP_PBDT
    ],
    isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'PHÊ DUYỆT PHƯƠNG ÁN TẠI ĐƠN VỊ',
    description: 'PHÊ DUYỆT PHƯƠNG ÁN TẠI ĐƠN VỊ',
    url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${GIAO_DU_TOAN}/duyet-phuong-an-tai-don-vi`,
    Role: [
      GDT.PHE_DUYET_REPORT_PA_PBDT
    ],
    isDisabled: false,
  },
];


