

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

  ////////// TRANG THAI BAO CAO DE THUC HIEN THAO TAC /////////////////////////////////
  //xoa
  public static statusDelete = [Utils.TT_BC_1, Utils.TT_BC_3, Utils.TT_BC_5, Utils.TT_BC_8];
  //luu
  public static statusSave = [Utils.TT_BC_1, Utils.TT_BC_3, Utils.TT_BC_5, Utils.TT_BC_8];
  // trinh duyet
  public static statusApprove = [Utils.TT_BC_1];
  // duyet, tu choi
  public static statusDuyet = [Utils.TT_BC_2];
  //phe duyet, tu choi
  public static statusPheDuyet = [Utils.TT_BC_4];
  //tiep nhan, tu choi
  public static statusTiepNhan = [Utils.TT_BC_6, Utils.TT_BC_7];
  //copy
  public static statusCopy = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9];
  //print
  public static statusPrint = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9];
  //ok, not ok
  public static statusOK = [Utils.TT_BC_2, Utils.TT_BC_4, Utils.TT_BC_6, Utils.TT_BC_7];
  //export
  public static statusExport = [Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_9];


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
    "status": ['6', '7', '9'],
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

//////////////////// LAP THAM DINH /////////////////////////////////
export const LTD = {
  ADD_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_LAP_BC',  									//lap bao cao
  APPROVE_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_TRINHDUYET_BC',							//trinh duyet bao cao
  EDIT_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_SUA_BC',									//sua bao cao
  DELETE_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XOA_BC',									//xoa bao cao
  COPY_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_COPY_BC',									//copy bao cao
  DUYET_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_DUYET_TUCHOIDUYET_BC',					//duyet bao cao
  PHE_DUYET_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_PHEDUYET_TUCHOIPHEDUYET_BC',			//phe duyet bao cao
  VIEW_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XEM_BC',									//xem bao cao
  PRINT_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_IN_BC',									//in bao cao
  EXPORT_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XUAT_BC',								//xuat bao cao
  TIEP_NHAN_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_TIEPNHAN_TUCHOI_BC',					//tiep nhan bao cao
  SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_TONGHOP_BC',							//tong hop bao cao
  APPROVE_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_TRINHDUYET_BC_TONGHOP',		//trinh duyet bao cao tong hop
  EDIT_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_SUA_BC_TONGHOP',					//sua bao cao tong hop
  DELETE_SUNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XOA_BC_TONGHOP',				//xoa bao cao tong hop
  COPY_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_COPY_BC_TONGHOP',				//copy bao cao tong hop
  DUYET_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_DUYET_TUCHOI_BC_TH',			//duyet bao cao tong hop
  PHE_DUYET_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_PHEDUYET_TUCHOI_BC_TH',		//phe duyet bao cao tong hop
  VIEW_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XEM_BC_TONGHOP',					//xem bao cao tong hop
  PRINT_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_IN_BC_TONGHOP',					//in bao cao tong hop
  EXPORT_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XUAT_BC_TONGHOP',				//xuat bao cao tong hop
  ADD_SKT_BTC: 'KHVDTNSNN_DTNSNN_LAPTD_NHAP_SO_KIEMTRA_BTC',						//lap skt tran chi tu btc
  EDIT_SKT_BTC: 'KHVDTNSNN_DTNSNN_LAPTD_SUA_SO_KIEMTRA_BTC',						//sua skt tran chi tu btc
  DELETE_SKT_BTC: 'KHVDTNSNN_DTNSNN_LAPTD_XOA_SO_KIEMTRA_BTC',					//xoa skt tran chi tu btc
  ADD_PA_GIAO_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_LAP_PA_GIAO_SOKIEMTRA',				//lap pa giao skt tran chi cho cac don vi
  EDIT_PA_GIAO_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_SUA_PA_GIAO_SOKIEMTRA',				//sua phuong an
  DELETE_PA_GIAO_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_XOA_PA_GIAO_SOKIEMTRA',				//xoa phuong an
  COPY_PA_GIAO_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_COPY_PA_GIAO_SOKIEMTRA',				//copy phuong an
  APPROVE_PA_GIAO_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_LAP_PA_GIAO_SOKIEMTRA',			//trinh duyet phuong an
  DUYET_PA_GIAO_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_DUYET_TUCHOI_PA_GIAO_SKT',			//duyet phuong an
  PHE_DUYET_PA_GIAO_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_PHEDUYET_TUCHOI_PA_GIAO_SKT',	//phe duyet phuong an
  VIEW_PA_GIAO_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_XEM_PA_GIAO_SOKIEMTRA',				//xem phuong an
  PRINT_PA_GIAO_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_IN_PA_GIAO_SOKIEMTRA',				//in phuong an
  EXPORT_PA_GIAO_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_XUAT_PA_GIAO_SOKIEMTRA',			//xuat phuong an
  ADD_QDCV_GIAO_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_NHAP_CV_QD_GIAO_SOKIEMTRA',			//nhap so qdcv
  EDIT_QDCV_GIAO_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_SUA_CV_QD_GIAO_SOKIEMTRA',			//sua so qdcv
  DELETE_QDCV_GIAO_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_XOA_CV_QD_GIAO_SOKIEMTRA',		//xoa so qdcv
  GIAO_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_GIAO_SOKIEMTRA',								//giao skt tran chi
  NHAN_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_NHAN_SO_KIEMTRA',								//nhan skt tran chi
  EDIT_REPORT_AFTER_RECEIVE_SKT: 'KHVDTNSNN_DTNSNN_LAPTD_SUA_BC_SAU_SOKIEMTRA',	//sua bao cao sau khi nhan skt ran chi
};

