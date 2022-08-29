

export class Utils {
  public static FORMAT_DATE_STR = "dd/MM/yyyy";
  public static FORMAT_DATE_TIME_STR = "dd/MM/yyyy HH:mm:ss";

  public static ROUND = 4;

  // Trang thai response
  public static RESP_SUCC = 0;
  public static RESP_FAIL = 1;

  public static TYPE_USER_BACKEND = "BE";
  public static TYPE_USER_FRONTEND = "FE";

  // Trang thai
  public static MOI_TAO = "00";
  public static HOAT_DONG = "01";
  public static NGUNG_HOAT_DONG = "02";
  public static TAM_KHOA = "03";

  // Loai bao cao
  public static BCAO_CTXGD03N = "01";
  public static BCAO_02 = "02";
  public static BCAO_03 = "03";

  // Trang thái báo cáo
  public static TT_BC_KT = "-1"; // kiem tra
  public static TT_BC_0 = "0"; // Đã xóa
  public static TT_BC_1 = "1"; // Đang soạn,
  public static TT_BC_2 = "2"; // Trình duyệt,
  public static TT_BC_3 = "3"; // Trưởng BP từ chối,
  public static TT_BC_4 = "4"; // Trưởng BP duyệt,
  public static TT_BC_5 = "5"; // Lãnh đạo từ chối,
  public static TT_BC_6 = "6"; // Lãnh đạo phê duyệt,
  public static TT_BC_7 = "7"; // Gửi ĐV cấp trên,
  public static TT_BC_8 = "8"; // ĐV cấp trên từ chối,
  public static TT_BC_9 = "9"; // Đv cấp trên duyệt,
  public static TT_BC_10 = "10"; // Lãnh đạo điều chỉnh,
  public static TT_BC_11 = "11"; //Trạng thái của Phương án giao số trần chi (đã giao);
  // Danh sach quyen
  public static LANH_DAO = '1';// "Lãnh Đạo";
  public static TRUONG_BO_PHAN = '2';// "Trưởng Bộ Phận";
  public static NHAN_VIEN = '3';// "Nhân Viên";

  // Cap don vi
  public static CHI_CUC = "3";
  public static CUC_KHU_VUC = "2";
  public static TONG_CUC = "1";

  //loai de nghi
  public static MUA_THOC = "0";
  public static MUA_GAO = "1";
  public static MUA_MUOI = "2";
  public static MUA_VTU = "3";
  public static THOP_TU_CUC_KV = "4";
  public static THOP_TAI_TC = "5";
  //can cu gia
  public static HD_TRUNG_THAU = "0";
  public static QD_DON_GIA = "1";
  //loai von
  public static CAP_VON = "1";
  public static UNG_VON = "2";

  public static FILE_SIZE = 2097152;
  //role xoa
  //role xoa
  // public static btnRoleDel = {
  //     "status": ['1', '3', '5', '8', '10'],
  //     "unit": [1, 2],
  //     "role": ['3'],
  // }

  // //role luu
  // public static btnRoleSave = {
  //     "status": ['1', '3', '5', '8', '10'],
  //     "unit": [1, 2],
  //     "role": ['3'],
  // }

  // //role trinh duyet
  // public static btnRoleApprove = {
  //     "status": ['1'],
  //     "unit": [1, 2],
  //     "role": ['3'],
  // }

  // //role truong bo phan
  // public static btnRoleTBP = {
  //     "status": ['2'],
  //     "unit": [1, 2],
  //     "role": ['2'],
  // }

  // //role lanh dao
  // public static btnRoleLD = {
  //     "status": ['4'],
  //     "unit": [1, 2],
  //     "role": ['1'],
  // }

  // //role gui don vi cap tren
  // public static btnRoleGuiDVCT = {
  //     "status": ['6'],
  //     "unit": [1, 2],
  //     "role": ['1'],
  // }

  // //role don vi cap tren
  // public static btnRoleDVCT = {
  //     "status": ['7'],
  //     "unit": [1, 2],
  //     "role": ['3'],
  // }

  // //role lanh dao dieu chinh
  // public static btnRoleLDDC = {
  //     "status": ['4'],
  //     "unit": [1, 2],
  //     "role": ['1'],
  // }

  // //role copy
  // public static btnRoleCOPY = {
  //     "status": ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
  //     "unit": [1, 2],
  //     "role": ['3'],
  // }

  // //role in
  // public static btnRolePRINT = {
  //     "status": ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
  //     "unit": [1, 2],
  //     "role": ['1', '2', '3'],
  // }

  // //role copy
  // public static btnRoleOK = {
  //     "statusBaoCao": ['2', '4', '7'],
  //     "statusChiTiet": ['2'],
  //     "unit": ['1']
  // }

  // //get role xoa
  // public getRoleDel(status: any, unit: any, role: any) {
  //     return !(Utils.btnRoleDel.status.includes(status) && unit == true && Utils.btnRoleDel.role.includes(role));
  // }

  // //get role luu
  // public getRoleSave(status: any, unit: any, role: any) {
  //     return !(Utils.btnRoleSave.status.includes(status) && unit == true && Utils.btnRoleSave.role.includes(role));
  // }

  // //get role trinh duyet
  // public getRoleApprove(status: any, unit: any, role: any) {
  //     return !(Utils.btnRoleApprove.status.includes(status) && unit == true && Utils.btnRoleApprove.role.includes(role));
  // }

  // //get role truong bo phan
  // public getRoleTBP(status: any, unit: any, role: any) {
  //     return !(Utils.btnRoleTBP.status.includes(status) && unit == true && Utils.btnRoleTBP.role.includes(role));
  // }

  // //get role button lanh dao
  // public getRoleLD(status: any, unit: any, role: any) {
  //     return !(Utils.btnRoleLD.status.includes(status) && unit == true && Utils.btnRoleLD.role.includes(role));
  // }

