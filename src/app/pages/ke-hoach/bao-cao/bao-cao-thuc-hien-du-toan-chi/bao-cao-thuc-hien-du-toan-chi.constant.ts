import { BCDTC } from "src/app/Utility/utils";

export const TAB_LIST = [
    {
        name: 'Báo cáo',
        code: 'danhsach',
        status: true,
        role: [BCDTC.VIEW_REPORT, BCDTC.VIEW_SYNTHETIC_REPORT],
        isSelected: false,
    },
    {
        name: 'Báo cáo từ đơn vị cấp dưới',
        code: 'capduoi',
        status: true,
        role: [BCDTC.TIEP_NHAN_REPORT],
        isSelected: false,
    },
    {
        name: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
        code: 'tonghop',
        status: true,
        role: [BCDTC.SYNTHETIC_REPORT],
        isSelected: false,
    },
]
