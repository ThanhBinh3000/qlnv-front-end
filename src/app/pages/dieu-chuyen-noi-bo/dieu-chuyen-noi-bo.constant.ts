import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_nhaptheokehoach',
    title: 'Kế hoạch điều chuyển',
    url: `/ke-hoach-dieu-chuyen`,
    dropdown: 'ke-hoach-dieu-chuyen',
    idHover: 'ke-hoach-dieu-chuyen',
    hasTab: false,
    caps: [1, 2, 3],
    accessPermisson: 'DCNB_KHDC'
  },
  {
    icon: 'htvbdh_tonghopkhdc',
    title: 'Tổng hợp kế hoạch điều chuyển',
    url: `/tong-hop-dieu-chuyen-tai-cuc`,
    dropdown: 'tong-hop-dieu-chuyen-tai-cuc',
    idHover: 'tong-hop-dieu-chuyen-tai-cuc',
    hasTab: false,
    caps: [2],
    accessPermisson: 'DCNB_TONGHOPDC'
  },
  {
    icon: 'htvbdh_tonghopkhdc',
    title: 'Tổng hợp kế hoạch điều chuyển',
    url: `/tong-hop-dieu-chuyen-tong-cuc`,
    dropdown: 'tong-hop-dieu-chuyen-tai-tong-cuc',
    idHover: 'tong-hop-dieu-chuyen-tai-tong-cuc',
    hasTab: false,
    caps: [1],
    accessPermisson: 'DCNB_TONGHOPDC'
  },
  {
    icon: 'htvbdh_quyetdinhdc',
    title: 'Quyết định điều chuyển/xuất nhập hàng',
    url: `/quyet-dinh-dieu-chuyen`,
    dropdown: 'quyet-dinh-dieu-chuyen',
    idHover: 'quyet-dinh-dieu-chuyen',
    hasTab: false,
    accessPermisson: 'DCNB_QUYETDINHDC'
  },
  {
    icon: 'htvbdh_xuatdieuchuyen',
    title: 'Xuất điều chuyển',
    url: `/xuat-dieu-chuyen`,
    dropdown: 'xuat-dieu-chuyen',
    idHover: 'xuat-dieu-chuyen',
    hasTab: false,
    caps: [1, 2, 3],
    accessPermisson: 'DCNB_XUAT'
  },
  {
    icon: 'htvbdh_nhapdieuchuyen',
    title: 'Nhập điều chuyển',
    url: `/nhap-dieu-chuyen`,
    dropdown: 'nhap-dieu-chuyen',
    idHover: 'nhap-dieu-chuyen',
    hasTab: false,
    // accessPermisson: 'DCNB_KHDC'
  },
  {
    icon: 'htvbdh_tcdt_baocao2',
    title: 'Báo cáo kết quả điều chuyển',
    url: `/bao-cao`,
    dropdown: 'bao-cao',
    idHover: 'bao-cao',
    hasTab: false,
    // accessPermisson: 'DCNB_KHDC'
  },
  {
    icon: 'htvbdh_bbthuathieu',
    title: 'Biên bản ghi nhận thừa/thiếu',
    url: `/bien-ban-thua-thieu`,
    dropdown: 'bien-ban-thua-thieu',
    idHover: 'bien-ban-thua-thieu',
    hasTab: false,
    // accessPermisson: 'DCNB_KHDC'
  },
];
