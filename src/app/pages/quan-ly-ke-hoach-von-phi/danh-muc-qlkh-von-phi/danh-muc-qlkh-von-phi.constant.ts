import { DanhMucQlkhVonPhi } from './danh-muc-qlkh-von-phi.type';
import {MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI, MAIN_ROUTE_QUAN_LY_DANH_MUC_VON_PHI} from '../../../constants/routerUrl';

export const QUAN_LY_DANH_MUC_VON_PHI_LIST: DanhMucQlkhVonPhi[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách danh mục gốc',
    description: 'Danh sách danh mục gôc',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_DANH_MUC_VON_PHI}/danh-sach-danh-muc-goc`,
  },
  // {
  //   icon: 'htvbdh_tcdt_icon-common',
  //   title: 'Tổng hợp',
  //   description: 'Tổng hợp số liệu dự toán NSNN hàng năm và KHTC 03 năm',
  //   url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tong-hop`,
  // },
  // {
  //   icon: 'htvbdh_tcdt_icon-common',
  //   title: 'Tìm kiếm phương án/QĐ/CV giao số kiểm tra NSNN',
  //   description: 'Tổng hợp số liệu dự toán NSNN hàng năm và KHTC 03 năm',
  //   url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn`,
  // },
  // {
  //   icon: 'htvbdh_tcdt_icon-common',
  //   title: 'Tìm kiếm số kiểm tra trần chi NSNN của các đơn vị',
  //   description: 'Tổng hợp số liệu dự toán NSNN hàng năm và KHTC 03 năm',
  //   url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tim-kiem-so-kiem-tra-tran-chi-nsnn-cua-cac-don-vi`,
  // },
  // {
  //   icon: 'htvbdh_tcdt_icon-common',
  //   title: 'Tìm kiếm văn bản',
  //   description: 'Danh sách văn bản gửi tổng cục dự trữ về dự toán ngân sách nhà nước',
  //   url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/danh-sach-van-ban-gui-tcdt-ve-du-toan-nsnn`,
  // },
];
