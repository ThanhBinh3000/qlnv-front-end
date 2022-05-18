import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const MAIN_ROUTE_KE_HOACH = 'kehoach';
export const CHI_TIEU_KE_HOACH_NAM = 'chi-tieu-ke-hoach-nam';
export const THONG_TIN_CHI_TIEU_KE_HOACH_NAM = 'thong-tin-chi-tieu-ke-hoach-nam';
export const DE_XUAT_DIEU_CHINH = 'de-xuat-dieu-chinh';
export const THONG_TIN_DE_XUAT_DIEU_CHINH = 'thong-tin-de-xuat-dieu-chinh';
export const DIEU_CHINH_CHI_TIEU_KE_HOACH_NAM = 'dieu-chinh-chi-tieu-ke-hoach-nam';
export const DIEU_CHINH_THONG_TIN_CHI_TIEU_KE_HOACH_NAM = 'dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam';
export const ROUTE_LIST_KE_HOACH: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Giao chỉ tiêu kế hoạch đầu năm',
    url: `/${MAIN_ROUTE_KE_HOACH}/${CHI_TIEU_KE_HOACH_NAM}`,
    dropdown: 'giao-chi-tieu',
    idHover: 'giao-chi-tieu',
    hasTab: false,
    children: [
      {
        icon: 'htvbdh_tcdt_chitieukehoachnam',
        title: 'Giao chỉ tiêu kế hoạch đầu năm',
        hasChild: false,
        url: `/${MAIN_ROUTE_KE_HOACH}/${CHI_TIEU_KE_HOACH_NAM}`,
        urlTongCuc: ``,
        urlCuc: ``,
        urlChiCuc: ``,
      }
    ]
  },
  {
    icon: 'htvbdh_tcdt_de_xuat_dieu_chinh',
    title: 'Đề xuất điều chỉnh',
    url: `/${MAIN_ROUTE_KE_HOACH}/${DE_XUAT_DIEU_CHINH}`,
    dropdown: 'de-xuat-dieu-chinh-chi-tieu',
    idHover: 'giao-chi-tieu',
    hasTab: false,
    children: [
      {
        icon: 'htvbdh_tcdt_de_xuat_dieu_chinh',
        title: 'Đề xuất điều chỉnh',
        hasChild: false,
        url: `/${MAIN_ROUTE_KE_HOACH}/${DE_XUAT_DIEU_CHINH}`,
        urlTongCuc: ``,
        urlCuc: ``,
        urlChiCuc: ``,
      }
    ]
  },
  {
    icon: 'htvbdh_tcdt_dieuchinhkehoachnam',
    title: 'Điều chỉnh kế hoạch năm',
    url: `/${MAIN_ROUTE_KE_HOACH}/${DIEU_CHINH_CHI_TIEU_KE_HOACH_NAM}`,
    dropdown: 'dieu-chinh-chi-tieu',
    idHover: 'giao-chi-tieu',
    hasTab: false,
    children: [
      {
        icon: 'htvbdh_tcdt_dieuchinhkehoachnam',
        title: 'Điều chỉnh kế hoạch năm',
        hasChild: false,
        url: `/${MAIN_ROUTE_KE_HOACH}/${DIEU_CHINH_CHI_TIEU_KE_HOACH_NAM}`,
        urlTongCuc: ``,
        urlCuc: ``,
        urlChiCuc: ``,
      }
    ]
  },
  {
    icon: 'htvbdh_tcdt_baocao2',
    title: 'Báo cáo',
    url: `/${MAIN_ROUTE_KE_HOACH}/bao-cao`,
    dropdown: 'bao-cao',
    idHover: 'giao-chi-tieu',
    hasTab: false,
    children: []
  },
];
