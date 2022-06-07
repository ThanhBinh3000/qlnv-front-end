import { QuanLyLapThamDinhDuToanNSNN } from './quan-ly-lap-tham-dinh-du-toan-nsnn.type';
import { MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI, MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN } from '../../../constants/routerUrl';

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


export const QUAN_LY_THAM_DINH_DU_TOAN_NSNN_LIST: QuanLyLapThamDinhDuToanNSNN[] = [
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách dự toán NSNN hàng năm và KHTC 03 năm',
		description: 'Danh sách dự toán NSNN hàng năm và KHTC 03 năm',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tim-kiem`,
		unRole: [],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Phê duyệt dự toán NSNN hàng năm và KHTC 03 năm',
		description: 'Phê duyệt dự toán NSNN hàng năm và KHTC 03 năm',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/phe-duyet`,
		unRole: [
			{
				"unit": CHI_CUC,
				"role": NHAN_VIEN,
			},
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Tổng hợp số liệu dự toán NSNN hàng năm và KHTC 03 năm',
		description: 'Tổng hợp số liệu dự toán NSNN hàng năm và KHTC 03 năm',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tong-hop`,
		unRole: [
			{
				"unit": CHI_CUC,
				"role": NHAN_VIEN,
			},
			{
				"unit": CHI_CUC,
				"role": TRUONG_BP,
			},
			{
				"unit": CHI_CUC,
				"role": LANH_DAO,
			},
			{
				"unit": CUC_KHU_VUC,
				"role": TRUONG_BP,
			},
			{
				"unit": CUC_KHU_VUC,
				"role": LANH_DAO,
			},
			{
				"unit": LANH_DAO,
				"role": TRUONG_BP,
			},
			{
				"unit": LANH_DAO,
				"role": LANH_DAO,
			},
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách số kiểm tra trần chi giao từ Bộ tài chính',
		description: 'Danh sách số kiểm tra trần chi giao từ Bộ tài chính',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn/0`,
		unRole: [
			{
				"unit": CHI_CUC,
				"role": NHAN_VIEN,
			},
			{
				"unit": CHI_CUC,
				"role": TRUONG_BP,
			},
			{
				"unit": CHI_CUC,
				"role": LANH_DAO,
			},
			{
				"unit": CUC_KHU_VUC,
				"role": NHAN_VIEN,
			},
			{
				"unit": CUC_KHU_VUC,
				"role": TRUONG_BP,
			},
			{
				"unit": CUC_KHU_VUC,
				"role": LANH_DAO,
			},
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách phương án/QĐ/CV giao số kiểm tra NSNN tại các đơn vị',
		description: 'Danh sách phương án/QĐ/CV giao số kiểm tra NSNN tại các đơn vị',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn/1`,
		unRole: [
			{
				"unit": CHI_CUC,
				"role": NHAN_VIEN,
			},
			{
				"unit": CHI_CUC,
				"role": TRUONG_BP,
			},
			{
				"unit": CHI_CUC,
				"role": LANH_DAO,
			},
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách số kiểm tra chi NSNN tại các đơn vị',
		description: 'Danh sách số kiểm tra chi NSNN tại các đơn vị',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tim-kiem-so-kiem-tra-chi-nsnn`,
		unRole: [
			{
				"unit": CHI_CUC,
				"role": NHAN_VIEN,
			},
			{
				"unit": CHI_CUC,
				"role": TRUONG_BP,
			},
			{
				"unit": CHI_CUC,
				"role": LANH_DAO,
			},
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách nhận số kiểm tra chi NSNN tại các đơn vị',
		description: 'Danh sách nhận số kiểm tra chi NSNN tại các đơn vị',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/nhan-so-kiem-tra-chi-nsnn`,
		unRole: [
			{
				"unit": TONG_CUC,
				"role": NHAN_VIEN,
			},
			{
				"unit": TONG_CUC,
				"role": TRUONG_BP,
			},
			{
				"unit": TONG_CUC,
				"role": LANH_DAO,
			},
		],
		isDisabled: false,
	},
];

export const PHU_LUC = [
	{
		id: '13',
		tenDm: 'Tổng hợp nhu cầu chi ngân sách nhà nước giai đoạn 03 năm',
		tenPl: 'Biểu mẫu số 13',
		status: false,
	},
	{
		id: '14',
		tenDm: 'Tổng hợp nhu cầu chi đầu tư phát triển giai đoạn 3 năm',
		tenPl: 'Biểu mẫu số 14',
		status: false,
	},

	{
		id: '16',
		tenDm: 'Tổng hợp nhu cầu chi thường xuyên giai đoạn 03 năm',
		tenPl: 'Biểu mẫu số 16',
		status: false,
	},
	{
		id: '17',
		tenDm: 'Chi tiết nhu cầu chi thường xuyên giai đoạn 03 năm',
		tenPl: 'Biểu mẫu số 17',
		status: false,
	},
	{
		id: '18',
		tenDm: 'Tổng hợp mục tiêu nhiệm vụ chủ yếu và nhu cầu chi mới giai đoạn 03 năm',
		tenPl: 'Biểu mẫu số 18',
		status: false,
	},
];


