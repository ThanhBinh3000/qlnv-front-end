import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const THANH_LY_TIEU_HUY_MAIN_ROUTE = 'nhap';
export const THANH_LY_TIEU_HUY_ROUTE_LIST: Array<ChiTietMenu> = [
    {
        icon: 'htvbdh_tcdt_chitieukehoachnam',
        title: 'Kế hoạch',
        url: '',
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
        children: [
            {
                icon: 'htvbdh_tcdt_chitieukehoachnam',
                title: 'Kế hoạch',
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
