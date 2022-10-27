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
    code: 'KHVDTNSNN'
  },
  {
    title: 'Tình hình cấp vốn, phí hàng',
    route: `${MAIN_ROUTES.capVon}`,
    code: ''
  },
  {
    title: 'Quyết toán vốn, phí hàng DTQG',
    route: `${MAIN_ROUTES.quyetToan}`,
    code: ''
  },
  // {
  //   title: 'Mua hàng DTQG',
  //   route: `${MAIN_ROUTES.muaHang}`,
  // },
  {
    title: 'Nhập hàng DTQG',
    route: `${MAIN_ROUTES.nhap}`,
    code: ''
  },
  // {
  //   title: 'Bán hàng DTQG',
  //   route: MAIN_ROUTES.banHang,
  // },
  {
    title: 'Xuất hàng DTQG',
    route: MAIN_ROUTES.xuat,
    code: ''
  },
  {
    title: 'Điều chuyển nội bộ',
    route: MAIN_ROUTES.dieuChuyen,
    code: ''
  },
  {
    title: 'Sửa chữa hàng DTQG',
    route: MAIN_ROUTES.suaChua,
    code: ''
  },
  {
    title: 'Lưu kho & QL chất lượng',
    route: MAIN_ROUTES.luuKho,
    code: ''
  },
  {
    title: 'QL Định mức nhập, xuất, bảo quản',
    route: MAIN_ROUTES.dinhMucNhapXuat,
    code: ''
  },
  {
    title: 'KH&KN bảo quản',
    route: MAIN_ROUTES.khknBaoQuan,
    code: ''
  },
  {
    title: 'Quản lý kho tàng',
    route: MAIN_ROUTES.quanLyKhoTang,
    code: ''
  },
  {
    title: 'Khai thác báo cáo',
    route: MAIN_ROUTES.khaiThacBaoCao,
    code: ''
  },
  // {
  //   title: 'Quản lý kế hoạch vốn phí',
  //   route: MAIN_ROUTES.qlkhVonPhi,
  // },
  {
    title: 'QTDM',
    route: MAIN_ROUTES.quanTriDanhMuc,
    code: ''
  },
  {
    title: 'QTHT',
    route: MAIN_ROUTES.quanTriHeThong,
    code: ''
  },
];
