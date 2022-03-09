export class Utils {
    public static FORMAT_DATE_STR = "dd/MM/yyyy";
    public static FORMAT_DATE_TIME_STR = "dd/MM/yyyy HH:mm:ss";

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
    public static TT_BC_1 = "1"; // Đang soạn,
    public static TT_BC_2 = "2"; // Trình duyệt,
    public static TT_BC_3 = "3"; // Trưởng BP từ chối,
    public static TT_BC_4 = "4"; // Trưởng BP duyệt,
    public static TT_BC_5 = "5"; // Lãnh đạo từ chối,
    public static TT_BC_6 = "6"; // Lãnh đạo duyệt,
    public static TT_BC_7 = "7"; // Gửi ĐV cấp trên,
    public static TT_BC_8 = "8"; // ĐV cấp trên từ chối,
    public static TT_BC_9 = "9"; // Đv cấp trên duyệt,

    // Danh sach quyen
    public static LANH_DAO = 1;// "Lãnh Đạo";
    public static TRUONG_BO_PHAN = 2;// "Trưởng Bộ Phận";
    public static NHAN_VIEN = 3;// "Nhân Viên";

    // Cap don vi
    public static CHI_CUC = "3";
    public static CUC_KHU_VUC = "2";
    public static TONG_CUC = "1";

    //role xoa
    public static btnRoleDel = {
        "status": ['1', '3', '5', '8'],
        "unit": [1, 2],
        "role": [3],
    }

    //role luu
    public static btnRoleSave = {
        "status": ['1', '3', '5', '8'],
        "unit": [1, 2],
        "role": [3],
    }

    //role trinh duyet
    public static btnRoleApprove = {
        "status": ['1'],
        "unit": [1, 2],
        "role": [3],
    }

    //role truong bo phan
    public static btnRoleTBP = {
        "status": ['2'],
        "unit": [1, 2],
        "role": [2],
    }

    //role lanh dao
    public static btnRoleLD = {
        "status": ['4'],
        "unit": [1, 2],
        "role": [1],
    }

    //role gui don vi cap tren
    public static btnRoleGuiDVCT = {
        "status": ['6'],
        "unit": [1, 2],
        "role": [1],
    }

    //role don vi cap tren
    public static btnRoleDVCT = {
        "status": ['7'],
        "unit": [1, 2],
        "role": [4],
    }


    //get role xoa
    public getRoleDel(status: any, unit: any, role: any) {
        return !(Utils.btnRoleDel.status.includes(status) && Utils.btnRoleDel.unit.includes(unit) && Utils.btnRoleDel.role.includes(role));
    }

    //get role luu
    public getRoleSave(status: any, unit: any, role: any) {
        return !(Utils.btnRoleSave.status.includes(status) && Utils.btnRoleSave.unit.includes(unit) && Utils.btnRoleSave.role.includes(role));
    }

    //get role trinh duyet
    public getRoleApprove(status: any, unit: any, role: any) {
        return !(Utils.btnRoleApprove.status.includes(status) && Utils.btnRoleApprove.unit.includes(unit) && Utils.btnRoleApprove.role.includes(role));
    }

    //get role truong bo phan
    public getRoleTBP(status: any, unit: any, role: any) {
        return !(Utils.btnRoleTBP.status.includes(status) && Utils.btnRoleTBP.unit.includes(unit) && Utils.btnRoleTBP.role.includes(role));
    }

    //get role button lanh dao
    public getRoleLD(status: any, unit: any, role: any) {
        return !(Utils.btnRoleLD.status.includes(status) && Utils.btnRoleLD.unit.includes(unit) && Utils.btnRoleLD.role.includes(role));
    }

    //get role button gui don vi cap tren
    public getRoleGuiDVCT(status: any, unit: any, role: any) {
        return !(Utils.btnRoleGuiDVCT.status.includes(status) && Utils.btnRoleGuiDVCT.unit.includes(unit) && Utils.btnRoleGuiDVCT.role.includes(role));
    }

    //get role button don vi cap tren
    public getRoleDVCT(status: any, unit: any, role: any) {
        return !(Utils.btnRoleDVCT.status.includes(status) && Utils.btnRoleDVCT.unit.includes(unit) && Utils.btnRoleDVCT.role.includes(role));
    }

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

    public getStatusName(id: string) {
        let statusName;
        switch (id) {
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
                statusName = "Lãnh đạo duyệt"
                break;
            case Utils.TT_BC_7:
                statusName = "Gửi ĐV cấp trên"
                break;
            case Utils.TT_BC_8:
                statusName = "ĐV cấp trên từ chối"
                break;
            case Utils.TT_BC_9:
                statusName = "Đv cấp trên duyệt"
                break;
            default:
                statusName = id;
                break;
        }
        return statusName;
    }
}
