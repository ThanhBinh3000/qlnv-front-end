import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const XUAT_MAIN_ROUTE = 'xuat';
export const XUAT_ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_nhaptheokehoach',
    title: 'Xuất cứu trợ, viện trợ',
    url: `/cuu-tro-vien-tro`,
    dropdown: '/cuu-tro-vien-tro',
    idHover: 'cuu-tro-vien-tro',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_nhapkhac2',
    title: 'Xuất theo phương thức bán đấu giá',
    url: `/dau-gia`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
  },
  // {
  //   icon: 'htvbdh_tcdt_dieu_chuyen',
  //   title: 'Xuất theo phương thức bán trực tiếp',
  //   url: `/cuu-tro-ho-tro`,
  //   dropdown: 'dau-thau',
  //   idHover: 'dauthau',
  //   hasTab: false,
  // },
  {
    icon: 'htvbdh_tcdt_nhapkhac2',
    title: 'Xuất Thanh lý, tiêu hủy',
    url: `/cuu-tro-ho-tro`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Xuất khác',
    url: `/cuu-tro-ho-tro`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Hợp đồng/Bảng kê, phiếu bán (bán lẻ)',
    url: `/cuu-tro-ho-tro`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_baocao2',
    title: 'Báo cáo',
    url: `/bao-cao`,
    dropdown: 'bao-cao',
    idHover: 'bao-cao',
    hasTab: false,
  },
];