  // //get role button gui don vi cap tren
  // public getRoleGuiDVCT(status: any, unit: any, role: any) {
  //     return !(Utils.btnRoleGuiDVCT.status.includes(status) && unit == true && Utils.btnRoleGuiDVCT.role.includes(role));
  // }

  // //get role button don vi cap tren
  // public getRoleDVCT(status: any, unit: any, role: any) {
  //     return !(Utils.btnRoleDVCT.status.includes(status) && unit == true && Utils.btnRoleDVCT.role.includes(role));
  // }

  // //role lanh dao dieu chinh
  // public getRoleLDDC(status: any, unit: any, role: any) {
  //     return !(Utils.btnRoleLDDC.status.includes(status) && unit == true && Utils.btnRoleLDDC.role.includes(role));
  // }

  // //role copy
  // public getRoleCopy(status: any, unit: any, role: any) {
  //     return !(Utils.btnRoleCOPY.status.includes(status) && unit == true && Utils.btnRoleCOPY.role.includes(role));
  // }

  // //role in
  // public getRolePrint(status: any, unit: any, role: any) {
  //     return !(Utils.btnRolePRINT.status.includes(status) && unit == true && Utils.btnRolePRINT.role.includes(role));
  // }

  // //role OK/not Ok
  // public getRoleOk(statusBaoCao: any, unit: any, statusChiTiet: any) {
  //     return !(Utils.btnRoleOK.statusBaoCao.includes(statusBaoCao) && unit == true && Utils.btnRoleOK.statusChiTiet.includes(statusChiTiet));
  // }


  //role xoa
  public btnRoleDel = {
    "status": ['1', '3', '5', '8', '10'],
    "unit": [1, 2],
    "role": ROLE_CAN_BO,
  }

  //role luu
  public btnRoleSave = {
    "status": ['1', '3', '5', '8', '10'],
    "unit": [1, 2],
    "role": ROLE_CAN_BO,
  }

  //role trinh duyet
  public btnRoleApprove = {
    "status": ['1'],
    "unit": [1, 2],
    "role": ROLE_CAN_BO,
  }

  //role truong bo phan
  public btnRoleTBP = {
    "status": ['2'],
    "unit": [1, 2],
    "role": ROLE_TRUONG_BO_PHAN,
  }

  //role lanh dao
  public btnRoleLD = {
    "status": ['4'],
    "unit": [1, 2],
    "role": ROLE_LANH_DAO,
  }

  //role gui don vi cap tren
  public btnRoleGuiDVCT = {
    "status": ['6'],
    "unit": [1, 2],
    "role": ROLE_LANH_DAO,
  }

  //role don vi cap tren
  public btnRoleDVCT = {
    "status": ['7'],
    "unit": [1, 2],
    "role": ROLE_CAN_BO,
  }

  //role lanh dao dieu chinh
  public btnRoleLDDC = {
    "status": ['4'],
    "unit": [1, 2],
    "role": ROLE_LANH_DAO,
  }

  //role copy
  public btnRoleCOPY = {
    "status": ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    "unit": [1, 2],
    "role": ROLE_CAN_BO,
  }

  //role in
  public btnRolePRINT = {
    "status": ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    "unit": [1, 2],
    "role": ROLE_CAN_BO.concat(ROLE_TRUONG_BO_PHAN).concat(ROLE_LANH_DAO),
  }

  //role copy
  public btnRoleOK = {
    "statusBaoCao": ['2', '4', '7'],
    "statusChiTiet": ['2'],
    "unit": ROLE_LANH_DAO
  }

  //role copy
  public btnRoleExport = {
    "status": ['6', '9'],
    "role": ['KH_VP_BC_KQTH_EX']
  }

  //get role xoa
  public getRoleDel(status: any, unit: any, role: any): boolean {
    return !(this.btnRoleDel.status.includes(status) && unit == true && this.btnRoleDel.role.includes(role));
  }

  //get role luu
  public getRoleSave(status: any, unit: any, role: any): boolean {
    return !(this.btnRoleSave.status.includes(status) && unit == true && this.btnRoleSave.role.includes(role));
  }

  //get role trinh duyet
  public getRoleApprove(status: any, unit: any, role: any): boolean {
    return !(this.btnRoleApprove.status.includes(status) && unit == true && this.btnRoleApprove.role.includes(role));
  }

  //get role truong bo phan
  public getRoleTBP(status: any, unit: any, role: any): boolean {
    return !(this.btnRoleTBP.status.includes(status) && unit == true && this.btnRoleTBP.role.includes(role));
  }

  //get role button lanh dao
  public getRoleLD(status: any, unit: any, role: any): boolean {
    return !(this.btnRoleLD.status.includes(status) && unit == true && this.btnRoleLD.role.includes(role));
  }

  //get role button gui don vi cap tren
  public getRoleGuiDVCT(status: any, unit: any, role: any): boolean {
    return !(this.btnRoleGuiDVCT.status.includes(status) && unit == true && this.btnRoleGuiDVCT.role.includes(role));
  }

  //get role button don vi cap tren
  public getRoleDVCT(status: any, unit: any, role: any): boolean {
    return !(this.btnRoleDVCT.status.includes(status) && unit == true && this.btnRoleDVCT.role.includes(role));
  }

  //role lanh dao dieu chinh
  public getRoleLDDC(status: any, unit: any, role: any): boolean {
    return !(this.btnRoleLDDC.status.includes(status) && unit == true && this.btnRoleLDDC.role.includes(role));
  }

  //role copy
  public getRoleCopy(status: any, unit: any, role: any): boolean {
    return !(this.btnRoleCOPY.status.includes(status) && unit == true && this.btnRoleCOPY.role.includes(role));
  }

