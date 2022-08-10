import { Utils, ROLE_CAN_BO, ROLE_TRUONG_BO_PHAN, ROLE_LANH_DAO } from './../../../Utility/utils';
import { QuanLyGiaoDuToanChiNSNN } from './quan-ly-giao-du-toan-chi-nsnn.type';
import { MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI, MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN } from '../../../constants/routerUrl';

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

//**************** */ cac trang thai cua bao cao
//trang thai dang soan
export const TT_DANG_SOAN = '1';
//trang thai trinh duyet
export const TT_TRINH_DUYET = '2';
//trang thai truong bo phan tu choi
export const TT_TBP_TU_CHOI = '3';
//trang thai truong bo phan chap nhan
export const TT_TBP_CHAP_NHAN = '4';
//trang thai lanh dao tu choi
export const TT_LD_TU_CHOI = '5';
//trang thai lanh dao chap nhan
export const TT_LD_CHAP_NHAN = '6';
//trang thai don vi cap tren tu choi
export const TT_TU_CHOI = '7';
//trang thai don vi cap tren chap nhan
export const TT_CHAP_NHAN = '8';


export const QUAN_LY_GIAO_DU_TOAN_CHI_NSNN_LIST: QuanLyGiaoDuToanChiNSNN[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'NHẬP QUYẾT ĐỊNH GIAO DỰ TOÁN CHI NSNN TỪ BTC',
    description: 'NHẬP QUYẾT ĐỊNH GIAO DỰ TOÁN CHI NSNN TỪ BTC',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN`,
    Role: [
      NHAN_VIEN_TC,
      // TRUONG_BP_TC,
      // LANH_DAO_TC,
    ],
    isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'DANH SÁCH PHƯƠNG ÁN PHÂN BỔ GIAO DỰ TOÁN CHI NSNN TẠI ĐƠN VỊ',
    description: 'DANH SÁCH PHƯƠNG ÁN PHÂN BỔ GIAO DỰ TOÁN CHI NSNN TẠI ĐƠN VỊ',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi`,
    Role: [
      NHAN_VIEN_TC,
      TRUONG_BP_TC,
      LANH_DAO_TC,
      NHAN_VIEN_CKV,
      TRUONG_BP_CKV,
      LANH_DAO_CKV,
    ],
    isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'DANH SÁCH GIAO DỰ TOÁN CHI NSNN CHO CÁC ĐƠN VỊ CẤP DƯỚI',
    description: 'DANH SÁCH GIAO DỰ TOÁN CHI NSNN CHO CÁC ĐƠN VỊ CẤP DƯỚI',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi`,
    Role: [
      NHAN_VIEN_TC,
      TRUONG_BP_TC,
      LANH_DAO_TC,
      NHAN_VIEN_CKV,
      TRUONG_BP_CKV,
      LANH_DAO_CKV,
    ],
    isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'DANH SÁCH NHẬN DỰ TOÁN CHI NSNN CỦA CÁC ĐƠN VỊ',
    description: 'DANH SÁCH NHẬN DỰ TOÁN CHI NSNN CỦA CÁC ĐƠN VỊ',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tim-kiem-nhan-du-toan-chi-NSNN-cua-cac-don-vi`,
    Role: [
      NHAN_VIEN_CC,
      NHAN_VIEN_CKV,
    ],
    isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'DANH SÁCH DUYỆT BÁO CÁO PHÂN BỔ GIAO, ĐIỀU CHỈNH DỰ TOÁN TỪ CÁC ĐƠN VỊ CẤP DƯỚI',
    description: 'DANH SÁCH DUYỆT BÁO CÁO PHÂN BỔ GIAO, ĐIỀU CHỈNH DỰ TOÁN TỪ CÁC ĐƠN VỊ CẤP DƯỚI',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/danh-sach-duyet-bao-cao-phan-bo-giao-dieu-chinh-du-toan`,
    Role: [
      NHAN_VIEN_TC
    ],
    isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'KIỂM TRA TÌNH TRẠNG NHẬN DỰ TOÁN CHI CỦA ĐƠN VỊ CẤP DƯỚI',
    description: 'KIỂM TRA TÌNH TRẠNG NHẬN DỰ TOÁN CHI CỦA ĐƠN VỊ CẤP DƯỚI',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc`,
    Role: [

      NHAN_VIEN_CKV,
      NHAN_VIEN_TC,

    ],
    isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'PHÊ DUYỆT PHƯƠNG ÁN TẠI ĐƠN VỊ',
    description: 'PHÊ DUYỆT PHƯƠNG ÁN TẠI ĐƠN VỊ',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/duyet-phuong-an-tai-don-vi`,
    Role: [
      TRUONG_BP_TC,
      LANH_DAO_TC,
      TRUONG_BP_CKV,
      LANH_DAO_CKV,
    ],
    isDisabled: false,
  },
];
