export const NHAP_MAIN_ROUTE = 'quan-tri-he-thong';
export const NHAP_ROUTE_LIST = [
  {
    id: 1,
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Quản lý cán bộ',
    url: `/${NHAP_MAIN_ROUTE}/quan-ly-can-bo`,
    dropdown: 'quan-ly-can-bo',
    idHover: 'quan-ly-can-bo',
    isSelected: true
  },
  {
    id: 2,
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Quản lý quyền/ nhóm quyền',
    url: `/${NHAP_MAIN_ROUTE}/quan-ly-quyen`,
    dropdown: 'quan-ly-quyen',
    idHover: 'quan-ly-quyen',
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
    id: 4,
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Kiểm soát truy cập',
    url: `/${NHAP_MAIN_ROUTE}/kiem-soat-truy-cap`,
    dropdown: 'kiem-soat-truy-cap',
    idHover: 'kiem-soat-truy-cap',
    isSelected: false
  },
];
