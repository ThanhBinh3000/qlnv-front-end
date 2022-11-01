import { CVMB } from "src/app/Utility/utils";

export const TAB_LIST = [
    {
        name: 'Ghi nhận cấp ứng vốn từ đơn vị cấp trên',
        code: 'gnv',
        status: true,
        role: CVMB.VIEW_REPORT_GNV,
        isSelected: false,
    },
    {
        name: 'Cấp ứng vốn cho đơn vị cấp dưới',
        code: 'cv',
        status: true,
        role: CVMB.VIEW_REPORT_CV,
        isSelected: false,
    },
    {
        name: 'Tiền thừa nộp lên đơn vị cấp trên',
        code: 'tt',
        status: true,
        role: CVMB.VIEW_REPORT_NTVT,
        isSelected: false,
    },
    {
        name: 'Tiền thừa từ đơn vị cấp dưới',
        code: 'gn-tt',
        status: true,
        role: CVMB.VIEW_REPORT_GNV_TH,
        isSelected: false,
    },
    {
        name: 'Thanh toán cho khách hàng',
        code: 'thanhtoan',
        status: true,
        role: CVMB.VIEW_REPORT_GNV_TH,
        isSelected: false,
    },
]
