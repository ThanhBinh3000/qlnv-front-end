import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const XUAT_MAIN_ROUTE = 'xuat';
export const XUAT_ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_vien_tro',
    title: 'Xuất cấp, cứu trợ, viện trợ',
    url: `/cuu-tro-vien-tro`,
    dropdown: '/cuu-tro-vien-tro',
    idHover: 'cuu-tro-vien-tro',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_dauthau',
    title: 'Xuất theo phương thức bán đấu giá',
    url: `/dau-gia`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_muatructiep',
    title: 'Xuất theo phương thức bán trực tiếp',
    url: `/xuat-truc-tiep`,
    dropdown: 'xuat-truc-tiep',
    idHover: 'xuat-truc-tiep',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_tieuhuy',
    title: 'Xuất Thanh lý',
    url: `/xuat-thanh-ly`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_tieuhuy',
    title: 'Xuất tiêu hủy',
    url: `/xuat-tieu-huy`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Xuất khác',
    url: `/xuat-khac`,
    dropdown: 'xuat-khac',
    idHover: 'xuat-khac',
    hasTab: false,
  },
  /*{
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Hợp đồng/Bảng kê, phiếu bán (bán lẻ)',
    url: `/cuu-tro-ho-tro`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
  },*/
  // {
  //   icon: 'htvbdh_tcdt_baocao2',
  //   title: 'Báo cáo',
  //   url: `/bao-cao`,
  //   dropdown: 'bao-cao',
  //   idHover: 'bao-cao',
  //   hasTab: false,
  // },
];
