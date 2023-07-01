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
    // {
    //     name: 'Số kiểm tra trần chi từ BTC',
    //     code: 'ds-skt-btc',
    //     status: true,
    //     role: [LTD.ADD_SKT_BTC, LTD.EDIT_SKT_BTC, LTD.DELETE_SKT_BTC],
    //     isSelected: false,
    // },
    // {
    //     name: 'Phương án giao số kiểm tra',
    //     code: 'ds-pa',
    //     status: true,
    //     role: [LTD.VIEW_PA_GIAO_SKT],
    //     isSelected: false,
    // },
    // {
    //     name: 'Số kiểm tra chi từ đơn vị cấp trên',
    //     code: 'ds-skt',
    //     status: true,
    //     role: [LTD.NHAN_SKT],
    //     isSelected: false,
    // },
]

export const PHU_LUC = [
    {
        id: '13',
        tenDm: 'Tổng hợp nhu cầu chi ngân sách nhà nước giai đoạn 03 năm',
        tenPl: 'Biểu mẫu số 13',
        status: false,
    },
    {
        id: '14',
        tenDm: 'Tổng hợp nhu cầu chi đầu tư phát triển giai đoạn 3 năm',
        tenPl: 'Biểu mẫu số 14',
        status: false,
    },

    {
        id: '16',
        tenDm: 'Tổng hợp nhu cầu chi thường xuyên giai đoạn 03 năm',
        tenPl: 'Biểu mẫu số 16',
        status: false,
    },
    {
        id: '17',
        tenDm: 'Chi tiết nhu cầu chi thường xuyên giai đoạn 03 năm',
        tenPl: 'Biểu mẫu số 17',
        status: false,
    },
    {
        id: '18',
        tenDm: 'Tổng hợp mục tiêu nhiệm vụ chủ yếu và nhu cầu chi mới giai đoạn 03 năm',
        tenPl: 'Biểu mẫu số 18',
        status: false,
    },
];
