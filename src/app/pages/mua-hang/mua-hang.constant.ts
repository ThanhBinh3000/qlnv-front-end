export const MUA_HANG_MAIN_ROUTE = 'nhap';
export const MUA_HANG_ROUTE_LIST = [
    {
        icon: 'htvbdh_tcdt_dauthau',
        title: 'Theo phương thức đấu thầu',
        url: `/${MUA_HANG_MAIN_ROUTE}/dau-thau`,
        dropdown: 'dau-thau',
        idHover: 'dauthau',
    },
    {
        icon: 'htvbdh_tcdt_muatructiep',
        title: 'Theo phương thức mua trực tiếp',
        url: `/${MUA_HANG_MAIN_ROUTE}/mua-truc-tiep`,
        dropdown: 'mua-truc-tiep',
        idHover: 'muatructiep',
    },
    {
        icon: 'htvbdh_tcdt_kynhay',
        title: 'Ký hợp đồng',
        url: `/${MUA_HANG_MAIN_ROUTE}/hop-dong`,
        dropdown: 'hop-dong',
        idHover: 'hop-dong',
        hasChild: true,
        children: [
            {
                icon: 'htvbdh_tcdt_kynhay',
                title: 'Hợp đồng',
                hasChild: false,
                url: '',
                urlTongCuc: '',
                urlCuc: '',
                urlChiCuc: '',
            },
            {
                icon: 'htvbdh_tcdt_kynhay',
                title: 'Phụ lục hợp đồng',
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
        url: `/${MUA_HANG_MAIN_ROUTE}/bao-cao`,
        dropdown: 'bao-cao',
        idHover: 'bao-cao',
    },
];
