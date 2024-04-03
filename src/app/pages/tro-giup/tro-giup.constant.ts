import { ChiTietMenu } from "src/app/models/ChiTietMenu";
export const MAIN_ROUTE_TROGIUP = 'tro-giup'
export const ROUTE_LIST: Array<ChiTietMenu> = [
    {
        icon: 'htvbdh_xac-nhan1',
        title: 'Hướng dẫn sử dụng',
        url: `/${MAIN_ROUTE_TROGIUP}/huong-dan-su-dung`,
        dropdown: 'huong-dan-su-dung',
        idHover: 'huong-dan-su-dung',
        caps: [1, 2, 3],
        hasTab: false,
        accessPermisson: ''
    },
];