  //role in
  public getRolePrint(status: any, unit: any, role: any): boolean {
    return !(this.btnRolePRINT.status.includes(status) && unit == true && this.btnRolePRINT.role.includes(role));
  }

  //role export
  public getRoleExport(status: any, unit: any, role: any): boolean {
    return !(this.btnRoleExport.status.includes(status) && unit == true && this.btnRolePRINT.role.includes(role));
  }

  //role OK/not Ok
  public getRoleOk(statusBaoCao: any, unit: any, statusChiTiet: any): boolean {
    return !(this.btnRoleOK.statusBaoCao.includes(statusBaoCao) && unit == true && this.btnRoleOK.statusChiTiet.includes(statusChiTiet));
  }
  // lay quyen
  public getRole(id: number) {
    let role;
    switch (id) {
      case 4:
        role = 'CAP_TREN'
        break;
      case 1:
        role = 'LANH_DAO'
        break;
      case 2:
        role = 'TRUONG_BO_PHAN'
        break;
      case 3:
        role = 'NHAN_VIEN'
        break;

      default:
        role = id;
        break;
    }
    return role;
  }

  // lay ten don vi theo ma don vi
  public getUnitLevel(id: number) {
    let unitLevel;
    switch (id) {
      case 1:
        unitLevel = 'TONG_CUC'
        break;
      case 2:
        unitLevel = 'CUC_KHU_VUC'
        break;
      case 3:
        unitLevel = 'CHI_CUC'
        break;
      default:
        unitLevel = id;
        break;
    }
    return unitLevel;
  }

  // lay ten trang thai theo ma trang thai
  public getStatusName(id: string) {
    let statusName;
    switch (id) {
      case Utils.TT_BC_0:
        statusName = "Đã xóa";
        break;
      case Utils.TT_BC_1:
        statusName = "Đang soạn"
        break;
      case Utils.TT_BC_2:
        statusName = "Trình duyệt"
        break;
      case Utils.TT_BC_3:
        statusName = "Trưởng BP từ chối"
        break;
      case Utils.TT_BC_4:
        statusName = "Trưởng BP duyệt"
        break;
      case Utils.TT_BC_5:
        statusName = "Lãnh đạo từ chối"
        break;
      case Utils.TT_BC_6:
        statusName = "Lãnh đạo phê duyệt"
        break;
      case Utils.TT_BC_7:
        statusName = "Lãnh đạo phê duyệt"
        break;
      case Utils.TT_BC_8:
        statusName = "Từ chối"
        break;
      case Utils.TT_BC_9:
        statusName = "Tiếp nhận"
        break;
      case Utils.TT_BC_10:
        statusName = "Điều chỉnh theo số kiểm tra"
        break;
      case Utils.TT_BC_11:
        statusName = "Đã giao"
        break;
      case Utils.TT_BC_KT:
        statusName = "Chưa có"
        break;
      default:
        statusName = id;
        break;
    }
    return statusName;
  }

  // lay ten trang thai theo ma trang thai
  public getStatusNameParent(id: string) {
    let statusName;
    switch (id) {
      case Utils.TT_BC_0:
        statusName = "Đã xóa";
        break;
      case Utils.TT_BC_1:
        statusName = "Đang soạn"
        break;
      case Utils.TT_BC_2:
        statusName = "Trình duyệt"
        break;
      case Utils.TT_BC_3:
        statusName = "Trưởng BP từ chối"
        break;
      case Utils.TT_BC_4:
        statusName = "Trưởng BP duyệt"
        break;
      case Utils.TT_BC_5:
        statusName = "Lãnh đạo từ chối"
        break;
      case Utils.TT_BC_6:
        statusName = "Mới"
        break;
      case Utils.TT_BC_7:
        statusName = "Mới"
        break;
      case Utils.TT_BC_8:
        statusName = "Từ chối"
        break;
      case Utils.TT_BC_9:
        statusName = "Tiếp nhận"
        break;
      case Utils.TT_BC_10:
        statusName = "Điều chỉnh theo số kiểm tra"
        break;
      case Utils.TT_BC_11:
        statusName = "Đã giao"
        break;
      case Utils.TT_BC_KT:
        statusName = "Chưa có"
        break;
      default:
        statusName = id;
        break;
    }
    return statusName;
  }

  // lay ten trang thai theo ma trang thai
  public getStatusAppendixName(id): string {
    // let statusName = TRANG_THAI_PHU_LUC.find(item => item.id == id)
    // return statusName?.ten;
    return TRANG_THAI_PHU_LUC.find(item => item.id == id)?.ten;
  }
}
export const ROLE_CAN_BO = ['TC_KH_VP_NV', 'C_KH_VP_NV_KH', 'C_KH_VP_NV_TVQT', 'CC_KH_VP_NV'];
export const ROLE_TRUONG_BO_PHAN = ['TC_KH_VP_TBP', 'C_KH_VP_TBP_TVQT', 'C_KH_VP_TBP_KH', 'CC_KH_VP_TBP'];
export const ROLE_LANH_DAO = ['TC_KH_VP_LD', 'C_KH_VP_LD', 'CC_KH_VP_LD'];

