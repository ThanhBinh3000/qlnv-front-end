import { QuanLyGiaoDuToanChiNSNN } from './quan-ly-giao-du-toan-chi-nsnn.type';
import {MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI, MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN} from '../../../constants/routerUrl';
export const QUAN_LY_GIAO_DU_TOAN_CHI_NSNN_LIST: QuanLyGiaoDuToanChiNSNN[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Quyết định giao dự toán chi NSNN do bộ tài chính phê duyệt',
    description: 'Quyết định giao dự toán chi NSNN do bộ tài chính phê duyệt',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tim-kiem`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách kế hoạch phân bổ, giao dự toán cho đơn vị',
    description: 'Danh sách kế hoạch phân bổ, giao dự toán cho đơn vị',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/ds-khoach-pbo-giao-dtoan-cho-don-vi`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách quyết định phân bổ, giao dự toán chi NSNN do Tổng Cục DTNN ban hành ',
    description: 'Danh sách quyết định phân bổ, giao dự toán chi NSNN do Tổng Cục DTNN ban hành',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/ds-quyet-dinh`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách Tổng hợp, lập kế hạch phân bố, giao dự toán của đơn vị trình Tổng Cục',
    description: 'Danh sách Tổng hợp, lập kế hạch phân bố, giao dự toán của đơn vị trình Tổng Cục',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/dsach-tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách nhận/ghi nhận thông tin phân bổ dự toán',
    description: 'Danh sách nhận/ghi nhận thông tin phân bổ dự toán',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/ds-nhan-ghi-nhan-thong-tin-pbo-du-toan`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách báo cáo phân bổ, giao dự toán gửi Tổng Cục',
    description: 'Danh sách báo cáo phân bổ, giao dự toán gửi Tổng Cục',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/danh-sach-bao-cao`,
  },

  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách kế hoạch phân bổ, giao dự toán cho chi cục DTNN/ Văn phòng Cục',
    description: 'Danh sách kế hoạch phân bổ, giao dự toán cho chi cục DTNN/ Văn phòng Cục',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/ds-khoach-pbo-giao-dtoan-cho-chi-cucDTNN-vpCuc`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách kế hoạch phân bổ, giao dự toán cho chi cục DTNN',
    description: 'Danh sách kế hoạch phân bổ, giao dự toán cho chi cục DTNN',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/ds-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN`,
  },
];
