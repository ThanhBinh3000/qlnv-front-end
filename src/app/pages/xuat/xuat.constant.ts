import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const NHAP_MAIN_ROUTE = 'xuat';
export const NHAP_ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_xuatkhoban',
    title: 'Xuất kho theo bán đấu giá và bán trực tiếp',
    url: `/${NHAP_MAIN_ROUTE}/dau-gia`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
    children: [
      {
        icon: 'htvbdh_tcdt_baothoc',
        title: 'Thóc',
        url: '',
        urlTongCuc: '',
        urlCuc: '',
        urlChiCuc: '',
        hasChild: false,
      },
      {
        icon: 'htvbdh_tcdt_baogao',
        title: 'Gạo',
        url: '',
        urlTongCuc: '',
        urlCuc: '',
        urlChiCuc: '',
        hasChild: false,
      },
      {
        icon: 'htvbdh_tcdt_muoi',
        title: 'Muối',
        url: '',
        urlTongCuc: '',
        urlCuc: '',
        urlChiCuc: '',
        hasChild: false,
      },
      {
        icon: 'htvbdh_tcdt_ngan-kho',
        title: 'Vật tư',
        url: '',
        urlTongCuc: '',
        urlCuc: '',
        urlChiCuc: '',
        hasChild: false,
      },
    ],
  },
  {
    icon: 'htvbdh_tcdt_xuatkhac',
    title: 'Xuất khác',
    url: `/${NHAP_MAIN_ROUTE}/cuu-tro-ho-tro`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
    children: [
      {
        icon: 'htvbdh_tcdt_baothoc',
        title: 'Thóc gia công',
        url: '',
        urlTongCuc: '',
        urlCuc: '',
        urlChiCuc: '',
        hasChild: false,
      },
    ],
  },
  {
    icon: 'htvbdh_tcdt_baocao2',
    title: 'Báo cáo',
    url: `/${NHAP_MAIN_ROUTE}/bao-cao`,
    dropdown: 'bao-cao',
    idHover: 'bao-cao',
    hasTab: false,
  },
];
