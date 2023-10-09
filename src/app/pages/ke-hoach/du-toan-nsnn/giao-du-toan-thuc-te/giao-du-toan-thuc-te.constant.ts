import { Roles } from "src/app/Utility/utils";


export const TAB_LIST = [
    {
        name: 'Quyết định từ Bộ Tài Chính',
        code: 'dsquyetDinh',
        status: true,
        role: [Roles.GTT.XEM_QUYETDINH_BTC],
        isSelected: false,
    },
    {
        name: 'Dự toán giao từ đơn vị cấp trên',
        code: 'dsGiaoTuCapTren',
        status: true,
        role: [Roles.GTT.NHAN_PA_PBDT],
        isSelected: false,
    },
    {
        name: 'Phân bổ dự toán',
        code: 'dsphanBo',
        status: true,
        role: [
            Roles.GTT.XEM_PA_PBDT,
            Roles.GTT.XOA_PA_PBDT,
            Roles.GTT.SUA_PA_PBDT,
            Roles.GTT.NHAP_CV_QD_GIAO_PA_PBDT,
        ],
        isSelected: false,
    },
    {
        name: 'Báo cáo từ đơn vị cấp dưới',
        code: 'baoCaoCapDuoi',
        status: true,
        role: [
            Roles.GTT.XEM_PA_TONGHOP_PBDT,
        ],
        isSelected: false,
    },
    {
        name: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
        code: 'tongHopBaoCaoCapDuoi',
        status: true,
        role: [
            Roles.GTT.XEM_PA_TONGHOP_PBDT,
            Roles.GTT.XEM_BC,
        ],
        isSelected: false,
    },
    {
        name: 'Danh sách báo cáo',
        code: 'danhSachBaoCao',
        status: true,
        role: [
            // Roles.GTT.EDIT_REPORT_TH,
            // Roles.GTT.XOA_REPORT_TH,
            Roles.GTT.XEM_BC,
        ],
        isSelected: false,
    },
]
