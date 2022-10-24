import { ChiTietMenu } from "src/app/models/ChiTietMenu";

export const SUA_CHUA_ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Danh sách hàng DTQG bị hỏng cần sửa chữa',
    url: `/danh-sach-hang`,
    dropdown: 'danh-sach-hang',
    idHover: 'danh-sach-hang',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_chitieukehoachnam',
    title: 'Thẩm định và ban hành QĐ sửa chữa hàng DTQG',
    url: `/tong-hop-danh-sach-hang`,
    dropdown: 'tong-hop-danh-sach-hang',
    idHover: 'tong-hop-danh-sach-hang',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_tochucthuchien',
    title: 'Quyết định sửa chữa hàng DTQG',
    url:  '/quyet-dinh-sua-chua',
    dropdown: 'quyet-dinh-sua-chua',
    idHover: 'quyet-dinh-sua-chua',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_dieu_chuyen',
    title: 'Xuất hàng DTQG',
    url: '/xuat-hang-dtqg',
    dropdown:'xuat-hang-dtqg',
    idHover:'xuat-hang-dtqg',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_baocao2',
    title: 'Phiếu kiểm định chất lượng hàng DTQG',
    url: '/phieu-kiem-dinh-chat-luong',
    dropdown: 'phieu-kiem-dinh-chat-luong',
    idHover: 'phieu-kiem-dinh-chat-luong',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_baocao2',
    title: 'Nhập hàng DTQG',
    url: '/nhap-hang-dtqg',
    dropdown: 'nhap-hang-dtqg',
    idHover: 'nhap-hang-dtqg',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_baocao2',
    title: 'Báo cáo kết quả sửa chữa hàng DTQG',
    url:  '/bao-cao-ket-qua',
    dropdown:  'bao-cao-ket-qua',
    idHover:  'bao-cao-ket-qua',
    hasTab: false,
  }
];
