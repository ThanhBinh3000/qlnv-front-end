import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Toàn bộ danh sách hàng DTQG cần sửa chữa ',
    url: `/danh-sach`,
    dropdown: 'danh-sach',
    idHover: 'danh-sach',
    caps: [1],
    hasTab: false,
    accessPermisson: 'SCHDTQG_DSCSC'
  },
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Tổng hợp danh sách hàng DTQG cần sửa chữa',
    url: `/tong-hop`,
    dropdown: 'tong-hop',
    idHover: 'tong-hop',
    hasTab: false,
    caps: [1],
    accessPermisson: 'SCHDTQG_THDSCSC'
  },
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Trình và thẩm định hàng DTQG cần sữa chữa',
    url: `/trinh-tham-dinh`,
    dropdown: 'trinh-tham-dinh',
    idHover: 'trinh-tham-dinh',
    hasTab: false,
    caps: [1],
    accessPermisson: 'SCHDTQG_HSSC'
  },
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Quyết định sửa chữa hàng DTQG',
    url: `/quyet-dinh`,
    dropdown: 'quyet-dinh',
    idHover: 'quyet-dinh',
    hasTab: false,
    accessPermisson: 'SCHDTQG_QDSC'
  },
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Xuất hàng',
    url: `/xuat-hang`,
    dropdown: 'xuat-hang',
    idHover: 'xuat-hang',
    hasTab: false,
    caps: [1, 2, 3],
    accessPermisson: 'SCHDTQG_XH'
  },
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Kiểm tra chất lượng sau SC',
    url: `/kiem-tra-cl`,
    dropdown: 'kiem-tra-cl',
    idHover: 'kiem-tra-cl',
    hasTab: false,
    accessPermisson: 'SCHDTQG_KTCL'
  },
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Nhập hàng',
    url: `/nhap-hang`,
    dropdown: 'nhap-hang',
    idHover: 'nhap-hang',
    hasTab: false,
    accessPermisson: 'SCHDTQG_NH'
  },
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Báo cáo kết quả sữa chữa hàng DTQG',
    url: `/bao-cao`,
    dropdown: 'bao-cao',
    idHover: 'bao-cao',
    hasTab: false,
    // accessPermisson: 'DCNB_KHDC'
  },
];
