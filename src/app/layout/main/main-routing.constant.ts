import { RouteInfo } from './main-routing.type';

export const MAIN_ROUTES = {
  kehoach: 'kehoach',
  muaHang: 'mua-hang',
  nhap: 'nhap',
  luuKho: 'luu-kho',
  banHang: 'ban-hang',
  xuat: 'xuat',
  dieuChuyenNoiBo: 'dieu-chuyen-noi-bo',
  kiemTraChatLuong: 'kiem-tra-chat-luong',
  suaChua: 'sua-chua',
  thanhLyTieuHuy: 'thanh-ly-tieu-huy',
  quanLyChatLuong: 'quan-ly-chat-luong',
  khknBaoQuan: 'khkn-bao-quan',
  quanLyKhoTang: 'quan-ly-kho-tang',
  danhMuc: 'danh-muc',
  quantrihethong: 'quan-tri-he-thong'
};

export const LIST_PAGES: RouteInfo[] = [
  {
    title: 'Kế hoạch DTNN',
    route: `${MAIN_ROUTES.kehoach}/chi-tieu-ke-hoach-nam-cap-tong-cuc`,
  },
  {
    title: 'Mua',
    route: MAIN_ROUTES.muaHang,
  },
  {
    title: 'Nhập',
    route: `${MAIN_ROUTES.nhap}/dau-thau/danh-sach-dau-thau`,
  },
  {
    title: 'Lưu kho',
    route: MAIN_ROUTES.luuKho,
  },
  {
    title: 'Bán',
    route: MAIN_ROUTES.banHang,
  },
  {
    title: 'Xuất',
    route: MAIN_ROUTES.xuat,
  },
  {
    title: 'Điều chuyển nội bộ',
    route: MAIN_ROUTES.dieuChuyenNoiBo,
  },
  {
    title: 'Kiểm tra chất lượng',
    route: MAIN_ROUTES.kiemTraChatLuong,
  },
  {
    title: 'Sửa chữa',
    route: MAIN_ROUTES.suaChua,
  },
  {
    title: 'Thanh lý, Tiêu hủy',
    route: MAIN_ROUTES.thanhLyTieuHuy,
  },
  {
    title: 'Quản lý chất lượng',
    route: MAIN_ROUTES.quanLyChatLuong,
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
];
