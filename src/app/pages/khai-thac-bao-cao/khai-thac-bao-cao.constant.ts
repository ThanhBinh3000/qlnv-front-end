export const MAIN_ROUTE = 'khai-thac-bao-cao';
export const ROUTE_LIST = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Báo cáo theo thông tư quyết định',
    url: `/${MAIN_ROUTE}/bao-cao-theo-ttqd`,
    dropdown: 'bao-cao-theo-ttqd',
    idHover: 'bao-cao-theo-ttqd',
    accessPermisson: 'KTBC_TTQD',

  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Báo cáo chất lượng hàng DTQG',
    url: `/${MAIN_ROUTE}/bao-cao-chat-luong-hang-dtqg`,
    dropdown: 'bao-cao-chat-luong-hang-dtqg',
    idHover: 'bao-cao-chat-luong-hang-dtqg',
    accessPermisson: 'KTBC_CLHDTQG',

  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Báo cáo nhập-xuất, mua-bán hàng DTQG',
    url: `/${MAIN_ROUTE}/bao-cao-nhap-xuat-hang-dtqg`,
    dropdown: 'bao-cao-nhap-xuat-hang-dtqg',
    idHover: 'bao-cao-nhap-xuat-hang-dtqg',
    accessPermisson: 'KTBC_NXMBHDTQG',

  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Báo cáo nghiệp vụ quản lý kho tàng',
    url: `/${MAIN_ROUTE}/bao-cao-nghiep-vu-qly-kho`,
    dropdown: 'bao-cao-nghiep-vu-qly-kho',
    idHover: 'bao-cao-nghiep-vu-qly-kho',
    accessPermisson: 'KTBC_NVQLKT',

  }
];
