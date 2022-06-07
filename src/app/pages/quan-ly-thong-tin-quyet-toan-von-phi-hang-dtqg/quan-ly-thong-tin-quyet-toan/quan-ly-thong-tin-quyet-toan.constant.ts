import { QuanLyThongTinQuyetToan } from './quan-ly-thong-tin-quyet-toan.type';
import {MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG,MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN} from '../../../constants/routerUrl';

export const QUAN_LY_THONG_TIN_QUYET_TOAN_LIST: QuanLyThongTinQuyetToan[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách báo cáo quyết toán vốn, phí hàng DTQG.',
    description: 'Danh sách báo cáo quyết toán vốn, phí hàng DTQG.',
    url: `/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG}/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN}/danh-sach-bao-cao-quyet-toan-von-phi-hang-DTQG`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách điều chỉnh số liệu sau quyết toán',
    description: 'Danh sách điều chỉnh số liệu sau quyết toán',
    url: `/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG}/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN}/danh-sach-bao-cao-dieu-chinh-quyet-toan-von-phi-hang-DTQG`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Duyệt và phê duyệt báo cáo quyết toán ',
    description: 'Duyệt và phê duyệt báo cáo quyết toán ',
    url: `/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN_VON_PHI_HANG_DTQG}/${MAIN_ROUTE_QUAN_LY_THONG_TIN_QUYET_TOAN}/duyet-phe-duyet-bao-cao`,
  },

];
