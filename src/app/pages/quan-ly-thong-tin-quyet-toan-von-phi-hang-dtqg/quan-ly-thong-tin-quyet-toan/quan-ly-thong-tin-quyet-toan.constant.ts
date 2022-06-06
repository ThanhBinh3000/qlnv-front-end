import { QuanLyThongTinQuyetToan } from './quan-ly-thong-tin-quyet-toan.type';
import {MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG,MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN} from '../../../constants/routerUrl';

export const QUAN_LY_THONG_TIN_QUYET_TOAN_LIST: QuanLyThongTinQuyetToan[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Quản lý quyết toán vốn, phí hàng DTQG.',
    description: 'Quản lý quyết toán vốn, phí hàng DTQG.',
    url: `/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG}/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN}/danh-sach-bao-cao-quyet-toan-von-phi-hang-DTQG`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách điều chỉnh số liệu sau quyết toán',
    description: 'Danh sách điều chỉnh số liệu sau quyết toán',
    url: `/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG}/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN}/danh-sach-dieu-chinh-so-lieu-sau-quyet-toan`,
  },

];
