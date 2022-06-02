import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const DINH_MUC_MAIN_ROUTE = 'nhap';
export const DINH_MUC_ROUTE_LIST: Array<ChiTietMenu> = [
    {
        icon: 'htvbdh_tcdt_dinhmuc2',
        title: 'Định mức phí',
        url: `/dau-thau`,
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: true,
    },
    {
        icon: 'htvbdh_tcdt_dinhmucdungcu',
        title: 'Định Mức trang bị công cụ dụng cụ',
        url: `/mua-truc-tiep`,
        dropdown: 'mua-truc-tiep',
        idHover: 'muatructiep',
        hasTab: true,
    },
    {
        icon: 'htvbdh_tcdt_congcudungcu',
        title: 'Màng PVC và công cụ dụng cụ',
        url: `/hop-dong`,
        dropdown: 'hop-dong',
        idHover: 'hop-dong',
        hasTab: false,
    },
    {
        icon: 'htvbdh_tcdt_dungcuchuyendung',
        title: 'Máy móc thiết bị chuyên dùng',
        url: `/hop-dong`,
        dropdown: 'hop-dong',
        idHover: 'hop-dong',
        hasTab: false,
    },
    {
        icon: 'htvbdh_tcdt_kiemtrachatluong',
        title: 'Bảo hiểm',
        url: `/hop-dong`,
        dropdown: 'hop-dong',
        idHover: 'hop-dong',
        hasTab: false,
    },
    {
        icon: 'htvbdh_tcdt_baocao2',
        title: 'Báo cáo',
        url: `/bao-cao`,
        dropdown: 'bao-cao',
        idHover: 'bao-cao',
        hasTab: false,
        children: []
    },
];
