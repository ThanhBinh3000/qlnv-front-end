export const NHAP_MAIN_ROUTE = 'nhap';
export const NHAP_ROUTE_LIST = [
  {
    icon: 'htvbdh_tcdt_nhaptheokehoach',
    title: 'Nhập theo kế hoạch',
    url: `/${NHAP_MAIN_ROUTE}/dau-thau`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
  },
  {
    icon: 'htvbdh_tcdt_nhapkhac2',
    title: 'Nhập khác',
    url: `/${NHAP_MAIN_ROUTE}/khac`,
    dropdown: 'khac',
    idHover: 'khac',
    children: [
      {
        data: [
          {
            icon: 'htvbdh_tcdt_baothoc',
            title: 'Thóc',
            description: 'Danh sách quyết định phê duyệt kế hoạch lựa chọn nhà thầu',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_baogao',
            title: 'Gạo',
            description: 'Danh sách quyết định phê duyệt kế hoạch lựa chọn nhà thầu',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_muoi',
            title: 'Muối',
            description: 'Danh sách quyết định phê duyệt kế hoạch lựa chọn nhà thầu',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_ngan-kho',
            title: 'Vật tư',
            description: 'Danh sách quyết định phê duyệt kế hoạch lựa chọn nhà thầu',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
        ]
      },
      {
        data: [
          {
            icon: 'htvbdh_tcdt_baothoc',
            title: 'Thóc',
            description: 'Danh sách quyết định phê duyệt kế hoạch lựa chọn nhà thầu',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_baogao',
            title: 'Gạo',
            description: 'Danh sách quyết định phê duyệt kế hoạch lựa chọn nhà thầu',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_muoi',
            title: 'Muối',
            description: 'Danh sách quyết định phê duyệt kế hoạch lựa chọn nhà thầu',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
          {
            icon: 'htvbdh_tcdt_ngan-kho',
            title: 'Vật tư',
            description: 'Danh sách quyết định phê duyệt kế hoạch lựa chọn nhà thầu',
            url: '',
            urlTongCuc: '',
            urlCuc: '',
            urlChiCuc: '',
          },
        ]
      },
    ]
  },
  {
    icon: 'htvbdh_tcdt_baocao2',
    title: 'Báo cáo',
    url: `/${NHAP_MAIN_ROUTE}/bao-cao`,
    dropdown: 'bao-cao',
    idHover: 'bao-cao',
  },
];
