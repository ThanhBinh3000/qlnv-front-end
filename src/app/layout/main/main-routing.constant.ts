import { RouteInfo } from './main-routing.type';

export const MAIN_ROUTES = {
  kehoach: 'kehoach',
  muaHang: 'mua-hang',
  nhap: 'nhap',
  nhapKhac: 'nhap-khac',
  luuKho: 'luu-kho',
  banHang: 'ban-hang',
  xuat: 'xuat',
  xuatKhac: 'xuat-khac',
  dinhMucNhapXuat: 'dinh-muc-nhap-xuat',
  khknBaoQuan: 'khkn-bao-quan',
  quanLyKhoTang: 'quan-ly-kho-tang',
  danhMuc: 'danh-muc',
  quantrihethong: 'quan-tri-he-thong',
};

export const LIST_PAGES: RouteInfo[] = [
  {
    title: 'Kế hoạch và vốn DTQG',
    route: `${MAIN_ROUTES.kehoach}`,
  },
  {
    title: 'Lựa chọn nhà cung cấp & ký hợp đồng',
    route: `${MAIN_ROUTES.muaHang}`,
  },
  {
    title: 'Nhập hàng DTQG',
    route: `${MAIN_ROUTES.nhap}`,
  },
  // {
  //   title: 'Nhập khác',
  //   route: `${MAIN_ROUTES.nhapKhac}`,
  // },
  {
    title: 'Lưu kho & QL chất lượng',
    route: MAIN_ROUTES.luuKho,
  },
  {
    title: 'Bán hàng DTQG',
    route: MAIN_ROUTES.banHang,
  },
  {
    title: 'Xuất hàng DTQG',
    route: MAIN_ROUTES.xuat,
  },
  // {
  //   title: 'Xuất khác',
  //   route: MAIN_ROUTES.xuatKhac,
  // },
  {
    title: 'QL Định mức nhập, xuất, bảo quản',
    route: MAIN_ROUTES.dinhMucNhapXuat,
  },
  {
    title: 'KH&KN bảo quản',
    route: MAIN_ROUTES.khknBaoQuan,
  },
  {
    title: 'Quản lý kho tàng',
    route: MAIN_ROUTES.quanLyKhoTang,
  },
  {
    title: 'Quản trị hệ thống',
    route: MAIN_ROUTES.quantrihethong,
  },
  {
    title: 'Quản trị danh mục',
    route: MAIN_ROUTES.danhMuc,
  },
];
