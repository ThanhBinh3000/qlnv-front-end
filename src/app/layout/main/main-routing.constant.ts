import { RouteInfo } from './main-routing.type';

export const MAIN_ROUTES = {
  kehoach: 'kehoach',
  nhap: 'nhap',
  xuat: 'xuat',
  tacVuThuongXuyen: 'tac-vu-thuong-xuyen',
  baoCaoNghiepVu: 'bao-cao-nghiep-vu',
  heThong: 'he-thong',
  danhmuc: 'danhmuc',
  qlkhVonPhi: 'qlkh-von-phi',
};

export const LIST_PAGES: RouteInfo[] = [
  {
    title: 'Kế hoạch',
    route: MAIN_ROUTES.kehoach,
  },
  {
    title: 'Nhập',
    route: MAIN_ROUTES.nhap,
  },
  {
    title: 'Xuất',
    route: MAIN_ROUTES.xuat,
  },
  {
    title: 'Tác vụ thường xuyên',
    route: MAIN_ROUTES.tacVuThuongXuyen,
  },
  {
    title: 'Báo cáo nghiệp vụ',
    route: MAIN_ROUTES.baoCaoNghiepVu,
  },
  {
    title: 'Hệ thống',
    route: MAIN_ROUTES.heThong,
  },
  {
    title: 'Danh mục',
    route: MAIN_ROUTES.danhmuc,
  },
  {
    title: 'Quản lý kế hoạch vốn phí',
    route: MAIN_ROUTES.qlkhVonPhi,
  },
];