// loai bao cao quan ly von phi
export const LOAI_BAO_CAO = [
  {
    id: '12',
    tenDm: 'Xây dựng Chi thường xuyên giai đoạn 03 năm'
  },
  {
    id: '01',
    tenDm: 'Xây dựng Kế hoạch danh mục, vốn đầu tư XDCB giai đoạn 03 năm'
  },
  {
    id: '02',
    tenDm: 'Xây dựng Nhu cầu nhập xuất hàng DTQG hàng năm'
  },
  {
    id: '03',
    tenDm: 'Xây dựng Kế hoạch bảo quản hàng năm'
  },
  {
    id: '04',
    tenDm: 'Xây dựng Nhu cầu xuất hàng DTQG viện trợ cứu trợ hàng năm'
  },
  {
    id: '05',
    tenDm: 'Xây dựng Kế hoạch quỹ tiền lương giai đoạn 03 năm'
  },
  {
    id: '06',
    tenDm: 'Xây dựng Kế hoạch quỹ tiền lương hàng năm'
  },
  {
    id: '07',
    tenDm: 'Xây dựng Thuyết minh chi các đề tài, dự án nghiên cứu khoa học giai đoạn 03 năm'
  },
  {
    id: '08',
    tenDm: 'Kế hoạch xây dựng văn bản quy phạm pháp luật dự trữ quốc gia giai đoạn 03 năm'
  },
  {
    id: '09',
    tenDm: 'Kế hoạch Xây dựng dự toán chi ứng dụng CNTT giai đoạn 03 năm'
  },
  {
    id: '10',
    tenDm: 'Xây dựng Dự toán chi mua sắm máy móc, thiết bị chuyên dùng 03 năm'
  },
  {
    id: '11',
    tenDm: 'Xây dựng Nhu cầu chi ngân sách nhà nước giai đoạn 03 năm'
  },
  {
    id: '13',
    tenDm: 'Xây dựng Nhu cầu phí nhập, xuất theo các năm của giai đoạn 03 năm'
  },
  {
    id: '14',
    tenDm: 'Xây dựng Kế hoạch cải tạo và sửa chữa lớn 03 năm'
  },
  {
    id: '15',
    tenDm: 'Xây dựng Kế hoạch đào tạo bồi dưỡng giai đoạn 03 năm'
  },
  {
    id: '32',
    tenDm: 'Xây dựng Kế hoạch đào tạo bồi dưỡng giai đoạn 03 năm (TC)'
  },
  {
    id: '16',
    tenDm: 'Nhu cầu kế hoạch ĐTXD 03 năm'
  },
  {
    id: '17',
    tenDm: 'Tổng hợp dự toán chi thường xuyên hàng năm'
  },
  {
    id: '18',
    tenDm: 'Dự toán phí nhập xuất hàng DTQG hàng năm'
  },
  {
    id: '19',
    tenDm: 'Kế hoạch bảo quản hàng năm (Phần kinh phí được hưởng theo định mức và Dự kiến kinh phí của các mặt hàng chưa có định mức)'
  },
  {
    id: '20',
    tenDm: 'Dự toán phí xuất hàng DTQG viện trợ cứu trợ hàng năm'
  },
  {
    id: '21',
    tenDm: 'Kế hoạch dự toán cải tạo sửa chữa hệ thống kho tàng 03 năm'
  },
  {
    id: '22',
    tenDm: 'Kế hoạch quỹ tiền lương năm N+1'
  },
  {
    id: '23',
    tenDm: 'Dự toán chi dự trữ quốc gia giai đoạn 03 năm'
  },
  {
    id: '24',
    tenDm: 'Thuyết minh chi các đề tài, dự án nghiên cứu khoa học giai đoạn 03 năm'
  },
  {
    id: '25',
    tenDm: 'Kế hoạch xây dựng văn bản quy phạm pháp luật dự trữ quốc gia giai đoạn 03 năm'
  },
  {
    id: '26',
    tenDm: 'Dự toán chi ứng dụng CNTT giai đoạn 03 năm'
  },
  {
    id: '27',
    tenDm: 'Dự toán chi mua sắm máy móc thiết bị chuyên dùng 03 năm'
  },
  {
    id: '28',
    tenDm: 'Tổng hợp nhu cầu chi ngân sách nhà nước giai đoạn 03 năm'
  },
  {
    id: '29',
    tenDm: 'Tổng hợp nhu cầu chi thường xuyên giai đoạn 03 năm'
  },
  {
    id: '30',
    tenDm: 'Chi tiết nhu cầu chi thường xuyên giai đoạn 03 năm'
  },
  {
    id: '31',
    tenDm: 'Tổng hợp mục tiêu nhiệm vụ chủ yếu và nhu cầu chi mới giai đoạn 03 năm'
  },
]
// Loai bao cao
// 3.2.4.3.1
export const QLNV_KHVONPHI_DM_VONDT_XDCBGD3N = "01";

// 3.2.4.3.2
export const QLNV_KHVONPHI_NXUAT_DTQG_HNAM_VATTU = "02";

// 3.2.4.3.3
export const QLNV_KHVONPHI_KHOACH_BQUAN_HNAM_MAT_HANG = "03";

// 3.2.4.3.4
export const QLNV_KHVONPHI_NCAU_XUAT_DTQG_VTRO_HNAM = "04";

// 3.2.4.3.5
export const QLNV_KHVONPHI_KHOACH_QUY_TIEN_LUONG_GD3N = "05";

// 3.2.4.3.6
export const QLNV_KHVONPHI_KHOACH_QUY_TIEN_LUONG_HNAM = "06";

// 3.2.4.3.7
export const QLNV_KHVONPHI_CHI_DTAI_DAN_NCKH_GD3N = "07";

// 3.2.4.3.8
export const QLNV_KHVONPHI_VBAN_QPHAM_PLUAT_DTQG_GD3N = "08";

// 3.2.4.3.9
export const QLNV_KHVONPHI_CHI_UDUNG_CNTT_GD3N = "09";

// 3.2.4.3.10
export const QLNV_KHVONPHI_DTOAN_CHI_MUASAM_MAYMOC_TBI_GD3N = "10";

// 3.2.4.3.11
export const QLNV_KHVONPHI_NCAU_CHI_NSNN_GD3N = "11";

// 3.2.4.3.12
export const QLNV_KHVONPHI_CHI_TX_GD3N = "12";

