import { Utils, ROLE_CAN_BO, ROLE_TRUONG_BO_PHAN, ROLE_LANH_DAO } from './../../../Utility/utils';
import { QuanLyDieuChinhDuToanChiNSNN } from './quan-ly-dieu-chinh-du-toan-chi-nsnn.type';
import { MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI, MAIN_ROUTE_QUAN_LY_DIEU_CHINH_DU_TOAN_CHI_NSNN } from '../../../constants/routerUrl';

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

// //**************** */ hang so cho cac cap
// //cap chi cuc
// export const CHI_CUC = '3';
// //cap cuc khu vuc
// export const CUC_KHU_VUC = '2';
// //cap tong cuc
// export const TONG_CUC = '1';

// //**************** */ role cua cac can bo
// //nhan vien
// export const NHAN_VIEN = '3';
// //truong bo phan
// export const TRUONG_BP = '2';
// //lanh dao
// export const LANH_DAO = '1';

// //**************** */ cac trang thai cua bao cao
// //trang thai dang soan
// export const TT_DANG_SOAN = '1';
// //trang thai trinh duyet
// export const TT_TRINH_DUYET = '2';
// //trang thai truong bo phan tu choi
// export const TT_TBP_TU_CHOI = '3';
// //trang thai truong bo phan chap nhan
// export const TT_TBP_CHAP_NHAN = '4';
// //trang thai lanh dao tu choi
// export const TT_LD_TU_CHOI = '5';
// //trang thai lanh dao chap nhan
// export const TT_LD_CHAP_NHAN = '6';
// //trang thai don vi cap tren tu choi
// export const TT_TU_CHOI = '7';
// //trang thai don vi cap tren chap nhan
// export const TT_CHAP_NHAN = '8';

// //**************** */ cac trang thai cua bieu mau
// //trang thai moi hoac chua danh gia
// export const TT_MOI = '1';
// //trang thai dang nhap lieu hoac not ok
// export const TT_NOT_OK = '2';
// //trang thai hoan tat nhap lieu hoac ok
// export const TT_OK = '3';


export const QUAN_LY_DIEU_CHINH_DU_TOAN_NSNN_LIST: QuanLyDieuChinhDuToanChiNSNN[] = [
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Tìm kiếm',
		description: 'Tìm kiếm điều chỉnh dự toán chi NSNN',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_DIEU_CHINH_DU_TOAN_CHI_NSNN}/tim-kiem-dieu-chinh-du-toan-chi-NSNN`,
		Role: [
      NHAN_VIEN_CC,
      NHAN_VIEN_CKV,
      NHAN_VIEN_TC,
      TRUONG_BP_CC,
      TRUONG_BP_CKV,
      TRUONG_BP_TC,
      LANH_DAO_CC,
      LANH_DAO_CKV,
      LANH_DAO_TC
    ],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Phê duyệt báo cáo điều chỉnh dự toán chi NSNN',
		description: 'Phê duyệt báo cáo điều chỉnh dự toán chi NSNN',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_DIEU_CHINH_DU_TOAN_CHI_NSNN}/phe-duyet-bao-cao-dieu-chinh`,
    Role: [
			NHAN_VIEN_CKV,
      NHAN_VIEN_TC,
      TRUONG_BP_CC,
      TRUONG_BP_CKV,
      TRUONG_BP_TC,
      LANH_DAO_CC,
      LANH_DAO_CKV,
      LANH_DAO_TC
		],
		isDisabled: false,
	},
  {
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Tổng hợp số liệu Điều chỉnh dự toán chi NSNN',
		description: 'Tổng hợp số liệu Điều chỉnh dự toán chi NSNN',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_DIEU_CHINH_DU_TOAN_CHI_NSNN}/tong-hop-dieu-chinh-du-toan-chi-NSNN`,
		Role: [
			NHAN_VIEN_CKV,
      NHAN_VIEN_TC,
		],
		isDisabled: false,
	},
];

export const PHU_LUC = [
	{
		id: '1',
		tenDm: 'Tổng hợp điều chỉnh dự toán chi ngân sách nhà nước đợt 1/năm ',
		tenPl: 'Phụ lục 01',
		status: false,
	},
	{
		id: '2',
		tenDm: 'Dự toán phí nhập xuất hàng DTQG năm ',
		tenPl: 'Phụ lục 02',
		status: false,
	},
	{
		id: '3',
		tenDm: 'Dự toán phí viện trợ cứu trợ năm ',
		tenPl: 'Phụ lục 03',
		status: false,
	},
	{
		id: '4',
		tenDm: 'Dự toán phí bảo quản hàng DTQG năm ',
		tenPl: 'Phụ lục 04',
		status: false,
	},
	{
		id: '5',
		tenDm: 'Bảng lương năm ',
		tenPl: 'Phụ lục 05',
		status: false,
	},
	{
		id: '6',
		tenDm: 'Báo cáo tình hình thực hiện phí nhập xuất, VTCT hàng dự trữ quốc gia năm ',
		tenPl: 'Phụ lục 06',
		status: false,
	},
	{
		id: '7',
		tenDm: 'Báo cáo tình hình thực hiện phí bảo quản hàng dự trữ quốc gia theo định mức năm ',
		tenPl: 'Phụ lục 07',
		status: false,
	},
	{
		id: '8',
		tenDm: 'Bảng tổng hợp tình hình thực hiện điều chỉnh dự toán cải tạo sửa chữa lớn kho DTQG năm ',
		tenPl: 'Phụ lục 08',
		status: false,
	},
];

