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
  },
  {
    icon: 'htvbdh_tcdt_dieu_chuyen',
    title: 'Xuất điều chuyển nội bộ',
    url: `/${NHAP_MAIN_ROUTE}/cuu-tro-ho-tro`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_vien_tro',
    title: 'Xuất cứu trợ, viện trợ',
    url: `/${NHAP_MAIN_ROUTE}/cuu-tro-ho-tro`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_Thanhly',
    title: 'Xuất Thanh lý, tiêu hủy',
    url: `/${NHAP_MAIN_ROUTE}/cuu-tro-ho-tro`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_xuatkhac',
    title: 'Xuất khác',
    url: `/${NHAP_MAIN_ROUTE}/cuu-tro-ho-tro`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
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