// 3.2.4.3.13
export const QLNV_KHVONPHI_NCAU_PHI_NHAP_XUAT_GD3N = "13";

// 3.2.4.3.14
export const QLNV_KHVONPHI_KHOACH_CTAO_SCHUA_GD3N = "14";

// 3.2.4.3.15
export const QLNV_KHVONPHI_KHOACH_DTAO_BOI_DUONG_GD3N = "15";

// Loai bao cao Tổng cục
export const QLNV_KHVONPHI_TC_NCAU_KHOACH_DTXD_GD3N = "16";
export const QLNV_KHVONPHI_TC_THOP_DTOAN_CHI_TX_HNAM = "17";
export const QLNV_KHVONPHI_TC_DTOAN_PHI_NXUAT_DTQG_THOC_GAO_HNAM = "18";
export const QLNV_KHVONPHI_TC_KHOACH_BQUAN_THOC_GAO_HNAM = "19";
export const QLNV_KHVONPHI_TC_DTOAN_PHI_XUAT_DTQG_VTRO_CTRO_HNAM = "20";
export const QLNV_KHVONPHI_TC_KHOACH_DTOAN_CTAO_SCHUA_HTHONG_KHO_TANG_GD3N = "21";
export const QLNV_KHVONPHI_TC_KHOACHC_QUY_LUONG_N1 = "22";
export const QLNV_KHVONPHI_TC_DTOAN_CHI_DTQG_GD3N = "23";
export const QLNV_KHVONPHI_TC_TMINH_CHI_CAC_DTAI_DAN_NCKH_GD3N = "24";
export const QLNV_KHVONPHI_TC_KHOACH_XDUNG_VBAN_QPHAM_PLUAT_DTQG_GD3N = "25";
export const QLNV_KHVONPHI_TC_DTOAN_CHI_UDUNG_CNTT_GD3N = "26";
export const QLNV_KHVONPHI_TC_DTOAN_CHI_MSAM_MMOC_TBI_CHUYEN_DUNG_GD3N = "27";
export const QLNV_KHVONPHI_TC_THOP_NCAU_CHI_NSNN_GD3N = "28";
export const QLNV_KHVONPHI_TC_THOP_NNCAU_CHI_TX_GD3N = "29";
export const QLNV_KHVONPHI_TC_CTIET_NCAU_CHI_TX_GD3N = "30";
export const QLNV_KHVONPHI_TC_THOP_MTIEU_NVU_CYEU_NCAU_CHI_MOI_GD3N = "31";
export const QLNV_KHVONPHI_TC_KHOACH_DTAO_BOI_DUONG_GD3N = "32";

// loai bao cao quy trinh thuc hien du toan chi
export const LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI = [
  {
    id: '526',
    tenDm: 'Báo cáo giải ngân định kỳ tháng'
  },
  {
    id: '527',
    tenDm: 'Báo cáo giải ngân cả năm'
  },
  {
    id: '528',
    tenDm: 'Báo cáo chỉnh lý năm'
  },
]

// loai bao cao ket qua thuc hien hang du tru quoc gia
export const LBC_KET_QUA_THUC_HIEN_HANG_DTQG = [
  {
    id: '1',
    tenDm: 'Đợt'
  },
  {
    id: '2',
    tenDm: 'Năm'
  },
]
export const BAO_CAO_DOT = "1";
export const BAO_CAO_NAM = "2";
// trang thai ban ghi cua anh Ninh
export const TRANG_THAI_BAN_GHI = [
  {
    id: '1',
    tenDm: 'Đang soạn'
  },
  {
    id: '2',
    tenDm: 'Trình duyệt'
  },
  {
    id: '3',
    tenDm: 'Từ chối'
  },
  {
    id: '4',
    tenDm: 'Duyệt'
  },
  {
    id: '5',
    tenDm: 'Từ chối'
  },
  {
    id: '6',
    tenDm: 'Phê duyệt'
  },
  {
    id: '7',
    tenDm: 'Chờ ghi nhận'
  },
  {
    id: '8',
    tenDm: 'Từ chối ghi nhận'
  },
  {
    id: '9',
    tenDm: 'Ghi nhận'
  },
]



// trang thai ban ghi
export const TRANG_THAI = [
  {
    id: 1,
    tenDm: 'Đang soạn'
  },
  {
    id: 2,
    tenDm: 'Trình duyệt'
  },
  {
    id: 3,
    tenDm: 'Trưởng BP từ chối'
  },
  {
    id: 4,
    tenDm: 'Trưởng BP duyệt'
  },
  {
    id: 5,
    tenDm: 'Lãnh đạo từ chối'
  },
  {
    id: 6,
    tenDm: 'Lãnh đạo phê duyệt'
  },
  {
    id: 7,
    tenDm: 'Gửi ĐV cấp trên'
  },
  {
    id: 8,
    tenDm: 'ĐV cấp trên từ chối'
  },
  {
    id: 9,
    tenDm: 'Đv cấp trên duyệt'
  },
  {
    id: 10,
    tenDm: 'Lãnh đạo yêu cầu điều chỉnh'
  },
  {
    id: 11,
    tenDm: 'Chưa đánh giá'
  },
]

// trang thai ban ghi
export const TRANG_THAI_TIM_KIEM = [
  {
    id: "1",
    tenDm: 'Đang soạn'
  },
  {
    id: "2",
    tenDm: 'Trình duyệt'
  },
  {
    id: "3",
    tenDm: 'Trưởng BP từ chối'
  },
  {
    id: "4",
    tenDm: 'Trưởng BP duyệt'
  },
  {
    id: "5",
    tenDm: 'Lãnh đạo từ chối'
  },
  {
    id: "7",
    tenDm: 'Lãnh đạo phê duyệt'
  },
  {
    id: "8",
    tenDm: 'Đơn vị cấp trên từ chối'
  },
  {
    id: "9",
    tenDm: 'Đơn vị cấp trên tiếp nhận'
  },
  // {
  //     id: "10",
  //     tenDm: 'Lãnh đạo yêu cầu điều chỉnh'
  // },
]

