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
    title: 'Công tác đấu thầu',
    url: `/${KHOI_TAO_DU_LIEU_ROUTE}/cong-tac-dau-thau`,
    dropdown: 'hop-dong',
    idHover: 'hop-dong',
    hasTab: false,
    accessPermisson: "QTDM"
  },
  {
    icon: 'htvbdh_tcdt_congtrinhnghiencuu',
    title: 'Công tác đấu giá',
    url: `/${KHOI_TAO_DU_LIEU_ROUTE}/cong-tac-dau-gia`,
    dropdown: 'cong-tac-dau-gia',
    idHover: 'cong-tac-dau-gia',
    hasTab: false,
    accessPermisson: "QTDM"
  },
  {
    icon: 'htvbdh_tcdt_congtrinhnghiencuu',
    title: 'Hợp đồng',
    url: `/${KHOI_TAO_DU_LIEU_ROUTE}/hop-dong`,
    dropdown: 'cong-tac-dau-thau',
    idHover: 'cong-tac-dau-thau',
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
  }
];
