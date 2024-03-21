import { ChiTietMenu } from '../../models/ChiTietMenu';

export const MAIN_ROUTE = 'khoi-tao-du-lieu';

export const KHOI_TAO_DU_LIEU_ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Hiện trạng công cụ, dụng cụ',
    url: `/ht-cong-cu-dung-cu`,
    dropdown: 'ht-cong-cu-dung-cu',
    idHover: 'ht-cong-cu-dung-cu',
    hasTab: false,
    accessPermisson: "QLKT_MLKT"
  },
];
