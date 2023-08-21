export const NHAP_MAIN_ROUTE = 'quan-tri-he-thong';
export const NHAP_ROUTE_LIST = [
  {
    id: 1,
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Quản lý cán bộ',
    url: `/${NHAP_MAIN_ROUTE}/quan-ly-can-bo`,
    dropdown: 'quan-ly-can-bo',
    idHover: 'quan-ly-can-bo',
    isCollapse: false,
    isSelected: true
  },
  {
    id: 2,
    icon: 'htvbdh_tcdt_phan-quyen',
    title: 'Quản lý quyền/ nhóm quyền',
    url: `/${NHAP_MAIN_ROUTE}/quan-ly-quyen`,
    dropdown: 'quan-ly-quyen',
    idHover: 'quan-ly-quyen',
    isCollapse: false,
    isSelected: false
  },
  // {
  //   id: 3,
  //   icon: 'htvbdh_tcdt_icon-common',
  //   title: 'Quản lý nhóm quyền',
  //   url: `/${NHAP_MAIN_ROUTE}/quan-ly-nhom-quyen`,
  //   dropdown: 'quan-ly-nhom-quyen',
  //   idHover: 'quan-ly-nhom-quyen',
  //   isSelected: false
  // },
  {
    id: 5,
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Quản trị tham số',
    url: `/${NHAP_MAIN_ROUTE}/quan-tri-tham-so`,
    dropdown: 'quan-tri-tham-so',
    idHover: 'quan-tri-tham-so',
    isCollapse: false,
    isSelected: false
  },
  {
    id: 4,
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Kiểm soát truy cập',
    url: `/${NHAP_MAIN_ROUTE}/kiem-soat-truy-cap`,
    dropdown: 'kiem-soat-truy-cap',
    idHover: 'kiem-soat-truy-cap',
    isCollapse: false,
    isSelected: false
  },
  {
    id: 5,
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Thống kê truy cập',
    url: `/${NHAP_MAIN_ROUTE}/thong-ke-truy-cap`,
    dropdown: 'thong-ke-truy-cap',
    idHover: 'thong-ke-truy-cap',
    isCollapse: false,
    isSelected: false
  },
  {
    id: 6,
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Quản lý thông tin',
    url: `/${NHAP_MAIN_ROUTE}/quan-ly-thong-tin`,
    dropdown: 'quan-ly-thong-tin',
    idHover: 'quan-ly-thong-tin',
    isCollapse: true,
    callapses: [
      {
        id: 1,
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Quản lý chứng thư số',
        url: `/${NHAP_MAIN_ROUTE}/quan-ly-thong-tin/quan-ly-chung-thu-so`,
        dropdown: 'quan-ly-chung-thu-so',
        idHover: 'quan-ly-chung-thu-so',
        isSelected: false
      }
    ],
    isSelected: false
  },
  {
    id: 5,
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Thống kê truy cập',
    url: `/${NHAP_MAIN_ROUTE}/thong-ke-truy-cap`,
    dropdown: 'thong-ke-truy-cap',
    idHover: 'thong-ke-truy-cap',
    isSelected: false
  }
];
