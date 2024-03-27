import { ChiTietMenu } from '../../models/ChiTietMenu';
import {MAIN_ROUTES} from "../../layout/main/main-routing.constant";
export const KHOI_TAO_DU_LIEU_ROUTE = MAIN_ROUTES.khoiTaoDuLieu

export const MAIN_ROUTE = 'khoi-tao-du-lieu';

export const KHOI_TAO_DU_LIEU_ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_congtrinhnghiencuu',
    title: 'Mạng lưới kho',
    url: `/${KHOI_TAO_DU_LIEU_ROUTE}/mang-luoi-kho`,
    dropdown: 'mang-luoi-kho',
    idHover: 'mang-luoi-kho',
    hasTab: false,
    accessPermisson: "QTDM"
  },
  {
    icon: 'htvbdh_tcdt_congtrinhnghiencuu',
    title: 'Hiện trạng công cụ, dụng cụ',
    url: `/${KHOI_TAO_DU_LIEU_ROUTE}/ht-cong-cu-dung-cu`,
    dropdown: 'ht-cong-cu-dung-cu',
    idHover: 'ht-cong-cu-dung-cu',
    hasTab: false,
    accessPermisson: "QTDM"
  },
  {
    icon: 'htvbdh_tcdt_congtrinhnghiencuu',
    title: 'Hiện trạng máy móc thiết bị',
    url: `/${KHOI_TAO_DU_LIEU_ROUTE}/ht-may-moc-thiet-bi`,
    dropdown: 'ht-may-moc-thiet-bi',
    idHover: 'ht-may-moc-thiet-bi',
    hasTab: false,
    accessPermisson: "QTDM"
  },
  {
    icon: 'htvbdh_tcdt_congtrinhnghiencuu',
    title: 'Hợp đồng sửa chữa kho tàng',
    url: `/${KHOI_TAO_DU_LIEU_ROUTE}/sua-chua-kho-tang`,
    dropdown: 'sua-chua-kho-tang',
    idHover: 'sua-chua-kho-tang',
    hasTab: false,
    accessPermisson: "QTDM"
  },
  // {
  //   icon: 'htvbdh_tcdt_congtrinhnghiencuu',
  //   title: 'Hiện trạng công cụ, dụng cụ',
  //   url: `/${KHOI_TAO_DU_LIEU_ROUTE}/ht-cong-cu-dung-cu`,
  //   dropdown: 'ht-cong-cu-dung-cu',
  //   idHover: 'ht-cong-cu-dung-cu',
  //   hasTab: false,
  //   accessPermisson: "QTDM"
  // }
];
