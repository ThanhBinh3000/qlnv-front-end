import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const QUAN_LY_KHO_TANG_MAIN_ROUTE = 'quan-ly-kho-tang';
export const QUAN_LY_KHO_TANG_ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Mạng lưới kho ',
    url: `/mang-luoi-kho`,
    dropdown: 'mang-luoi-kho',
    idHover: 'mang-luoi-kho',
    hasTab: false,
    accessPermisson: "QLKT_MLKT"
  },
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Quy hoạch & kế hoạch kho ',
    url: `/ke-hoach`,
    dropdown: 'ke-hoach',
    idHover: 'ke-hoach',
    hasTab: false,
    accessPermisson: "QLKT_QHKHKT"
  },
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Tiến độ xây dựng, sửa chữa kho ',
    url: `/tien-do-xay-dung-sua-chua`,
    dropdown: 'tien-do',
    idHover: 'tien-do',
    hasTab: false,
    accessPermisson: "QLKT_TDXDSCKT"
  },
  {
    icon: 'htvbdh_tcdt_tochucthuchien',
    title: 'Tình hình sử dụng kho (Điều chuyển, sáp nhập kho)',
    url: '/sap-nhap-kho',
    dropdown: 'sap-nhap',
    idHover: 'sap-nhap',
    hasTab: false,
    accessPermisson: "QLKT_THSDK"
  },
  // {
  //   icon: 'htvbdh_tcdt_baocao2',
  //   title: 'Báo cáo',
  //   url: '',
  //   dropdown: 'dau-thau',
  //   idHover: 'dauthau',
  //   hasTab: false,
  // },
];
