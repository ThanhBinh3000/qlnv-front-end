import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const DIEU_CHUYEN_NOI_BO_MAIN_ROUTE = 'nhap';
export const DIEU_CHUYEN_NOI_BO_ROUTE_LIST: Array<ChiTietMenu> = [
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
        title: 'Tổ chức thực hiện',
        url: '',
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
        children: [
            {
                icon: 'htvbdh_tcdt_cucdutru2',
                title: 'Cùng 1 chi cục',
                hasChild: false,
                url: '',
                urlTongCuc: '',
                urlCuc: '',
                urlChiCuc: '',
            },
            {
                icon: 'htvbdh_tcdt_cucdutru3',
                title: 'Giữa 2 chi cục',
                hasChild: false,
                url: '',
                urlTongCuc: '',
                urlCuc: '',
                urlChiCuc: '',
            },
            {
                icon: 'htvbdh_tcdt_cucdutru3',
                title: 'Giữa 2 cục',
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
