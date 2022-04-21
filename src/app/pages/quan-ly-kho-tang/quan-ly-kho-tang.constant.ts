import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const UAN_LY_KHO_TANG_MAIN_ROUTE = 'nhap';
export const QUAN_LY_KHO_TANG_ROUTE_LIST: Array<ChiTietMenu> = [
    {
        icon: 'htvbdh_tcdt_congtrinhnghiencuu',
        title: 'Kê hoạch',
        url: '',
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
        children: [
            {
                icon: 'htvbdh_tcdt_ngan-kho-2',
                title: 'Quy hoạch kho',
                hasChild: false,
                url: '',
                urlTongCuc: '',
                urlCuc: '',
                urlChiCuc: '',
            },
            {
                icon: 'htvbdh_tcdt_chitieukehoachnam',
                title: 'THÔNG TIN ĐẦU TƯ XÂY DỰNG TRUNG HẠN (5 NĂM)',
                hasChild: false,
                url: '',
                urlTongCuc: '',
                urlCuc: '',
                urlChiCuc: '',
            },
            {
                icon: 'htvbdh_tcdt_chitieukehoachnam',
                title: 'KẾ HOẠCH ĐẦU TƯ XÂY DỰNG THEO NĂM',
                hasChild: false,
                url: '',
                urlTongCuc: '',
                urlCuc: '',
                urlChiCuc: '',
            },
            {
                icon: 'htvbdh_tcdt_chitieukehoachnam',
                title: 'KẾ HOẠCH SỬA CHỮA LỚN HẰNG NĂM',
                hasChild: false,
                url: '',
                urlTongCuc: '',
                urlCuc: '',
                urlChiCuc: '',
            },
            {
                icon: 'htvbdh_tcdt_chitieukehoachnam',
                title: 'KẾ HOẠCH SỬA CHỮA HẰNG NĂM',
                hasChild: false,
                url: '',
                urlTongCuc: '',
                urlCuc: '',
                urlChiCuc: '',
            },
        ]
    },
    {
        icon: 'htvbdh_tcdt_tochucthuchien',
        title: 'Thực hiện',
        url: '',
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
        children: [
            {
                icon: 'htvbdh_tcdt_tochucthuchien',
                title: 'Thực hiện',
                hasChild: false,
                url: '',
                urlTongCuc: '',
                urlCuc: '',
                urlChiCuc: '',
            },
        ]
    },
    {
        icon: 'htvbdh_tcdt_baocao2',
        title: 'Báo cáo',
        url: '',
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
    },
];
