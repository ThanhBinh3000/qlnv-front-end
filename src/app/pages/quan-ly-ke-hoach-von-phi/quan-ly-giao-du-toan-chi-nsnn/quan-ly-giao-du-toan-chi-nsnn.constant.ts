import { QuanLyGiaoDuToanChiNSNN } from './quan-ly-giao-du-toan-chi-nsnn.type';
import {MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI, MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN} from '../../../constants/routerUrl';
export const QUAN_LY_GIAO_DU_TOAN_CHI_NSNN_LIST: QuanLyGiaoDuToanChiNSNN[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Nhập quyết định giao dự toán chi NSNN',
    description: 'Nhập quyết định giao dự toán chi NSNN',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Tìm kiếm Phương án phân bổ giao dự toán chi NSNN cho các đơn vị',
    description: 'Tìm kiếm Phương án phân bổ giao dự toán chi NSNN cho các đơn vị',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Tìm kiếm giao dự toán chi NSNN của các đơn vị',
    description: 'Tìm kiếm giao dự toán chi NSNN của các đơn vị',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Kiểm tra rà soát báo cáo',
    description: 'Kiểm tra rà soát báo cáo',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Tổng hợp lập kế hoạch phân bổ dự toán của đơn vị',
    description: 'Tổng hợp lập kế hoạch phân bổ dự toán của đơn vị',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tong-hop-lap-ke-hoach-phan-bo-du-toan-cua-don-vi`,
  },
];
