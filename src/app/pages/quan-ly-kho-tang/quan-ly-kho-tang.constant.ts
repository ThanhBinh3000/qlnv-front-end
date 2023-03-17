import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const QUAN_LY_KHO_TANG_MAIN_ROUTE = 'quan-ly-kho-tang';
export const QUAN_LY_KHO_TANG_ROUTE_LIST: Array<ChiTietMenu> = [
    {
        icon: 'htvbdh_tcdt_chitieukehoachnam',
        title: 'Mạng lưới kho tàng',
        url: `/mang-luoi-kho`,
        dropdown: 'mang-luoi-kho',
        idHover: 'mang-luoi-kho',
        hasTab: false,
    },
    {
        icon: 'htvbdh_tcdt_chitieukehoachnam',
        title: 'Quy hoạch & kế hoạch kho tàng',
        url: `/ke-hoach`,
        dropdown: 'ke-hoach',
        idHover: 'ke-hoach',
        hasTab: false,
    },
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Tiến độ xây dựng, sửa chữa kho tàng',
    url: `/tien-do-xay-dung-va-sua-chua`,
    dropdown: 'tien-do',
    idHover: 'tien-do',
    hasTab: false,
  },
    {
        icon: 'htvbdh_tcdt_tochucthuchien',
        title: 'Thực hiện',
        url: '',
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
    },
    {
        icon: 'htvbdh_tcdt_baocao2',
        title: 'Báo cáo',
        url: '',
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
    },
];