///////////////////// GIAO DU TOAN /////////////////////////////////
export const GDT = {
  //  :'KHVDTNSNN_DTNSNN_GIAODT_NHAP_QUYETDINH_BTC',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_SUA_QUYETDINH_BTC',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_XOA_QUYETDINH_BTC',

  //  :'KHVDTNSNN_DTNSNN_GIAODT_LAP_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_TRINHDUYET_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_SUA_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_XOA_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_COPY_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_DUYET_TUCHOI_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_PHEDUYET_TUCHOI_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_XEM_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_IN_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_XUAT_PA_PBDT',

  //  :'KHVDTNSNN_DTNSNN_GIAODT_NHAP_CV_QD_GIAO_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_SUA_CV_QD_GIAO_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_XOA_CV_QD_GIAO_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_GIAO_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_NHAN_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_TRINHTONGCUC_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_TIEPNHAN_TUCHOI_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_TONGHOP_PA_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_TRINHDUYET_PA_TONGHOP_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_SUA_PA_TONGHOP_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_XOA_PA_TONGHOP_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_COPY_PA_TONGHOP_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_DUYET_TUCHOI_PA_TH_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_PHEDUYET_TUCHOI_PA_TH_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_XEM_PA_TONGHOP_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_IN_PA_TONGHOP_PBDT',
  //  :'KHVDTNSNN_DTNSNN_GIAODT_XUAT_PA_TONGHOP_PBDT',
}

///////////////////// DIEU CHINH DU TOAN ////////////////////////////
export const DCDT = {
  ADD_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_LAP_BC',
  APPROVE_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_TRINHDUYET_BC',
  EDIT_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_SUA_BC',
  DELETE_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XOA_BC',
  COPY_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_COPY_BC',
  DUYET_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_DUYET_TUCHOI_BC',
  PHE_DUYET_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_PHEDUYET_TUCHOI_BC',
  VIEW_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XEM_BC',
  PRINT_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_IN_BC',
  EXPORT_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XUAT_BC',
  TIEP_NHAN_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_TIEPNHAN_TUCHOI_BC',
  SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_TONGHOP_BC',
  APPROVE_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_TRINHDUYET_BC_TONGHOP',
  EDIT_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_SUA_BC_TONGHOP',
  DELETE_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XOA_BC_TONGHOP',
  COPY_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_COPY_BC_TONGHOP',
  DUYET_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_DUYET_TUCHOI_BC_TH',
  PHE_DUYET_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_PHEDUYET_TUCHOI_BC_TH',
  VIEW_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XEM_BC_TONGHOP',
  PRINT_SYTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_IN_BC_TONGHOP',
  EXPORT_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XUAT_BC_TONGHOP',
};

