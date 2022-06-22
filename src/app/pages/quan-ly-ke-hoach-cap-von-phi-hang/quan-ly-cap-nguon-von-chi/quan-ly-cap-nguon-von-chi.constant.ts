import { QuanLyCapNguonVonChiNSNN } from './quan-ly-cap-nguon-von-chi.type';
import { MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG, MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN } from '../../../constants/routerUrl';
import { Utils } from 'src/app/Utility/utils';

export const QUAN_LY_CAP_NGUON_VON_CHI_NSNN_LIST: QuanLyCapNguonVonChiNSNN[] = [
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách công văn đề nghị cấp vốn',
		description: 'Danh sách công văn đề nghị cấp vốn',
		url: `/${MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG}/${MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN}/tim-kiem/0`,
		role: [
			{
				"unit": Utils.CUC_KHU_VUC,
				"role": Utils.NHAN_VIEN,
			},
			{
				"unit": Utils.CUC_KHU_VUC,
				"role": Utils.TRUONG_BO_PHAN,
			},
			{
				"unit": Utils.CUC_KHU_VUC,
				"role": Utils.LANH_DAO,
			},
			{
				"unit": Utils.TONG_CUC,
				"role": Utils.NHAN_VIEN,
			},
			{
				"unit": Utils.TONG_CUC,
				"role": Utils.TRUONG_BO_PHAN,
			},
			{
				"unit": Utils.TONG_CUC,
				"role": Utils.LANH_DAO,
			},
		],
		isDisabled: false, 
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Phê duyệt công văn đề nghị cấp vốn',
		description: 'Danh sách công văn đề nghị cấp vốn',
		url: `/${MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG}/${MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN}/tim-kiem/1`,
		role: [
			{
				"unit": Utils.CUC_KHU_VUC,
				"role": Utils.LANH_DAO,
			},
			{
				"unit": Utils.TONG_CUC,
				"role": Utils.LANH_DAO,
			},
		],
		isDisabled: false, 
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Tổng hợp danh sách công văn đề nghị cấp vốn',
		description: 'Tổng hợp danh sách công văn đề nghị cấp vốn',
		url: `/${MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG}/${MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN}/tong-hop/0`,
		role: [
			{
				"unit": Utils.TONG_CUC,
				"role": Utils.NHAN_VIEN,
			},
			{
				"unit": Utils.TONG_CUC,
				"role": Utils.TRUONG_BO_PHAN,
			},
			{
				"unit": Utils.TONG_CUC,
				"role": Utils.LANH_DAO,
			},
		],
		isDisabled: false, 
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Tổng hợp danh sách công văn đề nghị cấp vốn từ cục khu vực',
		description: 'Tổng hợp danh sách công văn đề nghị cấp vốn từ cục khu vực',
		url: `/${MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG}/${MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN}/danh-sach-de-nghi-tu-cuc-khu-cuc`,
		role: [
			{
				"unit": Utils.TONG_CUC,
				"role": Utils.NHAN_VIEN,
			},
		],
		isDisabled: false, 
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Phê duyệt đề nghị tổng hợp',
		description: 'Phê duyệt đề nghị tổng hợp',
		url: `/${MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG}/${MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN}/tong-hop/1`,
		role: [
			{
				"unit": Utils.TONG_CUC,
				"role": Utils.TRUONG_BO_PHAN,
			},
			{
				"unit": Utils.TONG_CUC,
				"role": Utils.LANH_DAO,
			},
		],
		isDisabled: false, 
	},
];
