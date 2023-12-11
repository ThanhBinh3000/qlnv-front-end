import { MAIN_ROUTES } from "src/app/layout/main/main-routing.constant";
import { ChiTietMenu } from "src/app/models/ChiTietMenu";
export const KHKN_BAO_QUAN_MAIN_ROUTE = MAIN_ROUTES.khcnBaoQuan
export const KHKN_BAO_QUAN_ROUTE_LIST: Array<ChiTietMenu> = [
    {
        icon: 'htvbdh_tcdt_congtrinhnghiencuu',
        title: 'Quản lý công trình nghiên cứu, công nghệ bảo quản',
        url: `/${KHKN_BAO_QUAN_MAIN_ROUTE}/quan-ly-cong-trinh-nghien-cuu-bao-quan`,
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false
    },
    {
        icon: 'htvbdh_tcdt_quytrinhkythuat',
        title: 'Quản lý quy chuẩn, tiêu chuẩn quốc gia',
        url: `/${KHKN_BAO_QUAN_MAIN_ROUTE}/quan-ly-quy-chuan-ky-thuat-quoc-gia`,
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
    },
    // {
    //     icon: 'htvbdh_tcdt_baocao2',
    //     title: 'Báo cáo',
    //     url: '',
    //     dropdown: 'dau-thau',
    //     idHover: 'dauthau',
    //     hasTab: false,
    // },
];
