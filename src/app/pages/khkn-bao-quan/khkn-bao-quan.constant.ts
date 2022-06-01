import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const KHKN_BAO_QUAN_MAIN_ROUTE = 'nhap';
export const KHKN_BAO_QUAN_ROUTE_LIST: Array<ChiTietMenu> = [
    {
        icon: 'htvbdh_tcdt_congtrinhnghiencuu',
        title: 'Công trình nghiên cứu',
        url: '',
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
    },
    {
        icon: 'htvbdh_tcdt_quytrinhkythuat',
        title: 'Quy trình kỹ thuật',
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
