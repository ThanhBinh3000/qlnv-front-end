import { QuanLyCapNguonVonChiNSNN } from './quan-ly-cap-nguon-von-chi.type';
import { MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG, MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN } from '../../../constants/routerUrl';
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

export const QUAN_LY_CAP_NGUON_VON_CHI_NSNN_LIST: QuanLyCapNguonVonChiNSNN[] = [
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách công văn đề nghị cấp vốn',
		description: 'Danh sách công văn đề nghị cấp vốn',
		url: `/${MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG}/${MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN}/tim-kiem/0`,
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
		title: 'Phê duyệt công văn đề nghị cấp vốn',
		description: 'Danh sách công văn đề nghị cấp vốn',
		url: `/${MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG}/${MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN}/tim-kiem/1`,
		Role: [
			LANH_DAO_CKV,
			LANH_DAO_TC,
		],
		isDisabled: false, 
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Tổng hợp danh sách công văn đề nghị cấp vốn',
		description: 'Tổng hợp danh sách công văn đề nghị cấp vốn',
		url: `/${MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG}/${MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN}/tong-hop/0`,
		Role: [
			NHAN_VIEN_TC,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false, 
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Tổng hợp danh sách công văn đề nghị cấp vốn từ cục khu vực',
		description: 'Tổng hợp danh sách công văn đề nghị cấp vốn từ cục khu vực',
		url: `/${MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG}/${MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN}/danh-sach-de-nghi-tu-cuc-khu-cuc`,
		Role: [
			NHAN_VIEN_TC,
		],
		isDisabled: false, 
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Phê duyệt đề nghị tổng hợp',
		description: 'Phê duyệt đề nghị tổng hợp',
		url: `/${MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG}/${MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN}/tong-hop/1`,
		Role: [
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false, 
	},
];
