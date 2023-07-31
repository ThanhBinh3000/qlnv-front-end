import { MAIN_ROUTES } from 'src/app/layout/main/main-routing.constant';
import { ChiTietMenu } from 'src/app/models/ChiTietMenu';

export const LUU_KHO_MAIN_ROUTE = MAIN_ROUTES.luuKho;
export const LUU_KHO_ROUTE_LIST: Array<ChiTietMenu> = [
  {
    icon: 'htvbdh_tcdt_honghoccanbaohanh',
    title: 'Quản lý sổ/thẻ kho',
    url: `${LUU_KHO_MAIN_ROUTE}/quan-ly-so-kho-the-kho`,
    dropdown: 'quan-ly-so-the-kho',
    idHover: 'sothekho',
    hasTab: false,
  },
  // {
  //   icon: 'htvbdh_tcdt_kiem_tra_chat_luong',
  //   title: 'Kiểm tra chất lượng vật tư, thiết bị',
  //   url: `${LUU_KHO_MAIN_ROUTE}/kiem-tra-chat-luong-vat-tu`,
  //   dropdown: 'kiem-tra-chat-luong-vat-tu-thiet-bi',
  //   idHover: 'kiemtrachatluongvattu',
  //   hasTab: false,
  // },
  // {
  //   icon: 'htvbdh_tcdt_het_han',
  //   title: 'Kiểm tra chất lượng trước khi hết hạn',
  //   url: `${LUU_KHO_MAIN_ROUTE}/kiem-tra-chat-luong-truoc-han`,
  //   dropdown: 'kiem-tra-chat-luong-truoc-khi-het-han',
  //   idHover: 'kiemtrachatluongtruochethan',
  //   hasTab: false,
  // },
  {
    icon: 'htvbdh_tcdt_theodoibaoquan',
    title: 'Hàng trong kho DTQG',
    url: `${LUU_KHO_MAIN_ROUTE}/hang-trong-kho`,
    dropdown: 'theo-doi-bao-quan',
    idHover: 'hangtrongkho',
    hasTab: false,
  },
  {
    icon: 'htvbdh_tcdt_theodoibaoquan',
    title: 'Theo dõi bảo quản',
    url: `${LUU_KHO_MAIN_ROUTE}/theo-doi-bao-quan`,
    dropdown: 'theo-doi-bao-quan',
    idHover: 'theodoibaoquan',
    hasTab: false,
  },
  // {
  //   icon: 'htvbdh_tcdt_baocao2',
  //   title: 'Báo cáo',
  //   url: `${LUU_KHO_MAIN_ROUTE}/bao-cao`,
  //   dropdown: 'bao-cao',
  //   idHover: 'baocao',
  //   hasTab: false,
  // },
];
export const DANH_MUC_LEVEL = {
  TONG_CUC: '1',
  CUC: '2',
  CHI_CUC: '3',
  DIEM_KHO: '4',
  NHA_KHO: '5',
  NGAN_KHO: '6',
  NGAN_LO: '7',
  LO_KHO: '7'
};
