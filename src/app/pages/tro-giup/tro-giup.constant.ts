import { ChiTietMenu } from "src/app/models/ChiTietMenu";
export const MAIN_ROUTE_TROGIUP = 'tro-giup'
export const ROUTE_LIST: Array<ChiTietMenu> = [
    {
        icon: 'htvbdh_cau-hoi',
        title: 'Hướng dẫn sử dụng',
        url: `/${MAIN_ROUTE_TROGIUP}/huong-dan-su-dung`,
        dropdown: 'huong-dan-su-dung',
        idHover: 'huong-dan-su-dung',
        hasTab: false,
        accessPermisson: ''
    },
    {
        icon: 'htvbdh_chi-tiet-2',
        title: 'Giới thiệu hệ thống',
        url: `/${MAIN_ROUTE_TROGIUP}/gioi-thieu-he-thong`,
        dropdown: 'gioi-thi-trong-he-thong',
        idHover: 'gioi-thi-trong-he-thong',
        hasTab: false,
        accessPermisson: ''
    },
];
