import { ChiTietMenu } from '../../models/ChiTietMenu';
import {MAIN_ROUTES} from "../../layout/main/main-routing.constant";
export const KHOI_TAO_DU_LIEU_ROUTE = MAIN_ROUTES.khoiTaoDuLieu

export const MAIN_ROUTE = 'khoi-tao-du-lieu';

export const KHOI_TAO_DU_LIEU_ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Hiện trạng công cụ, dụng cụ',
    url: `/${KHOI_TAO_DU_LIEU_ROUTE}/ht-cong-cu-dung-cu`,
    dropdown: 'ht-cong-cu-dung-cu',
    idHover: 'ht-cong-cu-dung-cu',
    hasTab: false,
    accessPermisson: "QLKT_MLKT"
  },
];
