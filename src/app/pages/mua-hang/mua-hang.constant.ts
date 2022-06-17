import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const MUA_HANG_ROUTE_LIST: Array<ChiTietMenu> = [
    {
        icon: 'htvbdh_tcdt_dauthau',
        title: 'Theo phương thức đấu thầu',
        url: `/theo-phuong-thuc-dau-thau`,
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: true,
    },
    {
        icon: 'htvbdh_tcdt_muatructiep',
        title: 'Theo phương thức mua trực tiếp',
        url: `/theo-phuong-thuc-mua-truc-tiep`,
        dropdown: 'mua-truc-tiep',
        idHover: 'muatructiep',
        hasTab: true,
    },
    {
        icon: 'htvbdh_tcdt_kynhay',
        title: 'Quản lý hợp đồng',
        url: `/quan-ly-hop-dong`,
        dropdown: 'hop-dong',
        idHover: 'hop-dong',
        hasTab: false,
    },
    {
        icon: 'htvbdh_tcdt_baocao2',
        title: 'Báo cáo',
        url: `/bao-cao`,
        dropdown: 'bao-cao',
        idHover: 'bao-cao',
        hasTab: false,
        children: []
    },
];