//////////////////// BAO CAO THUC HIEN DU TOAN CHI ////////////////////////////
export const BCDTC = {
  ADD_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_LAP_BC',
  APPROVE_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_TRINHDUYET_BC',
  EDIT_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_SUA_BC',
  DELETE_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_XOA_BC',
  COPY_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_COPY_BC',
  DUYET_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_DUYET_TUCHOIDUYET_BC',
  PHE_DUYET_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_PHEDUYET_TUCHOIPHEDUYET_BC',
  VIEW_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_XEM_BC',
  PRINT_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_IN_BC',
  EXPORT_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_XUAT_BC',
  TIEP_NHAN_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_TIEPNHAN_TUCHOI_BC',
  SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_TONGHOP_BC',
  APPROVE_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_TRINHDUYET_BC_TONGHOP',
  EDIT_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_SUA_BC_TONGHOP',
  DELETE_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_XOA_BC_TONGHOP',
  COPY_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_COPY_BC_TONGHOP',
  DUYET_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_DUYET_TUCHOIDUYET_BC_TONGHOP',
  PHE_DUYET_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_PHEDUYET_TUCHOIPHEDUYET_BC_TONGHOP',
  VIEW_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_XEM_BC_TONGHOP',
  PRINT_SYTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_IN_BC_TONGHOP',
  EXPORT_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_XUAT_BC_TONGHOP',
};

/////////////////// BAO CAO THUC HIEN VON PHI /////////////////////////////
export const BCVP = {
  ADD_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_LAP_BC',
  APPROVE_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_TRINHDUYET_BC',
  EDIT_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_SUA_BC',
  DELETE_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_XOA_BC',
  COPY_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_COPY_BC',
  DUYET_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_DUYET_TUCHOIDUYET_BC',
  PHE_DUYET_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_PHEDUYET_TUCHOIPHEDUYET_BC',
  VIEW_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_XEM_BC',
  PRINT_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_IN_BC',
  EXPORT_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_XUAT_BC',
  TIEP_NHAN_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_TIEPNHAN_TUCHOI_BC',
  SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_TONGHOP_BC',
  APPROVE_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_TRINHDUYET_BC_TONGHOP',
  EDIT_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_SUA_BC_TONGHOP',
  DELETE_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_XOA_BC_TONGHOP',
  COPY_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_COPY_BC_TONGHOP',
  DUYET_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_DUYET_TUCHOIDUYET_BC_TONGHOP',
  PHE_DUYET_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_PHEDUYET_BC_TONGHOP',
  VIEW_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_XEM_BC_TONGHOP',
  PRINT_SYTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_IN_BC_TONGHOP',
  EXPORT_SYNTHETIC_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_XUAT_BC_TONGHOP',
  EXPORT_EXCEL_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_XUAT_BC_EXCEL',
};

