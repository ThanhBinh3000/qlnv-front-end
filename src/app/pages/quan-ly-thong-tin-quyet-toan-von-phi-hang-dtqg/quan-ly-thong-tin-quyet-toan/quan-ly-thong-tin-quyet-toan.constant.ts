import { QuanLyThongTinQuyetToan } from './quan-ly-thong-tin-quyet-toan.type';
import {MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG,MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN} from '../../../constants/routerUrl';
export const ROLE_CAN_BO = ['TC_KH_VP_NV','C_KH_VP_NV_KH','C_KH_VP_NV_TVQT','CC_KH_VP_NV'];
export const ROLE_TRUONG_BO_PHAN = ['TC_KH_VP_TBP','C_KH_VP_TBP_TVQT','C_KH_VP_TBP_KH','CC_KH_VP_TBP'];
export const ROLE_LANH_DAO = ['TC_KH_VP_LD','C_KH_VP_LD','CC_KH_VP_LD'];
//**************** */ hang so cho cac cap
//cap chi cuc
export const CHI_CUC = '3';
//cap cuc khu vuc
export const CUC_KHU_VUC = '2';
//cap tong cuc
export const TONG_CUC = '1';

//**************** */ role cua cac can bo
//nhan vien
export const NHAN_VIEN = '3';
//truong bo phan
export const TRUONG_BP = '2';
//lanh dao
export const LANH_DAO = '1';

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

//**************** */ cac trang thai cua bieu mau
//trang thai moi hoac chua danh gia
export const TT_MOI = '1';
//trang thai dang nhap lieu hoac not ok
export const TT_NOT_OK = '2';
//trang thai hoan tat nhap lieu hoac ok
export const TT_OK = '3';

export const QUAN_LY_THONG_TIN_QUYET_TOAN_LIST: QuanLyThongTinQuyetToan[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách báo cáo quyết toán vốn, phí hàng DTQG.',
    description: 'Danh sách báo cáo quyết toán vốn, phí hàng DTQG.',
    url: `/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG}/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN}/danh-sach-bao-cao-quyet-toan-von-phi-hang-DTQG`,
    unRole: [],
		isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách điều chỉnh số liệu sau quyết toán',
    description: 'Danh sách điều chỉnh số liệu sau quyết toán',
    url: `/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG}/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN}/danh-sach-bao-cao-dieu-chinh-quyet-toan-von-phi-hang-DTQG`,
    unRole: [
      
    ],
		isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Duyệt và phê duyệt báo cáo quyết toán ',
    description: 'Duyệt và phê duyệt báo cáo quyết toán ',
    url: `/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG}/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN}/duyet-phe-duyet-bao-cao`,
    unRole: [
      {
				"unit": TONG_CUC,
				"role": 'TC_KH_VP_NV',
			},
    ],
		isDisabled: false,
  },

];
