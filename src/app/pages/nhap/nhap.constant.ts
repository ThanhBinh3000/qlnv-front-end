import { ChiTietMenu } from 'src/app/models/ChiTietMenu';

export const NHAP_MAIN_ROUTE = 'nhap';
export const NHAP_THEO_KE_HOACH = 'nhap-theo-ke-hoach';
export const NHAP_THEO_PHUONG_THUC_DAU_THAU = 'nhap-theo-phuong-thuc-dau-thau';
export const THOC = 'thoc';
export const GAO = 'gao';
export const MUOI = 'muoi';
export const VAT_TU = 'vat-tu';

export const NHAP_ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_nhaptheokehoach',
    title: 'Nhập theo kế hoạch',
    url: `/nhap-theo-ke-hoach`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: true,
    children: [
      {
        icon: 'htvbdh_tcdt_baothoc',
        title: 'Nhập theo phương thức đấu thầu',
        hasChild: true,
        url: '',
        urlTongCuc: '',
        urlCuc: '',
        urlChiCuc: '',
        children: [
          {
            icon: 'htvbdh_tcdt_baothoc',
            title: 'Thóc',
            url: `/${NHAP_MAIN_ROUTE}/${NHAP_THEO_KE_HOACH}/${NHAP_THEO_PHUONG_THUC_DAU_THAU}/${THOC}`,
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_baogao',
            title: 'Gạo',
            url: `/${NHAP_MAIN_ROUTE}/${NHAP_THEO_KE_HOACH}/${NHAP_THEO_PHUONG_THUC_DAU_THAU}/${GAO}`,
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_muoi',
            title: 'Muối',
            url: `/${NHAP_MAIN_ROUTE}/${NHAP_THEO_KE_HOACH}/${NHAP_THEO_PHUONG_THUC_DAU_THAU}/${MUOI}`,
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_ngan-kho',
            title: 'Vật tư',
            url: `/${NHAP_MAIN_ROUTE}/${NHAP_THEO_KE_HOACH}/${NHAP_THEO_PHUONG_THUC_DAU_THAU}/${VAT_TU}`,
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
        ],
      },
      {
        icon: 'htvbdh_tcdt_baogao',
        title: 'Nhập theo phương thức mua trực tiếp',
        hasChild: true,
        url: '',
        urlTongCuc: '',
        urlCuc: '',
        urlChiCuc: '',
        children: [
          {
            icon: 'htvbdh_tcdt_baothoc',
            title: 'Thóc',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
        ],
      },
    ],
  },
  {
    icon: 'htvbdh_tcdt_nhapkhac2',
    title: 'Nhập khác',
    url: `/${NHAP_MAIN_ROUTE}/khac`,
    dropdown: 'khac',
    idHover: 'khac',
    hasTab: true,
    children: [
      {
        icon: 'htvbdh_tcdt_baothoc',
        title: 'Kế hoạch',
        hasChild: true,
        url: '',
        urlTongCuc: '',
        urlCuc: '',
        urlChiCuc: '',
        children: [
          {
            icon: 'htvbdh_tcdt_baothoc',
            title: 'Thóc',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_baogao',
            title: 'Gạo',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_muoi',
            title: 'Muối',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_ngan-kho',
            title: 'Vật tư',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
        ],
      },
      {
        icon: 'htvbdh_tcdt_baothoc',
        title: 'Tổ chức thực hiện',
        hasChild: true,
        url: '',
        urlTongCuc: '',
        urlCuc: '',
        urlChiCuc: '',
        children: [
          {
            icon: 'htvbdh_tcdt_baothoc',
            title: 'Thóc',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_baogao',
            title: 'Gạo',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_muoi',
            title: 'Muối',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_ngan-kho',
            title: 'Vật tư',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
        ],
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