/////////////////// CAP VON MUA  BAN //////////////////////////////////
export const CVMB = {
  //thanh toan cho khach hang
  ADD_REPORT_TTKH: 'VONPHIHANG_VONMBANTT_LAP_BC_TT_KH',
  APPROVE_REPORT_TTKH: 'VONPHIHANG_VONMBANTT_TRINHDUYET_BC_TT_KH',
  EDIT_REPORT_TTKH: 'VONPHIHANG_VONMBANTT_SUA_BC_TT_KH',
  DELETE_REPORT_TTKH: 'VONPHIHANG_VONMBANTT_XOA_BC_TT_KH',
  COPY_REPORT_TTKH: 'VONPHIHANG_VONMBANTT_COPY_BC_TT_KH',
  DUYET_REPORT_TTKH: 'VONPHIHANG_VONMBANTT_DUYET_TUCHOIDUYET_BC_TT_KH',
  PHE_DUYET_REPORT_TTKH: 'VONPHIHANG_VONMBANTT_PHEDUYET_TUCHOIPHEDUYET_BC_TT_KH',
  VIEW_REPORT_TTKH: 'VONPHIHANG_VONMBANTT_XEM_BC_TT_KH',
  PRINT_REPORT_TTKH: 'VONPHIHANG_VONMBANTT_IN_BC_TT_KH',
  EXPORT_REPORT_TTKH: 'VONPHIHANG_VONMBANTT_XUAT_BC_TT_KH',
  //bao cao cap von
  ADD_REPORT_CV: 'VONPHIHANG_VONMBANTT_LAP_CV',
  APPROVE_REPORT_CV: 'VONPHIHANG_VONMBANTT_TRINHDUYET_CV',
  EDIT_REPORT_CV: 'VONPHIHANG_VONMBANTT_SUA_CV',
  DELETE_REPORT_CV: 'VONPHIHANG_VONMBANTT_XOA_CV',
  COPY_REPORT_CV: 'VONPHIHANG_VONMBANTT_COPY_CV',
  DUYET_REPORT_CV: 'VONPHIHANG_VONMBANTT_DUYET_TUCHOIDUYET_CV',
  PHE_DUYET_REPORT_CV: 'VONPHIHANG_VONMBANTT_PHEDUYET_TUCHOIPHEDUYET_CV',
  VIEW_REPORT_CV: 'VONPHIHANG_VONMBANTT_XEM_CV',
  PRINT_REPORT_CV: 'VONPHIHANG_VONMBANTT_IN_CV',
  EXPORT_REPORT_CV: 'VONPHIHANG_VONMBANTT_XUAT_CV',
  //nop tien von ban hang
  ADD_REPORT_NTV_BH: 'VONPHIHANG_VONMBANTT_LAP_BC_NTV_BH',
  APPROVE_REPORT_NTV_BH: 'VONPHIHANG_VONMBANTT_TRINHDUYET_BC_NTV_BH',
  EDIT_REPORT_NTV_BH: 'VONPHIHANG_VONMBANTT_SUA_BC_NTV_BH',
  DELETE_REPORT_NTV_BH: 'VONPHIHANG_VONMBANTT_XOA_BC_NTV_BH',
  COPY_REPORT_NTV_BH: 'VONPHIHANG_VONMBANTT_COPY_BC_NTV_BH',
  DUYET_REPORT_NTV_BH: 'VONPHIHANG_VONMBANTT_DUYET_TUCHOIDUYET_BC_NTV_BH',
  PHE_DUYET_REPORT_NTV_BH: 'VONPHIHANG_VONMBANTT_PHEDUYET_TUCHOIPHEDUYET_NTV_BH',
  VIEW_REPORT_NTV_BH: 'VONPHIHANG_VONMBANTT_XEM_BC_NTV_BH',
  PRINT_REPORT_NTV_BH: 'VONPHIHANG_VONMBANTT_IN_BC_NTV_BH',
  EXPORT_REPORT_NTV_BH: 'VONPHIHANG_VONMBANTT_XUAT_BC_NTV_BH',
  //ghi nhan von
  ADD_REPORT_GNV: 'VONPHIHANG_VONMBANTT_LAP_BC_GNV',
  ADD_REPORT_TC_GNV: 'VONPHIHANG_VONMBANTT_TC_LAP_BC_GNV',
  APPROVE_REPORT_GNV: 'VONPHIHANG_VONMBANTT_TRINHDUYET_BC_GNV',
  EDIT_REPORT_GNV: 'VONPHIHANG_VONMBANTT_SUA_BC_GNV',
  DELETE_REPORT_GNV: 'VONPHIHANG_VONMBANTT_XOA_BC_GNV',
  COPY_REPORT_GNV: 'VONPHIHANG_VONMBANTT_COPY_BC_GNV',
  DUYET_REPORT_GNV: 'VONPHIHANG_VONMBANTT_DUYET_TUCHOIDUYET_BC_GNV',
  PHE_DUYET_REPORT_GNV: 'VONPHIHANG_VONMBANTT_PHEDUYET_TUCHOIPHEDUYET_GNV',
  VIEW_REPORT_GNV: 'VONPHIHANG_VONMBANTT_XEM_BC_GNV',
  PRINT_REPORT_GNV: 'VONPHIHANG_VONMBANTT_IN_BC_GNV',
  EXPORT_REPORT_GNV: 'VONPHIHANG_VONMBANTT_XUAT_BC_GNV',
  //ghi nhan von ban hang
  ADD_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_LAP_BC_GNV_BH',
  APPROVE_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_TRINHDUYET_BC_GNV_BH',
  EDIT_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_SUA_BC_GNV_BH',
  COPY_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_COPY_BC_GNV_BH',
  DUYET_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_DUYET_TUCHOIDUYET_BC_GNV_BH',
  PHE_DUYET_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_PHEDUYET_TUCHOIPHEDUYET_BC_GNV_BH',
  VIEW_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_XEM_BC_GNV_BH',
  PRINT_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_IN_BC_GNV_BH',
  EXPORT_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_XUAT_BC_GNV_BH',
  //nop tien von thua
  ADD_REPORT_NTVT: 'VONPHIHANG_VONMBANTT_LAP_BC_NTV_TH',
  APPROVE_REPORT_NTVT: 'VONPHIHANG_VONMBANTT_TRINHDUYET_BC_NTV_TH',
  EDIT_REPORT_NTVT: 'VONPHIHANG_VONMBANTT_SUA_BC_NTV_TH',
  DELETE_REPORT_NTVT: 'VONPHIHANG_VONMBANTT_XOA_BC_NTV_TH',
  COPY_REPORT_NTVT: 'VONPHIHANG_VONMBANTT_COPY_BC_NTV_TH',
  DUYET_REPORT_NTVT: 'VONPHIHANG_VONMBANTT_DUYET_TUCHOIDUYET_BC_NTV_TH',
  PHE_DUYET_REPORT_NTVT: 'VONPHIHANG_VONMBANTT_PHEDUYET_TUCHOIPHEDUYET_NTV_TH',
  VIEW_REPORT_NTVT: 'VONPHIHANG_VONMBANTT_XEM_BC_NTV_TH',
  PRINT_REPORT_NTVT: 'VONPHIHANG_VONMBANTT_IN_BC_NTV_TH',
  EXPORT_REPORT_NTVT: 'VONPHIHANG_VONMBANTT_XUAT_BC_NTV_TH',
  //ghi nhan tien von thua
  ADD_REPORT_GNV_TH: 'VONPHIHANG_VONMBANTT_LAP_BC_GNV_TH',
  APPROVE_REPORT_GNV_TH: 'VONPHIHANG_VONMBANTT_TRINHDUYET_BC_GNV_TH',
  EDIT_REPORT_GNV_TH: 'VONPHIHANG_VONMBANTT_SUA_BC_GNV_TH',
  COPY_REPORT_GNV_TH: 'VONPHIHANG_VONMBANTT_COPY_BC_GNV_TH',
  DUYET_REPORT_GNV_TH: 'VONPHIHANG_VONMBANTT_DUYET_TUCHOIDUYET_BC_GNV_TH',
  PHE_DUYET_REPORT_GNV_TH: 'VONPHIHANG_VONMBANTT_PHEDUYET_TUCHOIPHEDUYET_BC_GNV_TH',
  VIEW_REPORT_GNV_TH: 'VONPHIHANG_VONMBANTT_XEM_BC_GNV_TH',
  PRINT_REPORT_GNV_TH: 'VONPHIHANG_VONMBANTT_IN_BC_GNV_TH',
  EXPORT_REPORT_GNV_TH: 'VONPHIHANG_VONMBANTT_XUAT_BC_GNV_TH',
};

