import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const MAIN_ROUTE_KE_HOACH = 'kehoach';
export const ROUTE_LIST_KE_HOACH: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Giao chỉ tiêu kế hoạch đầu năm',
    url: `/${MAIN_ROUTE_KE_HOACH}/chi-tieu-ke-hoach-nam-cap-`,
    dropdown: 'giao-chi-tieu',
    idHover: 'giao-chi-tieu',
    hasTab: false,
    children: [
      {
        icon: 'htvbdh_tcdt_chitieukehoachnam',
        title: 'Giao chỉ tiêu kế hoạch đầu năm',
        hasChild: false,
        url: `/${MAIN_ROUTE_KE_HOACH}/chi-tieu-ke-hoach-nam-cap-`,
        urlTongCuc: `/${MAIN_ROUTE_KE_HOACH}/chi-tieu-ke-hoach-nam-cap-tong-cuc`,
        urlCuc: `/${MAIN_ROUTE_KE_HOACH}/chi-tieu-ke-hoach-nam-cap-cuc`,
        urlChiCuc: `/${MAIN_ROUTE_KE_HOACH}/chi-tieu-ke-hoach-nam-cap-chi-cuc`,
      }
    ]
  },
  {
    icon: 'htvbdh_tcdt_dieuchinhkehoachnam',
    title: 'Điều chỉnh kế hoạch năm',
    url: `/${MAIN_ROUTE_KE_HOACH}/dieu-chinh-chi-tieu-ke-hoach-nam-cap-`,
    dropdown: 'dieu-chinh-chi-tieu',
    idHover: 'giao-chi-tieu',
    hasTab: false,
    children: [
      {
        icon: 'htvbdh_tcdt_dieuchinhkehoachnam',
        title: 'Điều chỉnh kế hoạch năm',
        hasChild: false,
        url: `/${MAIN_ROUTE_KE_HOACH}/dieu-chinh-chi-tieu-ke-hoach-nam-cap-`,
        urlTongCuc: `/${MAIN_ROUTE_KE_HOACH}/dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc`,
        urlCuc: `/${MAIN_ROUTE_KE_HOACH}/dieu-chinh-chi-tieu-ke-hoach-nam-cap-cuc`,
        urlChiCuc: `/${MAIN_ROUTE_KE_HOACH}/dieu-chinh-chi-tieu-ke-hoach-nam-cap-chi-cuc`,
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
