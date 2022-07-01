import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const LUU_KHO_MAIN_ROUTE = 'nhap';
export const LUU_KHO_ROUTE_LIST: Array<ChiTietMenu> = [
    {
        icon: 'htvbdh_tcdt_honghoccanbaohanh',
        title: 'Quản lý sổ/thẻ kho',
        url: '',
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
    },
    {
        icon: 'htvbdh_tcdt_kiem_tra_chat_luong',
        title: 'Kiểm tra chất lượng vật tư, thiết bị',
        url: '',
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
    },
    {
        icon: 'htvbdh_tcdt_het_han',
        title: 'Kiểm tra chất lượng trước khi hết hạn',
        url: '',
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
    },
    {
        icon: 'htvbdh_tcdt_theodoibaoquan',
        title: 'Theo dõi bảo quản',
        url: '',
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
    },
    {
        icon: 'htvbdh_tcdt_baocao2',
        title: 'Báo cáo',
        url: '',
        dropdown: 'bao-cao',
        idHover: 'giao-chi-tieu',
        hasTab: false,
    },
];