////////////////// CAP VON NGUON CHI /////////////////////////////////
export const CVNC = {
  ADD_DN_MLT: 'VONPHIHANG_VONCHIDTQG_LAP_DN_MLT',
  APPROVE_DN_MLT: 'VONPHIHANG_VONCHIDTQG_TRINHDUYET_DN_MLT',
  EDIT_DN_MLT: 'VONPHIHANG_VONCHIDTQG_SUA_DN_MLT',
  DELETE_DN_MLT: 'VONPHIHANG_VONCHIDTQG_XOA_DN_MLT',
  COPY_DN_MLT: 'VONPHIHANG_VONCHIDTQG_COPY_DN_MLT',
  PHE_DUYET_DN_MLT: 'VONPHIHANG_VONCHIDTQG_PHEDUYET_TUCHOIPHEDUYET_DN_MLT',
  VIEW_DN_MLT: 'VONPHIHANG_VONCHIDTQG_XEM_DN_MLT',
  PRINT_DN_MLT: 'VONPHIHANG_VONCHIDTQG_IN_DN_MLT',
  EXPORT_DN_MLT: 'VONPHIHANG_VONCHIDTQG_XUAT_DN_MLT',
  ADD_SYNTHETIC_CKV: 'VONPHIHANG_VONCHIDTQG_TONGHOP_DN_MLT',
  APPROVE_SYNTHETIC_CKV: 'VONPHIHANG_VONCHIDTQG_TRINHDUYET_DN_MLT_TONGHOP',
  EDIT_SYNTHETIC_CKV: 'VONPHIHANG_VONCHIDTQG_SUA_DN_MLT_TONGHOP',
  DELETE_SYNTHETIC_CKV: 'VONPHIHANG_VONCHIDTQG_XOA_DN_MLT_TONGHOP',
  COPY_SYNTHETIC_CKV: 'VONPHIHANG_VONCHIDTQG_COPY_DN_MLT_TONGHOP',
  DUYET_SYNTHETIC_CKV: 'VONPHIHANG_VONCHIDTQG_DUYET_TUCHOIDUYET_DN_MLT_TONGHOP',
  PHE_DUYET_SYNTHETIC_CKV: 'VONPHIHANG_VONCHIDTQG_PHEDUYET_TUCHOIPHEDUYET_DN_MLT_TONGHOP',
  VIEW_SYNTHETIC_CKV: 'VONPHIHANG_VONCHIDTQG_XEM_DN_MLT_TONGHOP',
  PRINT_SYNTHETIC_CKV: 'VONPHIHANG_VONCHIDTQG_IN_DN_MLT_TONGHOP',
  EXPORT_SYNTHETIC_CKV: 'VONPHIHANG_VONCHIDTQG_XUAT_DN_MLT_TONGHOP',
  ADD_DN_MVT: 'VONPHIHANG_VONCHIDTQG_LAP_DN_MVT',
  APPROVE_DN_MVT: 'VONPHIHANG_VONCHIDTQG_TRINHDUYET_DN_MVT',
  EDIT_DN_MVT: 'VONPHIHANG_VONCHIDTQG_SUA_DN_MVT',
  DELETE_DN_MVT: 'VONPHIHANG_VONCHIDTQG_XOA_DN_MVT',
  COPY_DN_MVT: 'VONPHIHANG_VONCHIDTQG_COPY_DN_MVT',
  PHE_DUYET_DN_MVT: 'VONPHIHANG_VONCHIDTQG_PHEDUYET_TUCHOIPHEDUYET_DN_MVT',
  VIEW_DN_MVT: 'VONPHIHANG_VONCHIDTQG_XEM_DN_MVT',
  PRINT_DN_MVT: 'VONPHIHANG_VONCHIDTQG_IN_DN_MVT',
  EXPORT_DN_MVT: 'VONPHIHANG_VONCHIDTQG_XUAT_DN_MVT',
  ADD_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_TONGHOP_DN_MLT',
  APPROVE_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_TRINHDUYET_DN_MLT_VT',
  EDIT_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_SUA_DN_MLT_VT',
  DELETE_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_XOA_DN_MLT_VT',
  COPY_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_COPY_DN_MLT_VT',
  DUYET_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_DUYET_TUCHOIDUYET_DN_MLT_VT',
  PHE_DUYET_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_PHEDUYET_TUCHOIPHEDUYET_DN_MLT_VT',
  VIEW_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_XEM_DN_MLT_VT',
  PRINT_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_IN_DN_MLT_VT',
  EXPORT_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_XUAT_DN_MLT_VT',
};

