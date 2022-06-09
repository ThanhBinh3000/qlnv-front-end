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
				"role": Utils.NHAN_VIEN,
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
		title: 'Tổng hợp',
		description: 'Danh sách công văn đề nghị cấp vốn',
		url: `/${MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG}/${MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN}/tong-hop`,
		role: [
			{
				"unit": Utils.TONG_CUC,
				"role": Utils.NHAN_VIEN,
			},
			{
				"unit": Utils.TONG_CUC,
				"role": Utils.LANH_DAO,
			},
		],
		isDisabled: false, 
	},
];
