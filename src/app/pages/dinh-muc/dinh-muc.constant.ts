import {ChiTietMenu} from "src/app/models/ChiTietMenu";

export const MAIN_ROUTE_DINH_MUC = 'dinh-muc-nhap-xuat';
export const DINH_MUC_ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_dinhmuc2',
    title: 'Định mức phí',
    url: `/${MAIN_ROUTE_DINH_MUC}/dinh-muc-phi`,
    dropdown: 'dau-thau',
    idHover: 'dauthau',
    hasTab: true,
    accessPermisson: 'QLĐMNXBQ_ĐMPNXBP'
  },
  {
    icon: 'htvbdh_tcdt_dinhmucdungcu',
    title: 'Định mức trang bị công cụ, dụng cụ',
    url: `/${MAIN_ROUTE_DINH_MUC}/dinh-muc-trang-bi-cong-cu-dung-cu`,
    dropdown: 'dinh-muc-cc-dc',
    idHover: 'dinhmucccdc',
    hasTab: true,
    accessPermisson: 'QLĐMNXBQ_ĐMTBCCDC'
  },
  {
    icon: 'htvbdh_tcdt_congcudungcu',
    title: 'Màng PVC và công cụ, dụng cụ',
    url: `/${MAIN_ROUTE_DINH_MUC}/mang-pvc-cong-cu-dung-cu`,
    dropdown: 'hop-dong',
    idHover: 'hop-dong',
    hasTab: false,
    accessPermisson: 'QLĐMNXBQ_MANGPVCVACCDC'
  },
  {
    icon: 'htvbdh_tcdt_dungcuchuyendung',
    title: 'Máy móc, thiết bị chuyên dùng',
    url: `/${MAIN_ROUTE_DINH_MUC}/may-moc-thiet-bi`,
    dropdown: 'hop-dong',
    idHover: 'hop-dong',
    hasTab: false,
    accessPermisson: 'QLĐMNXBQ_MMTBCD'
  },
  {
    icon: 'htvbdh_tcdt_kiemtrachatluong',
    title: 'Bảo hiểm',
    url: `/${MAIN_ROUTE_DINH_MUC}/bao-hiem`,
    dropdown: 'hop-dong',
    idHover: 'hop-dong',
    hasTab: false,
    accessPermisson: 'QLĐMNXBQ_BAOHIEM'
  },
  // {
  //     icon: 'htvbdh_tcdt_baocao2',
  //     title: 'Báo cáo',
  //     url: `/${MAIN_ROUTE_DINH_MUC}/bao-cao`,
  //     dropdown: 'bao-cao',
  //     idHover: 'bao-cao',
  //     hasTab: false,
  //     children: []
  // },
];
