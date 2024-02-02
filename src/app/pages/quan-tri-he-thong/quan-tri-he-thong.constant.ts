export const NHAP_MAIN_ROUTE = 'quan-tri-he-thong';
export const NHAP_ROUTE_LIST = [
  {
    id: 1,
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Quản lý người sử dụng',
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
    id: 3,
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
    title: 'Cấu hình & Kiểm soát truy cập',
    url: `/${NHAP_MAIN_ROUTE}/kiem-soat-truy-cap`,
    dropdown: 'kiem-soat-truy-cap',
    idHover: 'kiem-soat-truy-cap',
    isCollapse: false,
    isSelected: false
  },
  {
    id: 5,
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Cấu hình đăng nhập',
    url: `/${NHAP_MAIN_ROUTE}/cau-hinh-dang-nhap`,
    dropdown: 'cau-hinh-dang-nhap',
    idHover: 'cau-hinh-dang-nhap',
    isSelected: false
  },
  {
    id: 9,
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Cấu hình kết nối KTNB',
    url: `/${NHAP_MAIN_ROUTE}/cau-hinh-ktnb`,
    dropdown: 'cau-hinh-ktnb',
    idHover: 'cau-hinh-ktnb',
    isSelected: false
  },
  {
    id: 6,
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Thống kê truy cập',
    url: `/${NHAP_MAIN_ROUTE}/thong-ke-truy-cap`,
    dropdown: 'thong-ke-truy-cap',
    idHover: 'thong-ke-truy-cap',
    isCollapse: false,
    isSelected: false
  },
  {
    id: 7,
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
      },
      {
        id: 2,
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Quản lý thông tin và phần mềm tiện ích',
        url: `/${NHAP_MAIN_ROUTE}/quan-ly-thong-tin/quan-ly-thong-tin-va-tien-ich`,
        dropdown: 'quan-ly-thong-tin-va-tien-ich',
        idHover: 'quan-ly-thong-tin-va-tien-ich',
        isSelected: false
      }
    ],
    isSelected: false
  },
  {
    id: 8,
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Chốt dữ liệu',
    url: `/${NHAP_MAIN_ROUTE}/chot-du-lieu`,
    dropdown: 'chot-du-lieu',
    idHover: 'chot-du-lieu',
    isCollapse: true,
    callapses: [
      {
        id: 1,
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Chốt điều chỉnh giá',
        url: `/${NHAP_MAIN_ROUTE}/chot-du-lieu/chot-dieu-chinh`,
        dropdown: 'chot-dieu-chinh',
        idHover: 'chot-dieu-chinh',
        isSelected: false
      },
      {
        id: 2,
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Chốt nhập xuất',
        url: `/${NHAP_MAIN_ROUTE}/chot-du-lieu/chot-nhap-xuat`,
        dropdown: 'chot-nhap-xuat',
        idHover: 'chot-nhap-xuat',
        isSelected: false
      },
      {
        id: 3,
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Kết chuyển cuối năm',
        url: `/${NHAP_MAIN_ROUTE}/chot-du-lieu/ket-chuyen`,
        dropdown: 'ket-chuyen',
        idHover: 'ket-chuyen',
        isSelected: false
      }
    ],
    isSelected: false
  },
];