// trang thai chi tiet bao cao
export const OK = "1";
export const NOT_OK = "0";
export const CHUA_DANH_GIA = "2";
export const MOI = "3";
export const DANG_NHAP_LIEU = "4";
export const HOAN_TAT_NHAP_LIEU = "5";

// loai trang thai gui don vi cap tren
export const TRANG_THAI_GUI_DVCT = [
  {
    id: '9',
    ten: 'Tiếp nhận'
  },
  {
    id: '8',
    ten: 'Từ chối'
  },
  {
    id: '7',
    ten: 'Mới'
  },
]

// loai trang thai kiem tra
export const TRANG_THAI_KIEM_TRA_BAO_CAO = [
  {
    id: '9',
    ten: 'Tiếp nhận'
  },
  {
    id: '8',
    ten: 'Từ chối'
  },
  {
    id: '7',
    ten: 'Mới'
  },
  {
    id: '-1',
    ten: 'Chưa gửi đơn vị cấp trên'
  },
]

export const TRANG_THAI_PHU_LUC = [
  {
    id: 0,
    ten: 'NOT OK'
  },
  {
    id: 1,
    ten: 'OK'
  },
  {
    id: 2,
    ten: 'Chưa đánh giá (để trống)'
  },
  {
    id: 3,
    ten: 'Mới'
  },
  {
    id: 4,
    ten: 'Đang nhập liệu'
  },
  {
    id: 5,
    ten: 'Hoàn tất nhập liệu'
  }
]

export const LIST_BAO_CAO_TONG_HOP = [
  {
    id: '01',
    tenDm: 'Xây dựng Kế hoạch danh mục, vốn đầu tư XDCB giai đoạn 03 năm'
  },
  {
    id: '16',
    tenDm: 'Nhu cầu kế hoạch ĐTXD 03 năm'
  },
  {
    id: '17',
    tenDm: 'Tổng hợp dự toán chi thường xuyên hàng năm'
  },
  {
    id: '18',
    tenDm: 'Dự toán phí nhập xuất hàng DTQG hàng năm'
  },
  {
    id: '19',
    tenDm: 'Kế hoạch bảo quản hàng năm (Phần kinh phí được hưởng theo định mức và Dự kiến kinh phí của các mặt hàng chưa có định mức)'
  },
  {
    id: '20',
    tenDm: 'Dự toán phí xuất hàng DTQG viện trợ cứu trợ hàng năm'
  },
  {
    id: '21',
    tenDm: 'Kế hoạch dự toán cải tạo sửa chữa hệ thống kho tàng 03 năm'
  },
  {
    id: '22',
    tenDm: 'Kế hoạch quỹ tiền lương năm N+1'
  },
  {
    id: '23',
    tenDm: 'Dự toán chi dự trữ quốc gia giai đoạn 03 năm'
  },
  {
    id: '24',
    tenDm: 'Thuyết minh chi các đề tài, dự án nghiên cứu khoa học giai đoạn 03 năm'
  },
  {
    id: '25',
    tenDm: 'Kế hoạch xây dựng văn bản quy phạm pháp luật dự trữ quốc gia giai đoạn 03 năm'
  },
  {
    id: '26',
    tenDm: 'Dự toán chi ứng dụng CNTT giai đoạn 03 năm'
  },
  {
    id: '27',
    tenDm: 'Dự toán chi mua sắm máy móc thiết bị chuyên dùng 03 năm'
  },
  {
    id: '28',
    tenDm: 'Tổng hợp nhu cầu chi ngân sách nhà nước giai đoạn 03 năm'
  },
  {
    id: '29',
    tenDm: 'Tổng hợp nhu cầu chi thường xuyên giai đoạn 03 năm'
  },
  {
    id: '30',
    tenDm: 'Chi tiết nhu cầu chi thường xuyên giai đoạn 03 năm'
  },
  {
    id: '31',
    tenDm: 'Tổng hợp mục tiêu nhiệm vụ chủ yếu và nhu cầu chi mới giai đoạn 03 năm'
  },
]

// loai bao cao quy trinh thuc hien du toan chi
export const DON_VI_TIEN = [
  {
    id: '1',
    tenDm: 'Đồng',
    giaTri: 1
  },
  {
    id: '2',
    tenDm: 'Nghìn đồng',
    giaTri: 1000
  },
  {
    id: '3',
    tenDm: 'Triệu đồng',
    giaTri: 1000000
  },
  {
    id: '4',
    tenDm: 'Tỷ đồng',
    giaTri: 1000000000
  },
]

export function divMoney(value, maDonViTien): number {
  const donVi = DON_VI_TIEN.find(item => item.id == maDonViTien);
  if (!value && value != 0) {
    return null;
  }

  if (donVi) {
    return Number((value / donVi.giaTri).toFixed(Utils.ROUND));
  } else {
    return null;
  }
}

export function mulMoney(value, maDonViTien): number {

  const donVi = DON_VI_TIEN.find(item => item.id == maDonViTien);
  if (!value && value != 0) {
    return null;
  }

  if (donVi) {
    return Number((value * donVi.giaTri).toFixed(Utils.ROUND));
  } else {
    return null;
  }
}

export function getNumberValue(num): number {
  if (!num) {
    return 0;
  }
  return Number(num.toFixed(4));
}

export function sumNumber(num: any): number {
  let check = true;
  let tong = 0;
  num.forEach(item => {
    if (item || item === 0) {
      check = false;
    }
    tong += getNumberValue(item);
  })
  if (check) {
    return null;
  }
  return tong;
}

