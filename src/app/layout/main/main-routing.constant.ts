import { RouteInfo } from './main-routing.type';

export const MAIN_ROUTES = {
  kehoach: 'kehoach',
  capVon: 'cap-von',
  quyetToan: 'quyet-toan',
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
  // quantrihethong: 'quan-tri-he-thong',
  dieuChuyen: 'dieu-chuyen',
  suaChua: 'sua-chua',
  quanTriDanhMuc: 'quan-tri-danh-muc',
  quanTriHeThong: 'quan-tri-he-thong',
  khaiThacBaoCao: 'khai-thac-bao-cao',
  // qlkhVonPhi: 'qlkh-von-phi',
};

export const LIST_PAGES: RouteInfo[] = [
  {
    title: 'Kế hoạch, vốn và dự toán NSNN',
    route: `${MAIN_ROUTES.kehoach}`,
  },
  {
    title: 'Tình hình cấp vốn, phí hàng',
    route: `${MAIN_ROUTES.capVon}`,
  },
  {
    title: 'Quyết toán vốn, phí hàng DTQG',
    route: `${MAIN_ROUTES.quyetToan}`,
  },
  // {
  //   title: 'Mua hàng DTQG',
  //   route: `${MAIN_ROUTES.muaHang}`,
  // },
  {
    title: 'Nhập hàng DTQG',
    route: `${MAIN_ROUTES.nhap}`,
  },
  // {
  //   title: 'Bán hàng DTQG',
  //   route: MAIN_ROUTES.banHang,
  // },
  {
    title: 'Xuất hàng DTQG',
    route: MAIN_ROUTES.xuat,
  },
  {
    title: 'Điều chuyển nội bộ',
    route: MAIN_ROUTES.dieuChuyen,
  },
  {
    title: 'Sửa chữa hàng DTQG',
    route: MAIN_ROUTES.suaChua,
  },
  {
    title: 'Lưu kho & QL chất lượng',
    route: MAIN_ROUTES.luuKho,
  },
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
    title: 'Khai thác báo cáo',
    route: MAIN_ROUTES.khaiThacBaoCao,
  },
  // {
  //   title: 'Quản lý kế hoạch vốn phí',
  //   route: MAIN_ROUTES.qlkhVonPhi,
  // },
  {
    title: 'QTDM',
    route: MAIN_ROUTES.quanTriDanhMuc,
  },
  {
    title: 'QTHT',
    route: MAIN_ROUTES.quanTriHeThong,
  },
];
