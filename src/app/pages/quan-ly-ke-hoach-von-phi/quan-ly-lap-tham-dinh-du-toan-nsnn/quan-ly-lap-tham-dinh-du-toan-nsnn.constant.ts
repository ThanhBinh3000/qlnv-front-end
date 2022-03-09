import { QuanLyLapThamDinhDuToanNSNN } from './quan-ly-lap-tham-dinh-du-toan-nsnn.type';
import {MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI, MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN} from '../../../constants/routerUrl';

export const QUAN_LY_THAM_DINH_DU_TOAN_NSNN_LIST: QuanLyLapThamDinhDuToanNSNN[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Tìm kiếm',
    description: 'Tìm kiếm dự toán NSNN hàng năm và KHTC 03 năm',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tim-kiem`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Tổng hợp',
    description: 'Tổng hợp số liệu dự toán NSNN hàng năm và KHTC 03 năm',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/tong-hop`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Xây dựng phương án giao số kiểm tra trần chi NSNN cho các đơn vị',
    description: 'Tổng hợp số liệu dự toán NSNN hàng năm và KHTC 03 năm',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/xay-dung-phuong-an-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Số kiểm tra trần chi NSNN cho các đơn vị',
    description: 'Tổng hợp số liệu dự toán NSNN hàng năm và KHTC 03 năm',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_LAP_THAM_DINH_DU_TOAN_NSNN}/so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi`,
  },
];
