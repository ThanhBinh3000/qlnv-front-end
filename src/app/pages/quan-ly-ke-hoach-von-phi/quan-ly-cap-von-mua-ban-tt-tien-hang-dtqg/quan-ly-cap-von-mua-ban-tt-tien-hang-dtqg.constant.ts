import { QuanLyCapVonMuaBanTtTienHangDtqg } from './quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.type';
import { MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI, MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG } from '../../../constants/routerUrl';
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

export const QUAN_LY_CAP_VOM_MUA_BAN_TT_TIEN_HANG_DTQG_LIST: QuanLyCapVonMuaBanTtTienHangDtqg[] = [
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách nhận cấp ứng vốn từ đơn vị cấp trên',
		description: 'Danh sách nhận cấp vốn ứng từ đơn vị cấp trên tại tổng cục',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/ghi-nhan-tai-tong-cuc/0`,
		Role: [
			NHAN_VIEN_TC,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Phê duyệt nhận cấp ứng vốn từ đơn vị cấp trên',
		description: 'Phê duyệt nhận cấp vốn ứng từ đơn vị cấp trên tại tổng cục',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/ghi-nhan-tai-tong-cuc/1`,
		Role: [
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách nhận cấp ứng vốn từ đơn vị cấp trên',
		description: 'Danh sách nhận cấp vốn ứng từ đơn vị cấp trên',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/ghi-nhan-tai-cuc-kv-chi-cuc/0`,
		Role: [
			NHAN_VIEN_CKV,
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
			NHAN_VIEN_CC,
			TRUONG_BP_CC,
			LANH_DAO_CC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Phê duyệt nhận cấp ứng vốn từ đơn vị cấp trên',
		description: 'Phê duyệt nhận cấp vốn ứng từ đơn vị cấp trên',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/ghi-nhan-tai-cuc-kv-chi-cuc/1`,
		Role: [
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
			TRUONG_BP_CC,
			LANH_DAO_CC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách cấp vốn ứng cho đơn vị cấp dưới',
		description: 'Danh sách cấp vốn ứng cho đơn vị cấp dưới',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/danh-sach-cap-von-ung-von-cho-don-vi-cap-duoi/0`,
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
		title: 'Phê duyệt cấp vốn ứng cho đơn vị cấp dưới',
		description: 'Phê duyệt cấp vốn ứng cho đơn vị cấp dưới',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/danh-sach-cap-von-ung-von-cho-don-vi-cap-duoi/1`,
		Role: [
			TRUONG_BP_TC,
			LANH_DAO_TC,
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách nộp tiền vốn bán hàng lên đơn vị cấp trên',
		description: 'Danh sách nộp tiền vốn bán hàng lên đơn vị cấp trên',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/danh-sach-nhap-von-ban-hang/0`,
		Role: [
			NHAN_VIEN_CKV,
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
			NHAN_VIEN_CC,
			TRUONG_BP_CC,
			LANH_DAO_CC,
			NHAN_VIEN_TC,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Phê duyệt nộp tiền vốn bán hàng lên đơn vị cấp trên',
		description: 'Phê duyệt nộp tiền vốn bán hàng lên đơn vị cấp trên',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/danh-sach-nhap-von-ban-hang/1`,
		Role: [
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
			TRUONG_BP_CC,
			LANH_DAO_CC,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách ghi nhận tiền vốn bán hàng từ đơn vị cấp dưới',
		description: 'Danh sách ghi nhận tiền vốn bán hàng từ đơn vị cấp dưới',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/danh-sach-ghi-nhan-von-ban-hang/0`,
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
		title: 'Phê duyệt ghi nhận tiền vốn bán hàng từ đơn vị cấp dưới',
		description: 'Phê duyệt ghi nhận tiền vốn bán hàng từ đơn vị cấp dưới',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/danh-sach-ghi-nhan-von-ban-hang/1`,
		Role: [
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách nộp tiền thừa lên đơn vị cấp trên',
		description: 'Danh sách nộp tiền thừa lên đơn vị cấp trên',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/danh-sach-nop-tien-thua/0`,
		Role: [
			NHAN_VIEN_CKV,
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
			NHAN_VIEN_CC,
			TRUONG_BP_CC,
			LANH_DAO_CC,
			NHAN_VIEN_TC,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Phê duyệt nộp tiền thừa lên đơn vị cấp trên',
		description: 'Phê duyệt nộp tiền thừa lên đơn vị cấp trên',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/danh-sach-nop-tien-thua/1`,
		Role: [
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
			TRUONG_BP_CC,
			LANH_DAO_CC,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách ghi nhận tiền vốn thừa từ đơn vị cấp dưới',
		description: 'Danh sách ghi nhận tiền vốn thừa từ đơn vị cấp dưới',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/danh-sach-ghi-nhan-tien-von-thua/0`,
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
		title: 'Phê duyệt ghi nhận tiền vốn thừa từ đơn vị cấp dưới',
		description: 'Phê duyệt ghi nhận tiền vốn thừa từ đơn vị cấp dưới',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/danh-sach-ghi-nhan-tien-von-thua/1`,
		Role: [
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Danh sách thanh toán cho khách hàng',
		description: 'Danh sách thanh toán cho khách hàng',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/danh-sach-thanh-toan-cho-khach-hang/0`,
		Role: [
			NHAN_VIEN_CKV,
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
			NHAN_VIEN_CC,
			TRUONG_BP_CC,
			LANH_DAO_CC,
			NHAN_VIEN_TC,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Phê duyệt thanh toán cho khách hàng',
		description: 'Phê duyệt thanh toán cho khách hàng',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_CAP_VON_MUA_BAN_TT_TIEN_HANG_DTQG}/danh-sach-thanh-toan-cho-khach-hang/1`,
		Role: [
			TRUONG_BP_CKV,
			LANH_DAO_CKV,
			TRUONG_BP_CC,
			LANH_DAO_CC,
			TRUONG_BP_TC,
			LANH_DAO_TC,
		],
		isDisabled: false,
	},
];

export const TRANG_THAI_TIM_KIEM_CON = [
	{
		id: Utils.TT_BC_1,
		tenDm: "Đang soạn",
	},
	{
		id: Utils.TT_BC_2,
		tenDm: "Trình duyệt",
	},
	{
		id: Utils.TT_BC_3,
		tenDm: "Trưởng BP từ chối",
	},
	{
		id: Utils.TT_BC_4,
		tenDm: "Trưởng BP duyệt",
	},
	{
		id: Utils.TT_BC_5,
		tenDm: "Lãnh đạo từ chối",
	},
	{
		id: Utils.TT_BC_7,
		tenDm: "Lãnh đạo phê duyệt",
	},
]

export const TRANG_THAI_TIM_KIEM_CHA = [
	{
		id: Utils.TT_BC_1,
		tenDm: "Mới",
	},
	{
		id: Utils.TT_BC_2,
		tenDm: "Trình duyệt",
	},
	{
		id: Utils.TT_BC_3,
		tenDm: "Trưởng BP từ chối",
	},
	{
		id: Utils.TT_BC_4,
		tenDm: "Trưởng BP duyệt",
	},
	{
		id: Utils.TT_BC_5,
		tenDm: "Lãnh đạo từ chối",
	},
	{
		id: Utils.TT_BC_7,
		tenDm: "Lãnh đạo phê duyệt",
	},
]