export function divNumber(num1, num2): number {
  if ((!num1 && num1 !== 0) &&
    (!num2 && num2 !== 0)) {
    return null;
  }
  if (getNumberValue(num2) == 0) {
    return 0 / 0;
  } else {
    return getNumberValue(num1) / getNumberValue(num2);
  }
}

export function fixedNumber(num: number): number {
  return Number(num.toFixed(Utils.ROUND));
}


// trang thai phan bo du toan chi nsnn
export const TRANG_THAI_PHAN_BO = [
  {
    id: '1',
    ten: 'Chưa ghi nhận',
  },
  {
    id: '2',
    ten: 'Chờ ghi nhận',
  },
  {
    id: '3',
    ten: 'Đã ghi nhận',
  },
  {
    id: '4',
    ten: 'Chờ tiếp nhận',
  },
]

export const TRANG_THAI_GIAO = [
  {
    id: '0',
    tenDm: "Chưa giao",
  },
  {
    id: '1',
    tenDm: "Giao",
  },
  {
    id: '2',
    tenDm: "Đã nhận",
  },
]
export const MONEY_LIMIT = 9000000000000000;

export const KHOAN_MUC = [
  {
    id: 10000,
    tenDm: "HOẠT ĐỘNG DTQG (Khoản 331)",
    level: 0,
    idCha: 0,
  },
  {
    id: 11000,
    tenDm: "Kinh phí thực hiện tự chủ",
    idCha: 10000,
    level: 1,
  },
  {
    id: 12000,
    tenDm: "Kinh phí không thực hiện tự chủ",
    idCha: 10000,
    level: 1,
  },
  {
    id: 12100,
    tenDm: "Giao đơn vị thực hiện nhiệm vụ",
    idCha: 12000,
    level: 2,
  },
  {
    id: 12110,
    tenDm: "Mua sắm, sửa chữa tài sản",
    idCha: 12100,
    level: 3,
  },
  {
    id: 12111,
    tenDm: "Chi sửa chữa kho tàng và các công trình phụ trợ",
    idCha: 12110,
    level: 4,
  },
  {
    id: 12120,
    tenDm: "Nghiệp vụ chuyên môn đặc thù",
    idCha: 12100,
    level: 3,
  },
  {
    id: 12121,
    tenDm: "Phí bảo quản hàng dự trữ, phí nhập xuất hàng, phí xuất hàng cứu trợ, viện trợ, hỗ trợ chính sách",
    idCha: 12120,
    level: 4,
  },
  {
    id: 12130,
    tenDm: "Chi khác",
    idCha: 12100,
    level: 3,
  },

  // {
  // 	id: 20000,
  // 	tenDm: "HOẠT ĐỘNG DTQG (Khoản 331)",
  // 	idCha: 0,
  // 	level: 0,
  // },
  // {
  // 	id: 21000,
  // 	tenDm: "Kinh phí thực hiện tự chủ",
  // 	idCha: 20000,
  // 	level: 1,
  // },
  // {
  // 	id: 21100,
  // 	tenDm: "Giao đơn vị thực hiện nhiệm vụ",
  // 	idCha: 21000,
  // 	level: 2,
  // },
  // {
  // 	id: 21110,
  // 	tenDm: "Thanh toán cá nhân và quản lý hành chính",
  // 	idCha: 21100,
  // 	level: 3,
  // },
  // {
  // 	id: 21111,
  // 	tenDm: "Quỹ lương",
  // 	idCha: 21110,
  // 	level: 4,
  // },
  // {
  // 	id: 21112,
  // 	tenDm: "Chi quản lý hành chính theo định mức",
  // 	idCha: 21110,
  // 	level: 4,
  // },
  // {
  // 	id: 21113,
  // 	tenDm: "Kinh phí thực hiện điều chỉnh tiền lương theo Nghị định số 38/2018/NĐ-CP",
  // 	idCha: 21110,
  // 	level: 4,
  // },
  // {
  // 	id: 21114,
  // 	tenDm: "Kinh phí cắt giảm, tiết kiệm và thu hồi chi thường xuyên NSNN năm 2021",
  // 	idCha: 21110,
  // 	level: 4,
  // },
  // {
  // 	id: 22000,
  // 	tenDm: "Kinh phí không thực hiện tự chủ",
  // 	idCha: 20000,
  // 	level: 1,
  // },
  {
    id: 30000,
    tenDm: "SỰ NGHIỆP GIÁO DỤC ĐÀO TẠO (Khoản 085)",
    idCha: 0,
    level: 0,
  },
  {
    id: 31000,
    tenDm: "Kinh phí thực hiện tự chủ",
    idCha: 30000,
    level: 1,
  },
  {
    id: 32000,
    tenDm: "Kinh phí không thực hiện tự chủ",
    idCha: 30000,
    level: 1,
  },
  {
    id: 32100,
    tenDm: "Giao đơn vị thực hiện nhiệm vụ",
    idCha: 32000,
    level: 2,

  },
  {
    id: 32110,
    tenDm: "Chỉ đào tạo, bồi dưỡng cán bộ, công chức trong nước",
    idCha: 32100,
    level: 3,

  },
  {
    id: 40000,
    tenDm: "HOẠT ĐỘNG ĐẢM BẢO XÃ HỘI (Khoản 398)",
    idCha: 0,
    level: 0,

  },
  {
    id: 41000,
    tenDm: "Kinh phí thực hiện tự chủ",
    idCha: 40000,
    level: 1,
  },
  {
    id: 42000,
    tenDm: "Kinh phí không thực hiện tự chủ",
    idCha: 40000,
    level: 1,
  },
  {
    id: 50000,
    tenDm: "QUẢN LÝ HÀNH CHÍNH (Khoản 341)",
    idCha: 0,
    level: 0,

  },
  {
    id: 51000,
    tenDm: "Kinh phí thực hiện tự chủ",
    idCha: 50000,
    level: 1,
  },
  {
    id: 52000,
    tenDm: "Kinh phí không thực hiện tự chủ",
    idCha: 50000,
    level: 1,
  },
  {
    id: 60000,
    tenDm: "SỰ NGHIỆP KHOA HỌC VÀ CÔNG NGHỆ (Khoản 102)",
    idCha: 0,
    level: 0,

  },
  {
    id: 61000,
    tenDm: "Kinh phí thực hiện tự chủ",
    idCha: 60000,
    level: 1,
  },
  {
    id: 62000,
    tenDm: "Kinh phí không thực hiện tự chủ",
    idCha: 60000,
    level: 1,
  },
];



