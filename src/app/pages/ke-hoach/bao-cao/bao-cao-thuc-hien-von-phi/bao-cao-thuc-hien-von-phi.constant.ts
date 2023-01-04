import { BCVP } from "src/app/Utility/utils";

export const TAB_LIST = [
    {
        name: 'Báo cáo',
        code: 'danhsach',
        status: true,
        role: [BCVP.VIEW_REPORT, BCVP.VIEW_SYNTHETIC_REPORT],
        isSelected: false,
    },
    {
        name: 'Báo cáo từ đơn vị cấp dưới',
        code: 'capduoi',
        status: true,
        role: [BCVP.TIEP_NHAN_REPORT],
        isSelected: false,
    },
    {
        name: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
        code: 'tonghop',
        status: true,
        role: [BCVP.SYNTHETIC_REPORT],
        isSelected: false,
    },
    {
        name: 'Khai thác báo cáo',
        code: 'khaithac',
        status: true,
        role: [BCVP.EXPORT_EXCEL_REPORT],
        isSelected: false,
    },
]
