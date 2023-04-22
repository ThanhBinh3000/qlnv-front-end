import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Kế hoạch điều chuyển',
    url: `/ke-hoach-dieu-chuyen`,
    dropdown: 'ke-hoach-dieu-chuyen',
    idHover: 'ke-hoach-dieu-chuyen',
    hasTab: false,
    caps: [1,2,3],
    accessPermisson: 'DCNB_KHDC'
  },
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Tổng hợp kế hoạch điều chuyển',
    url: `/tong-hop-dieu-chuyen-tai-cuc`,
    dropdown: 'tong-hop-dieu-chuyen-tai-cuc',
    idHover: 'tong-hop-dieu-chuyen-tai-cuc',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Tổng hợp kế hoạch điều chuyển',
    url: `/tong-hop-dieu-chuyen-tong-cuc`,
    dropdown: 'tong-hop-dieu-chuyen-tai-tong-cuc',
    idHover: 'tong-hop-dieu-chuyen-tai-tong-cuc',
    hasTab: false,
  },
];
