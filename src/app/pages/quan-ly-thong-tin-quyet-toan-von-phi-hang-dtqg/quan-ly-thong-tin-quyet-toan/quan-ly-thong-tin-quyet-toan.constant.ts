import { MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN, MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG } from '../../../constants/routerUrl';
import { ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, Utils } from './../../../Utility/utils';
import { QuanLyThongTinQuyetToan } from './quan-ly-thong-tin-quyet-toan.type';

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

export const QUAN_LY_THONG_TIN_QUYET_TOAN_LIST: QuanLyThongTinQuyetToan[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách báo cáo quyết toán vốn, phí hàng DTQG.',
    description: 'Danh sách báo cáo quyết toán vốn, phí hàng DTQG.',
    url: `/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG}/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN}/danh-sach-bao-cao-quyet-toan-von-phi-hang-DTQG`,
    Role: [
      NHAN_VIEN_TC,
      TRUONG_BP_TC,
      LANH_DAO_TC
    ],
    isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách điều chỉnh số liệu sau quyết toán',
    description: 'Danh sách điều chỉnh số liệu sau quyết toán',
    url: `/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG}/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN}/danh-sach-bao-cao-dieu-chinh-quyet-toan-von-phi-hang-DTQG`,
    Role: [
      NHAN_VIEN_TC,
      TRUONG_BP_TC,
      LANH_DAO_TC
    ],
    isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Duyệt và phê duyệt báo cáo quyết toán ',
    description: 'Duyệt và phê duyệt báo cáo quyết toán ',
    url: `/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG}/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN}/duyet-phe-duyet-bao-cao`,
    Role: [
      TRUONG_BP_TC,
      LANH_DAO_TC
    ],
    isDisabled: false,
  },

];
