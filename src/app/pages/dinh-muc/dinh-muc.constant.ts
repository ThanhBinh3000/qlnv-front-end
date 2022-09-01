import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const DINH_MUC_MAIN_ROUTE = 'nhap';
export const DINH_MUC_ROUTE_LIST: Array<ChiTietMenu> = [
    {
        icon: 'htvbdh_tcdt_dinhmuc2',
        title: 'Định mức phí',
        url: `/dinh-muc-phi-bao-quan`,
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: true,
    },
    {
        icon: 'htvbdh_tcdt_dinhmucdungcu',
        title: 'Định Mức trang bị công cụ dụng cụ',
        url: `/dinh-muc-trang-bi-cong-cu`,
        dropdown: 'mua-truc-tiep',
        idHover: 'muatructiep',
        hasTab: true,
    },
    {
        icon: 'htvbdh_tcdt_congcudungcu',
        title: 'Màng PVC và công cụ dụng cụ',
        url: `/mang-pvc-cong-cu-dung-cu`,
        dropdown: 'hop-dong',
        idHover: 'hop-dong',
        hasTab: false,
    },
    {
        icon: 'htvbdh_tcdt_dungcuchuyendung',
        title: 'Máy móc thiết bị chuyên dùng',
        url: `/may-moc-thiet-bi`,
        dropdown: 'hop-dong',
        idHover: 'hop-dong',
        hasTab: false,
    },
    {
        icon: 'htvbdh_tcdt_kiemtrachatluong',
        title: 'Bảo hiểm',
        url: `/bao-hiem`,
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
