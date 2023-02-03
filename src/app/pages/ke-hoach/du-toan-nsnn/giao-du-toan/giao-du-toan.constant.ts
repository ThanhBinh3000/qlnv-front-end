import { GDT } from "src/app/Utility/utils";


export const TAB_LIST = [
    {
        name: 'Quyết định từ Bộ Tài Chính',
        code: 'dsquyetDinh',
        status: true,
        role: [GDT.EDIT_REPORT_BTC],
        isSelected: false,
    },
    {
        name: 'Phân bổ dự toán',
        code: 'dsphanBo',
        status: true,
        role: [
            GDT.VIEW_REPORT_PA_PBDT,
            GDT.DELETE_REPORT_PA_PBDT,
            GDT.EDIT_REPORT_PA_PBDT,
            GDT.ADD_REPORT_CV_QD_GIAO_PA_PBDT,
        ],
        isSelected: false,
    },
    {
        name: 'Dự toán giao từ đơn vị cấp trên',
        code: 'dsGiaoTuCapTren',
        status: true,
        role: [GDT.NHAN_PA_PBDT],
        isSelected: false,
    },
    {
        name: 'Báo cáo từ đơn vị cấp dưới',
        code: 'baoCaoCapDuoi',
        status: true,
        role: [
            GDT.XEM_PA_TONGHOP_PBDT,
        ],
        isSelected: false,
    },
    {
        name: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
        code: 'tongHopBaoCaoCapDuoi',
        status: true,
        role: [
            GDT.XEM_PA_TONGHOP_PBDT,
        ],
        isSelected: false,
    },
    {
        name: 'Danh sách báo cáo',
        code: 'danhSachBaoCao',
        status: true,
        role: [
            GDT.EDIT_REPORT_TH,
            GDT.XOA_REPORT_TH,

        ],
        isSelected: false,
    },
]