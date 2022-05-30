import { QuanLyDieuChinhDuToanChiNSNN } from './quan-ly-dieu-chinh-du-toan-chi-nsnn.type';
import { MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI, MAIN_ROUTE_QUAN_LY_DIEU_CHINH_DU_TOAN_CHI_NSNN } from '../../../constants/routerUrl';

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


export const QUAN_LY_DIEU_CHINH_DU_TOAN_NSNN_LIST: QuanLyDieuChinhDuToanChiNSNN[] = [
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Tìm kiếm',
		description: 'Tìm kiếm điều chỉnh dự toán chi NSNN',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_DIEU_CHINH_DU_TOAN_CHI_NSNN}/tim-kiem-dieu-chinh-du-toan-chi-NSNN`,
		unRole: [],
		isDisabled: false,
	},
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Phê duyệt báo cáo điều chỉnh dự toán chi NSNN',
		description: 'Phê duyệt báo cáo điều chỉnh dự toán chi NSNN',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_DIEU_CHINH_DU_TOAN_CHI_NSNN}/phe-duyet-bao-cao-dieu-chinh`,
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
		title: 'Tổng hợp số liệu Điều chỉnh dự toán chi NSNN',
		description: 'Tổng hợp số liệu Điều chỉnh dự toán chi NSNN',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_DIEU_CHINH_DU_TOAN_CHI_NSNN}/tong-hop-dieu-chinh-du-toan-chi-NSNN`,
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
	// {
	// 	icon: 'htvbdh_tcdt_icon-common',
	// 	title: 'Tổng hợp',
	// 	description: 'Tổng hợp số liệu dự toán NSNN hàng năm và KHTC 03 năm',
	// 	url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tong-hop`,
	// 	unRole: [
	// 		{
	// 			"unit": CHI_CUC,
	// 			"role": NHAN_VIEN,
	// 		},
	// 		{
	// 			"unit": CHI_CUC,
	// 			"role": TRUONG_BP,
	// 		},
	// 		{
	// 			"unit": CHI_CUC,
	// 			"role": LANH_DAO,
	// 		},
	// 		{
	// 			"unit": CUC_KHU_VUC,
	// 			"role": TRUONG_BP,
	// 		},
	// 		{
	// 			"unit": CUC_KHU_VUC,
	// 			"role": LANH_DAO,
	// 		},
	// 		{
	// 			"unit": LANH_DAO,
	// 			"role": TRUONG_BP,
	// 		},
	// 		{
	// 			"unit": LANH_DAO,
	// 			"role": LANH_DAO,
	// 		},
	// 	],
	// 	isDisabled: false,
	// },
	// {
	// 	icon: 'htvbdh_tcdt_icon-common',
	// 	title: 'Tìm kiếm',
	// 	description: 'Tìm kiếm phương án/QĐ/CV giao số kiểm tra NSNN tại các đơn vị',
	// 	url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn`,
	// 	unRole: [
	// 		{
	// 			"unit": CHI_CUC,
	// 			"role": NHAN_VIEN,
	// 		},
	// 		{
	// 			"unit": CHI_CUC,
	// 			"role": TRUONG_BP,
	// 		},
	// 		{
	// 			"unit": CHI_CUC,
	// 			"role": LANH_DAO,
	// 		},
	// 	],
	// 	isDisabled: false,
	// },
	// {
	// 	icon: 'htvbdh_tcdt_icon-common',
	// 	title: 'Tìm kiếm',
	// 	description: 'Tìm kiếm số kiểm tra chi NSNN tại các đơn vị',
	// 	url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tim-kiem-so-kiem-tra-chi-nsnn`,
	// 	unRole: [],
	// 	isDisabled: false,
	// },
];

export const PHU_LUC = [
	{
		id: '1',
		tenDm: 'Tổng hợp điều chỉnh dự toán chi ngân sách nhà nước đợt 1/năm N',
		tenPl: 'Phụ lục 01',
		status: false,
	},
	{
		id: '2',
		tenDm: 'Dự toán phí nhập xuất hàng DTQG năm N',
		tenPl: 'Phụ lục 02',
		status: false,
	},
	{
		id: '3',
		tenDm: 'Dự toán phí viện trợ cứu trợ năm N',
		tenPl: 'Phụ lục 03',
		status: false,
	},
	{
		id: '4',
		tenDm: 'Dự toán phí bảo quản hàng DTQG năm N',
		tenPl: 'Phụ lục 04',
		status: false,
	},
	{
		id: '5',
		tenDm: 'Bảng lương năm N',
		tenPl: 'Phụ lục 05',
		status: false,
	},
	{
		id: '6',
		tenDm: 'Báo cáo tình hình thực hiện phí nhập xuất, VTCT hàng dự trữ quốc gia năm N',
		tenPl: 'Phụ lục 06',
		status: false,
	},
	{
		id: '7',
		tenDm: 'Báo cáo tình hình thực hiện phí bảo quản hàng dự trữ quốc gia theo định mức năm N',
		tenPl: 'Phụ lục 07',
		status: false,
	},
	{
		id: '8',
		tenDm: 'Bảng tổng hợp tình hình thực hiện điều chỉnh dự toán cải tạo sửa chữa lớn kho DTQG năm N',
		tenPl: 'Phụ lục 08',
		status: false,
	},
];



