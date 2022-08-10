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
    icon: 'htvbdh_tcdt_tat_ca',
    title: 'Tất cả',
    url: `/all`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: true,
  },
  {
    icon: 'htvbdh_tcdt_nhaptheokehoach',
    title: 'Nhập theo phương thức đấu thầu',
    url: `/nhap-theo-ke-hoach`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: true,
  },
  {
    icon: 'htvbdh_tcdt_nhapkhac2',
    title: 'Nhập theo phương thức mua trực tiếp',
    url: `/${NHAP_MAIN_ROUTE}/khac`,
    dropdown: 'khac',
    idHover: 'khac',
    hasTab: true,
  },
  {
    icon: 'htvbdh_tcdt_dieu_chuyen',
    title: 'Nhập khác',
    url: `/${NHAP_MAIN_ROUTE}/khac`,
    dropdown: 'khac',
    idHover: 'khac',
    hasTab: true,
  },
  {
    icon: 'htvbdh_tcdt_nhapkhac2',
    title: 'Hợp đồng/Bảng kê, phiếu mua hàng(mua lẻ)',
    url: `/${NHAP_MAIN_ROUTE}/hop-dong`,
    dropdown: 'khac',
    idHover: 'khac',
    hasTab: true,
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
