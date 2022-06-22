import { QuanLyGiaoDuToanChiNSNN } from './quan-ly-giao-du-toan-chi-nsnn.type';
import {MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI, MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN} from '../../../constants/routerUrl';

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


export const QUAN_LY_GIAO_DU_TOAN_CHI_NSNN_LIST: QuanLyGiaoDuToanChiNSNN[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Nhập quyết định giao dự toán chi NSNN',
    description: 'Nhập quyết định giao dự toán chi NSNN',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN`,
    unRole: [
      {
				"unit": CHI_CUC,
				"role": 'CC_KH_VP_NV',
			},
      {
        "unit": CHI_CUC,
        "role": 'CC_KH_VP_TBP',
      },
      {
        "unit": CHI_CUC,
        "role": 'CC_KH_VP_LD',
      },
      {
				"unit": CUC_KHU_VUC,
				"role": 'C_KH_VP_NV_KH',
			},
			{
				"unit": CUC_KHU_VUC,
				"role": 'C_KH_VP_TBP_KH',
			},
			{
				"unit": CUC_KHU_VUC,
				"role": 'C_KH_VP_LD',
			},
			{
				"unit": TONG_CUC,
				"role": 'TC_KH_VP_TBP',
			},
			{
				"unit": LANH_DAO,
				"role": 'TC_KH_VP_LD',
			},
    ],
		isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Tìm kiếm Phương án phân bổ giao dự toán chi NSNN cho các đơn vị',
    description: 'Tìm kiếm Phương án phân bổ giao dự toán chi NSNN cho các đơn vị',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi`,
    unRole: [
      {
				"unit": CHI_CUC,
				"role": 'CC_KH_VP_NV',
			},
      {
        "unit": CHI_CUC,
        "role": 'CC_KH_VP_TBP',
      },
      {
        "unit": CHI_CUC,
        "role": 'CC_KH_VP_LD',
      },
    ],
		isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Tìm kiếm giao dự toán chi NSNN của các đơn vị',
    description: 'Tìm kiếm giao dự toán chi NSNN của các đơn vị',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi`,
    unRole: [],
		isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Tìm kiếm nhận dự toán chi NSNN của các đơn vị',
    description: 'Tìm kiếm nhận dự toán chi NSNN của các đơn vị',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tim-kiem-nhan-du-toan-chi-NSNN-cua-cac-don-vi`,
    unRole: [
      {
				"unit": TONG_CUC,
				"role": 'TC_KH_VP_NV',
			},
    ],
		isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách duyệt báo cáo phân bổ giao, điều chỉnh dự toán',
    description: 'Danh sách duyệt báo cáo phân bổ giao, điều chỉnh dự toán',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/danh-sach-duyet-bao-cao-phan-bo-giao-dieu-chinh-du-toan`,
    unRole: [
      {
				"unit": CHI_CUC,
				"role": 'CC_KH_VP_NV',
			},
      {
        "unit": CHI_CUC,
        "role": 'CC_KH_VP_TBP',
      },
      {
        "unit": CHI_CUC,
        "role": 'CC_KH_VP_LD',
      },
    ],
		isDisabled: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Kiểm tra rà soát báo cáo',
    description: 'Kiểm tra rà soát báo cáo',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc`,
    unRole: [
      {
				"unit": CHI_CUC,
				"role": 'CC_KH_VP_NV',
			},
      {
        "unit": CHI_CUC,
        "role": 'CC_KH_VP_TBP',
      },
      {
        "unit": CHI_CUC,
        "role": 'CC_KH_VP_LD',
      },
    ],
		isDisabled: false,
  }
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
}

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