export const TRANGTHAIBAOCAO = [
	{
		id: TT_DANG_SOAN,
		tenDm: "Đang soạn",
	},
	{
		id: TT_TRINH_DUYET,
		tenDm: "Trình duyệt",
	},
	{
		id: TT_TBP_TU_CHOI,
		tenDm: "Trưởng BP từ chối",
	},
	{
		id: TT_TBP_CHAP_NHAN,
		tenDm: "Trưởng BP duyệt",
	},
	{
		id: TT_LD_TU_CHOI,
		tenDm: "Lãnh đạo từ chối",
	},
	{
		id: TT_LD_CHAP_NHAN,
		tenDm: "Lãnh đạo phê duyệt",
	},
	{
		id: TT_TU_CHOI,
		tenDm: 'Từ chối'
	},
	{
		id: TT_CHAP_NHAN,
		tenDm: 'Chấp nhận'
	},
];


export const TRANGTHAIPHULUC = [
	{
		id: '1',
		tenDm: "Chưa đánh giá",
	},
	{
		id: '2',
		tenDm: "OK",
	},
	{
		id: '3',
		tenDm: "Not OK",
	},
];

export class Role {

	//role luu bao cao
	public static roleSaveReport = {
		"status": [TT_DANG_SOAN, TT_TBP_TU_CHOI, TT_LD_TU_CHOI, TT_TU_CHOI],
		"role": [NHAN_VIEN],
	}
	//role xoa bao cao
	public static roleDelReport = {
		"status": [TT_DANG_SOAN, TT_TBP_TU_CHOI, TT_LD_TU_CHOI, TT_TU_CHOI],
		"role": [NHAN_VIEN],
	}
	//role trinh duyet bao cao
	public static roleApproveReport = {
		"status": [TT_DANG_SOAN],
		"role": [NHAN_VIEN],
	}
	//role TBP tu choi bao cao
	public static roleTBPRejectReport = {
		"status": [TT_TRINH_DUYET],
		"role": [TRUONG_BP],
	}
	//role TBP chap nhan bao cao
	public static roleTBPAcceptReport = {
		"status": [TT_TRINH_DUYET],
		"role": [TRUONG_BP],
	}
	//role LD tu choi bao cao
	public static roleLDRejectReport = {
		"status": [TT_TBP_CHAP_NHAN],
		"role": [LANH_DAO],
	}
	//role LD chap nhan bao cao
	public static roleLDAcceptReport = {
		"status": [TT_TBP_CHAP_NHAN],
		"role": [LANH_DAO],
	}
	//role don vi cap tren tu choi bao cao
	public static roleDVCTRejectReport = {
		"status": [TT_LD_CHAP_NHAN],
		"role": [NHAN_VIEN],
	}
	//role don vi cap tren chap nhan bao cao
	public static roleDVCTAcceptReport = {
		"status": [TT_LD_CHAP_NHAN],
		"role": [NHAN_VIEN],
	}
	//role hoan thanh nhap lieu
	public static btnRoleDone = {
		"status": [TT_NOT_OK],
		"role": ['3'],
	}
	public static btnRoleOK = {
		"status": ['4'],
		"role": ['1', '2'],
	}
	public static btnRoleSaveBM = {
		"status": ['1', '2'],
		"role": ['3'],
	}

	//get role luu bao cao
	public getRoleSaveReport(status: any, unit: any, role: any) {
		return !(Role.roleSaveReport.status.includes(status) && unit == true && Role.roleSaveReport.role.includes(role));
	}
	//get role xoa bao cao
	public getRoleDelReport(status: any, unit: any, role: any) {
		return !(Role.roleDelReport.status.includes(status) && unit == true && Role.roleDelReport.role.includes(role));
	}
	//get role trinh duyet bao cao
	public getRoleApproveReport(status: any, unit: any, role: any) {
		return !(Role.roleApproveReport.status.includes(status) && unit == true && Role.roleApproveReport.role.includes(role));
	}
	//get role TBP tu choi bao cao
	public getRoleTBPRejectReport(status: any, unit: any, role: any) {
		return !(Role.roleTBPRejectReport.status.includes(status) && unit == true && Role.roleTBPRejectReport.role.includes(role));
	}
	//get role TBP chap nhan bao cao
	public getRoleTBPAcceptReport(status: any, unit: any, role: any) {
		return !(Role.roleTBPAcceptReport.status.includes(status) && unit == true && Role.roleTBPAcceptReport.role.includes(role));
	}
	//get role lanh dao tu choi bao cao
	public getRoleLDRejectReport(status: any, unit: any, role: any) {
		return !(Role.roleLDRejectReport.status.includes(status) && unit == true && Role.roleLDRejectReport.role.includes(role));
	}
	//get role lanh dao chap nhan bao cao
	public getRoleLDAcceptReport(status: any, unit: any, role: any) {
		return !(Role.roleLDAcceptReport.status.includes(status) && unit == true && Role.roleLDAcceptReport.role.includes(role));
	}
	//get role don vi cap tren tu choi bao cao
	public getRoleDVCTRejectReport(status: any, unit: any, role: any) {
		return !(Role.roleDVCTRejectReport.status.includes(status) && unit == true && Role.roleDVCTRejectReport.role.includes(role));
	}
	//get role don vi cap tren chap nhan bao cao
	public getRoleDVCTAcceptReport(status: any, unit: any, role: any) {
		return !(Role.roleDVCTAcceptReport.status.includes(status) && unit == true && Role.roleDVCTAcceptReport.role.includes(role));
	}

	public getRoleDone(status: string, role: any) {
		return !(Role.btnRoleDone.status.includes(status) && Role.btnRoleDone.role.includes(role));
	}

	public getRoleOK(status: string, role: any) {
		return !(Role.btnRoleOK.status.includes(status) && Role.btnRoleOK.role.includes(role));
	}

	public getRoleSaveBM(status: string, role: any) {
		return !(Role.btnRoleSaveBM.status.includes(status) && Role.btnRoleSaveBM.role.includes(role));
	}
}

