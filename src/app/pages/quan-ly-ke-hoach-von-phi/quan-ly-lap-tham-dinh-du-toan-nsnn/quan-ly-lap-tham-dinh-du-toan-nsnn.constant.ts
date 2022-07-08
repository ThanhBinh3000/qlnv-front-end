import { QuanLyLapThamDinhDuToanNSNN } from './quan-ly-lap-tham-dinh-du-toan-nsnn.type';
import { MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI, MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN } from '../../../constants/routerUrl';
import { ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';

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


export const QUAN_LY_THAM_DINH_DU_TOAN_NSNN_LIST: QuanLyLapThamDinhDuToanNSNN[] = [
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách dự toán NSNN hàng năm và KHTC 03 năm',
		description: 'Danh sách dự toán NSNN hàng năm và KHTC 03 năm',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tim-kiem`,
		Role: [
			NHAN_VIEN_CC,
			TRUONG_BP_CC,
			LANH_DAO_CC,
			NHAN_VIEN_CKV,
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
			NHAN_VIEN_TC,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Phê duyệt dự toán NSNN hàng năm và KHTC 03 năm',
		description: 'Phê duyệt dự toán NSNN hàng năm và KHTC 03 năm',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/phe-duyet`,
		Role: [
			TRUONG_BP_CC,
			LANH_DAO_CC,
			NHAN_VIEN_CKV,
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
			NHAN_VIEN_TC,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Tổng hợp số liệu dự toán NSNN hàng năm và KHTC 03 năm',
		description: 'Tổng hợp số liệu dự toán NSNN hàng năm và KHTC 03 năm',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tong-hop`,
		Role: [
			NHAN_VIEN_CKV,
			NHAN_VIEN_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách số kiểm tra trần chi nhận từ Bộ tài chính',
		description: 'Danh sách số kiểm tra trần chi nhận từ Bộ tài chính',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn/0`,
		Role: [
			NHAN_VIEN_TC,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách phương án/QĐ/CV giao số kiểm tra NSNN tại các đơn vị',
		description: 'Danh sách phương án/QĐ/CV giao số kiểm tra NSNN tại các đơn vị',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn/1`,
		Role: [
			NHAN_VIEN_CKV,
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
			NHAN_VIEN_TC,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách số kiểm tra chi NSNN tại các đơn vị',
		description: 'Danh sách số kiểm tra chi NSNN tại các đơn vị',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tim-kiem-so-kiem-tra-chi-nsnn`,
		Role: [
			NHAN_VIEN_CKV,
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
			NHAN_VIEN_TC,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách nhận số kiểm tra chi NSNN tại các đơn vị',
		description: 'Danh sách nhận số kiểm tra chi NSNN tại các đơn vị',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/nhan-so-kiem-tra-chi-nsnn`,
		Role: [
			NHAN_VIEN_CC,
			TRUONG_BP_CC,
			LANH_DAO_CC,
			NHAN_VIEN_CKV,
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
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