/////////////////////// QUYET TOAN VON PHI ///////////////////////////
export const QTVP = {
  // QTOANVONPHI_LAP_BC
  // QTOANVONPHI_TRINHDUYET_BC
  // QTOANVONPHI_SUA_BC
  // QTOANVONPHI_XOA_BC
  // QTOANVONPHI_COPY_BC
  // QTOANVONPHI_DIEUCHINH_BC
  // QTOANVONPHI_SUA_BC_DIEUCHINH
  // QTOANVONPHI_XOA_BC_DIEUCHINH
  // QTOANVONPHI_COPY_BC_DIEUCHINH
  // QTOANVONPHI_DUYET_TUCHOIDUYET_BC
  // QTOANVONPHI_PHEDUYET_TUCHOIPHEDUYET_BC
  // QTOANVONPHI_XEM_BC
  // QTOANVONPHI_IN_BC
  // QTOANVONPHI_XUAT_BC
};

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

export function exchangeMoney(value: number, oldMoneyUnit: string, newMoneyUnit: string): number {
  const oldUnit = (parseInt(oldMoneyUnit, 10) - 1) * 3;
  const newUnit = (parseInt(newMoneyUnit, 10) - 1) * 3;
  if (!value && value !== 0) {
    return null;
  }
  return value * Math.pow(10, oldUnit - newUnit);
}

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

export function mulNumber(num1: number, num2: number) {
  if ((!num1 && num1 !== 0) || (!num2 && num2 !== 0)) {
    return null;
  }
  return num1 * num2;
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
    displayValue = dau + separateNumber(real) + ',' + separateNumber(imaginary);
  }
  return displayValue;
}

export function separateNumber(str: string): string {
  if (str.length < 4) {
    return str;
  }
  let displayValue!: string;
  let index = str.indexOf('.');
  if (index == -1) {
    displayValue = str.slice(0, -3) + '.' + str.slice(-3);
    str = displayValue;
    index = str.indexOf('.');
  }
  while (index - 3 > 0) {
    displayValue = str.slice(0, index - 3) + '.' + str.slice(index - 3);
    str = displayValue;
    index = str.indexOf('.');
  }
  return displayValue;
}

