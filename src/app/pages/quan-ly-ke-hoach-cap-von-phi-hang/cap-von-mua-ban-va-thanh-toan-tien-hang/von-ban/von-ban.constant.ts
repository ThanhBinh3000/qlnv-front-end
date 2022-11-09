import { CVMB } from "src/app/Utility/utils";

export const TAB_LIST = [
    {
        name: 'Vốn bán nộp lên đơn vị cấp trên',
        code: 'nop',
        status: true,
        role: CVMB.VIEW_REPORT_NTV_BH,
        isSelected: false,
    },
    {
        name: 'Vốn bán từ đơn vị cấp dưới',
        code: 'ghinhan',
        status: true,
        role: CVMB.VIEW_REPORT_GNV_BH,
        isSelected: false,
    },
]
