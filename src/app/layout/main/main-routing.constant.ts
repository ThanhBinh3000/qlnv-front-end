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
  khcnBaoQuan: 'khcn-bao-quan',
  quanLyKhoTang: 'quan-ly-kho-tang',
  danhMuc: 'danh-muc',
  // quantrihethong: 'quan-tri-he-thong',
  dieuChuyenNoiBo: 'dieu-chuyen-noi-bo',
  suaChua: 'sua-chua',
  quanTriDanhMuc: 'quan-tri-danh-muc',
  quanTriHeThong: 'quan-tri-he-thong',
  khaiThacBaoCao: 'khai-thac-bao-cao',
  baoCaoBoNganh: 'bao-cao-bo-nganh',
  khoiTaoDuLieu: 'khoi-tao-du-lieu',
  troGiup: 'tro-giup'
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
    code: 'VONPHIHANG'
  },
  {
    title: 'Quyết toán vốn, phí hàng DTQG',
    route: `${MAIN_ROUTES.quyetToan}`,
    code: 'QTOANVONPHI'
  },
  {
    title: 'Nhập hàng DTQG',
    route: `${MAIN_ROUTES.nhap}`,
    code: 'NHDTQG'
  },
  {
    title: 'Xuất hàng DTQG',
    route: MAIN_ROUTES.xuat,
    code: 'XHDTQG'
  },
  {
    title: 'Lưu kho & QL chất lượng',
    route: MAIN_ROUTES.luuKho,
    code: 'LKQLCL'
  },
  {
    title: 'Điều chuyển nội bộ',
    route: MAIN_ROUTES.dieuChuyenNoiBo,
    code: 'DCNB'
  },
  {
    title: 'Sửa chữa hàng DTQG',
    route: MAIN_ROUTES.suaChua,
    code: 'SCHDTQG'
  },
  {
    title: 'QL Định mức nhập, xuất, bảo quản',
    route: MAIN_ROUTES.dinhMucNhapXuat,
    code: 'QLĐMNXBQ'
  },
  {
    title: 'KH&CN bảo quản',
    route: MAIN_ROUTES.khcnBaoQuan,
    code: 'KHCNBQ'
  },
  {
    title: 'QL Kho DTQG',
    route: MAIN_ROUTES.quanLyKhoTang,
    code: 'QLKT'
  },
  {
    title: 'Báo cáo Bộ/Ngành',
    route: MAIN_ROUTES.baoCaoBoNganh,
    code: 'BCBN'
  },
  {
    title: 'Khai thác báo cáo',
    route: MAIN_ROUTES.khaiThacBaoCao,
    code: 'KTBC'
  },
  {
    title: 'QTDM',
    route: MAIN_ROUTES.quanTriDanhMuc,
    code: 'QTDM'
  },
  {
    title: 'QTHT',
    route: MAIN_ROUTES.quanTriHeThong,
    code: 'QTHT'
  },
  {
    title: 'Khởi tạo dữ liệu',
    route: MAIN_ROUTES.khoiTaoDuLieu,
    code: 'QLKT'
  },
  {
    title: 'Trợ giúp',
    route: MAIN_ROUTES.troGiup,
    code: ''
  },
];
