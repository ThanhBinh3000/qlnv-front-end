import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const BAN_HANG_MAIN_ROUTE = 'ban-hang';
export const BAN_HANG_ROUTE_LIST: Array<ChiTietMenu> = [
        {
                icon: 'htvbdh_tcdt_dauthau',
                title: 'Theo phương thức bán đấu giá',
                url: `/theo-phuong-thuc-ban-dau-gia`,
                dropdown: 'dau-gia',
                idHover: 'daugia',
                hasTab: true,
        },
        {
                icon: 'htvbdh_tcdt_muatructiep',
                title: 'Theo phương thức bán trực tiếp',
                url: `/theo-phuong-thuc-ban-truc-tiep`,
                dropdown: 'ban-truc-tiep',
                idHover: 'bantructiep',
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
