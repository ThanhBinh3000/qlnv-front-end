import { ChiTietMenu } from 'src/app/models/ChiTietMenu';

export const MAIN_ROUTE_KE_HOACH = 'kehoach';
export const CHI_TIEU_KE_HOACH_NAM = 'chi-tieu-ke-hoach-nam';
export const GIAO_KE_HOACH_VA_DU_TOAN = 'giao-ke-hoach-va-du-toan';
export const THONG_TIN_CHI_TIEU_KE_HOACH_NAM = 'thong-tin-chi-tieu-ke-hoach-nam';
export const DE_XUAT_DIEU_CHINH = 'de-xuat-dieu-chinh';
export const PHUONG_AN_GIA = 'phuong-an-gia';
export const THONG_TIN_DE_XUAT_DIEU_CHINH = 'thong-tin-de-xuat-dieu-chinh';
export const DIEU_CHINH_CHI_TIEU_KE_HOACH_NAM = 'dieu-chinh-chi-tieu-ke-hoach-nam';
export const DIEU_CHINH_THONG_TIN_CHI_TIEU_KE_HOACH_NAM = 'dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam';
export const DU_TOAN_NSNN = 'du-toan-nsnn';
export const ROUTE_LIST_KE_HOACH: Array<any> = [
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Giao kế hoạch và vốn',
    url: `/${MAIN_ROUTE_KE_HOACH}/${GIAO_KE_HOACH_VA_DU_TOAN}`,
    dropdown: 'giao-chi-tieu',
    idHover: 'giao-chi-tieu',
    hasTab: false,
    code: 'KHVDTNSNN_GKHDT',
  },
  {
    icon: 'htvbdh_tcdt_tochucthuchien',
    title: 'Dự toán NSNN ',
    url: `/${MAIN_ROUTE_KE_HOACH}/${DU_TOAN_NSNN}`,
    dropdown: 'de-xuat-dieu-chinh-chi-tieu',
    idHover: 'giao-chi-tieu',
    hasTab: false,
    code: 'KHVDTNSNN_DTNSNN',
  },
  // {
  //   icon: 'htvbdh_tcdt_tochucthuchien',
  //   title: 'Lập kế hoạch và thẩm định dự toán ',
  //   url: `/${MAIN_ROUTE_KE_HOACH}/${DE_XUAT_DIEU_CHINH}`,
  //   dropdown: 'de-xuat-dieu-chinh-chi-tieu',
  //   idHover: 'giao-chi-tieu',
  //   hasTab: false,
  // },
  // {
  //   icon: 'htvbdh_tcdt_kehoachvonphi',
  //   title: 'Tình hình cấp vốn, phí hàng ',
  //   url: `/${MAIN_ROUTE_KE_HOACH}/${DE_XUAT_DIEU_CHINH}`,
  //   dropdown: 'de-xuat-dieu-chinh-chi-tieu',
  //   idHover: 'giao-chi-tieu',
  //   hasTab: false,
  // },
  {
    icon: 'htvbdh_tcdt_quanlychitieu',
    title: 'Phương án giá',
    url: `/${MAIN_ROUTE_KE_HOACH}/${PHUONG_AN_GIA}`,
    // dropdown: 'dieu-chinh-chi-tieu',
    // idHover: 'giao-chi-tieu',
    hasTab: false,
    code: 'KHVDTNSNN_PAGIA',
  },
  {
    icon: 'htvbdh_tcdt_baocao2',
    title: 'Báo cáo',
    url: `/${MAIN_ROUTE_KE_HOACH}/bao-cao`,
    dropdown: 'bao-cao',
    idHover: 'giao-chi-tieu',
    hasTab: false,
    code: 'KHVDTNSNN_BAOCAO',
    children: [],
  },
];