export const LA_MA = [
  {
    kyTu: "M",
    gTri: 1000,
  },
  {
    kyTu: "CM",
    gTri: 900,
  },
  {
    kyTu: "D",
    gTri: 500,
  },
  {
    kyTu: "CD",
    gTri: 400,
  },
  {
    kyTu: "C",
    gTri: 100,
  },
  {
    kyTu: "XC",
    gTri: 90,
  },
  {
    kyTu: "L",
    gTri: 50,
  },
  {
    kyTu: "XL",
    gTri: 40,
  },
  {
    kyTu: "X",
    gTri: 10,
  },
  {
    kyTu: "IX",
    gTri: 9,
  },
  {
    kyTu: "V",
    gTri: 5,
  },
  {
    kyTu: "IV",
    gTri: 4,
  },
  {
    kyTu: "I",
    gTri: 1,
  },
];

export const LOAI_DE_NGHI = [
  {
    id: Utils.MUA_GAO,
    tenDm: "Mua gạo",
  },
  {
    id: Utils.MUA_THOC,
    tenDm: "Mua thóc",
  },
  {
    id: Utils.MUA_MUOI,
    tenDm: "Mua muối",
  },
  {
    id: Utils.MUA_VTU,
    tenDm: "Mua vật tư",
  },
]

export const NGUON_BAO_CAO = [
  {
    id: Utils.THOP_TU_CUC_KV,
    tenDm: "Tổng hợp từ cục khu vực",
  },
  {
    id: Utils.THOP_TAI_TC,
    tenDm: "Tổng hợp tại tổng cục",
  },
]

export const CAN_CU_GIA = [
  {
    id: Utils.HD_TRUNG_THAU,
    tenDm: "Hợp đồng trúng thầu",
  },
  {
    id: Utils.QD_DON_GIA,
    tenDm: "Quyết định đơn giá mua",
  }
]

export const LOAI_VON = [
  {
    id: Utils.CAP_VON,
    tenDm: "Cấp vốn",
  },
  {
    id: Utils.UNG_VON,
    tenDm: "Ứng vốn",
  }
]

export function displayNumber(num: number): string {
  let displayValue: string;
  if (Number.isNaN(num)) {
    return 'NaN';
  }
  if (!num && num !== 0) {
    return '';
  }
  const dau = num < 0 ? '-' : '';
  num = Math.abs(num);
  let real!: string;
  let imaginary!: string;
  if (num == Math.floor(num)) {
    real = num.toString();
  } else {
    const str = num.toFixed(4);
    real = str.split('.')[0];
    imaginary = str.split('.')[1];
    while (imaginary[imaginary.length - 1] == '0') {
      imaginary = imaginary.slice(0, -1);
    }
  }
  if (!imaginary) {
    displayValue = dau + separateNumber(real);
  } else {
    displayValue = dau + separateNumber(real) + '.' + separateNumber(imaginary);
  }
  // let nho = '';
  // num = Math.abs(num);
  // let str: string = num.toString();
  // let real!: number;
  // let imaginary!: number;

  // if (str.indexOf('.') >= 0) {
  //     str = num.toFixed(4);
  //     real = parseInt(str.split('.')[0], 10);
  //     let imaTemp = str.split('.')[1];
  //     while (imaTemp.startsWith('0')) {
  //         nho = nho + 0;
  //         imaTemp = imaTemp.slice(1);
  //     }
  //     imaginary = parseInt(imaTemp, 10);
  //     while (imaginary % 10 == 0) {
  //         imaginary = Math.floor(imaginary / 10);
  //     }
  // } else {
  //     real = num;
  // }
  // if (!imaginary) {
  //     displayValue = dau + separateNumber(real);
  // } else {
  //     displayValue = dau + separateNumber(real) + '.' + nho + separateNumber(imaginary);
  // }
  return displayValue;
}

export function separateNumber(str: string): string {
  if (str.length < 4) {
    return str;
  }
  let displayValue!: string;
  let index = str.indexOf(',');
  if (index == -1) {
    displayValue = str.slice(0, -3) + ',' + str.slice(-3);
    str = displayValue;
    index = str.indexOf(',');
  }
  while (index - 3 > 0) {
    displayValue = str.slice(0, index - 3) + ',' + str.slice(index - 3);
    str = displayValue;
    index = str.indexOf(',');
  }
  return displayValue;
}

// export function separateNumber(num: number): string {
//     let displayValue!: string;
//     if (num == 0) {
//         displayValue = '0';
//     }
//     while (num > 0) {
//         let val = (num % 1000).toString();
//         num = Math.floor(num / 1000);
//         if (num > 0) {
//             while (val.length < 3) {
//                 val = '0' + val;
//             }
//         }
//         if (!displayValue) {
//             displayValue = val;
//         } else {
//             displayValue = val + ',' + displayValue;
//         }
//     }
//     return displayValue;
// }

