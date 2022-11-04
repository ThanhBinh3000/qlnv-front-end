import { LTD } from "src/app/Utility/utils";

export const TAB_LIST = [
    {
        name: 'Dự toán NSNN hàng năm và KHTC 3 năm',
        code: 'danhsach',
        status: true,
        role: [LTD.VIEW_REPORT, LTD.VIEW_SYNTHETIC_REPORT],
        isSelected: false,
    },
    {
        name: 'Báo cáo từ đơn vị cấp dưới',
        code: 'capduoi',
        status: true,
        role: [LTD.TIEP_NHAN_REPORT],
        isSelected: false,
    },
    {
        name: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
        code: 'tonghop',
        status: true,
        role: [LTD.SYNTHETIC_REPORT],
        isSelected: false,
    },
    {
        name: 'Số kiểm tra trần chi từ BTC',
        code: 'ds-skt-btc',
        status: true,
        role: [LTD.ADD_SKT_BTC, LTD.EDIT_SKT_BTC, LTD.DELETE_SKT_BTC],
        isSelected: false,
    },
    {
        name: 'Phương án giao số kiểm tra',
        code: 'ds-pa',
        status: true,
        role: [LTD.VIEW_PA_GIAO_SKT],
        isSelected: false,
    },
    {
        name: 'Số kiểm tra chi từ đơn vị cấp trên',
        code: 'ds-skt',
        status: true,
        role: [LTD.NHAN_SKT],
        isSelected: false,
    },
]
