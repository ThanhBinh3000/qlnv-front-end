import { CVNC, ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import { CAP_VON_NGUON_CHI, MAIN_ROUTE_CAPVON } from '../quan-ly-ke-hoach-von-phi-hang.constant';
import { QuanLyCapNguonVonChiNSNN } from './quan-ly-cap-nguon-von-chi.type';

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

export const QUAN_LY_CAP_NGUON_VON_CHI_NSNN_LIST: QuanLyCapNguonVonChiNSNN[] = [
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách công văn đề nghị cấp vốn',
		description: 'Danh sách công văn đề nghị cấp vốn',
		url: `/${MAIN_ROUTE_CAPVON}/${CAP_VON_NGUON_CHI}/tim-kiem/0`,
		Role: [
			// NHAN_VIEN_CKV,
			// TRUONG_BP_CKV,
			// LANH_DAO_CKV,
			// NHAN_VIEN_TC,
			// TRUONG_BP_TC,
			// LANH_DAO_TC,
			CVNC.VIEW_DN_MLT,
			CVNC.VIEW_DN_MVT,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Phê duyệt công văn đề nghị cấp vốn',
		description: 'Danh sách công văn đề nghị cấp vốn',
		url: `/${MAIN_ROUTE_CAPVON}/${CAP_VON_NGUON_CHI}/tim-kiem/1`,
		Role: [
			// LANH_DAO_CKV,
			// LANH_DAO_TC,
			CVNC.PHE_DUYET_DN_MLT,
			CVNC.PHE_DUYET_DN_MVT,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Tổng hợp danh sách công văn đề nghị cấp vốn',
		description: 'Tổng hợp danh sách công văn đề nghị cấp vốn',
		url: `/${MAIN_ROUTE_CAPVON}/${CAP_VON_NGUON_CHI}/tong-hop/0`,
		Role: [
			// NHAN_VIEN_TC,
			// TRUONG_BP_TC,
			// LANH_DAO_TC,
			CVNC.VIEW_SYNTHETIC_CKV,
			CVNC.VIEW_SYNTHETIC_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Tổng hợp danh sách công văn đề nghị cấp vốn từ cục khu vực',
		description: 'Tổng hợp danh sách công văn đề nghị cấp vốn từ cục khu vực',
		url: `/${MAIN_ROUTE_CAPVON}/${CAP_VON_NGUON_CHI}/danh-sach-de-nghi-tu-cuc-khu-cuc`,
		Role: [
			CVNC.ADD_SYNTHETIC_CKV,
			CVNC.DUYET_SYNTHETIC_TC,
			CVNC.PHE_DUYET_SYNTHETIC_CKV,
			CVNC.PHE_DUYET_SYNTHETIC_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Phê duyệt đề nghị tổng hợp',
		description: 'Phê duyệt đề nghị tổng hợp',
		url: `/${MAIN_ROUTE_CAPVON}/${CAP_VON_NGUON_CHI}/tong-hop/1`,
		Role: [
			// TRUONG_BP_TC,
			// LANH_DAO_TC,
			CVNC.DUYET_SYNTHETIC_CKV,
			CVNC.DUYET_SYNTHETIC_TC,
			CVNC.PHE_DUYET_SYNTHETIC_CKV,
			CVNC.PHE_DUYET_SYNTHETIC_TC,
		],
		isDisabled: false,
	},
];
