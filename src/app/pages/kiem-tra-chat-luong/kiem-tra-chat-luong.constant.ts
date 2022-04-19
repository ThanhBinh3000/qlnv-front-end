import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const KIEM_TRA_CHAT_LUONG_MAIN_ROUTE = 'xuat';
export const KIEM_TRA_CHAT_LUONG_ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_bienbannghiemthukelot2',
    title: 'Trong thời gian bảo hành theo hợp đồng',
    url: `/${KIEM_TRA_CHAT_LUONG_MAIN_ROUTE}/cuu-tro-ho-tro`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
    children: [
      {
        icon: 'htvbdh_tcdt_ngan-kho',
        title: 'Vật tư, thiết bị',
        url: '',
        urlTongCuc: '',
        urlCuc: '',
        urlChiCuc: '',
        hasChild: false,
      },
    ],
  },
  {
    icon: 'htvbdh_tcdt_saphethanluukho',
    title: 'Trước khi hết hạn lưu kho',
    url: `/${KIEM_TRA_CHAT_LUONG_MAIN_ROUTE}/dau-gia`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: false,
    children: [
      {
        icon: 'htvbdh_tcdt_baothoc',
        title: 'Thóc',
        url: '',
        urlTongCuc: '',
        urlCuc: '',
        urlChiCuc: '',
        hasChild: false,
      },
      {
        icon: 'htvbdh_tcdt_baogao',
        title: 'Gạo',
        url: '',
        urlTongCuc: '',
        urlCuc: '',
        urlChiCuc: '',
        hasChild: false,
      },
      {
        icon: 'htvbdh_tcdt_muoi',
        title: 'Muối',
        url: '',
        urlTongCuc: '',
        urlCuc: '',
        urlChiCuc: '',
        hasChild: false,
      },
      {
        icon: 'htvbdh_tcdt_ngan-kho',
        title: 'Vật tư, thiết bị',
        url: '',
        urlTongCuc: '',
        urlCuc: '',
        urlChiCuc: '',
        hasChild: false,
      },
    ],
  },
  {
    icon: 'htvbdh_tcdt_baocao2',
    title: 'Báo cáo',
    url: `/${KIEM_TRA_CHAT_LUONG_MAIN_ROUTE}/bao-cao`,
    dropdown: 'bao-cao',
    idHover: 'bao-cao',
    hasTab: false,
  },
];
