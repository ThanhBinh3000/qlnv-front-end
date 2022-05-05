import { QuyTrinhBaoCaoThucHienDuToanChiNSNN } from './quy-trinh-bao-cao-thuc-hien-du-toan-chi-nsnn.type';
import {MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI, MAIN_ROUTE_QUY_TRINH_BAO_CAO_THUC_HIEN_DU_TOAN_CHI_NSNN} from '../../../constants/routerUrl';
export const QUY_TRINH_BAO_CAO_THUC_HIEN_DU_TOAN_CHI_NSNN_LIST: QuyTrinhBaoCaoThucHienDuToanChiNSNN[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách báo cáo tình hình sử dụng dự toán (giải ngân)tháng/năm',
    description: 'Danh sách báo cáo tình hình sử dụng dự toán (giải ngân)tháng/năm',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUY_TRINH_BAO_CAO_THUC_HIEN_DU_TOAN_CHI_NSNN}/ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách báo cáo tình hình sử dụng dự toán (giải ngân)tháng/năm từ đơn vị dưới',
    description: 'Danh sách báo cáo tình hình sử dụng dự toán (giải ngân)tháng/năm từ đơn vị dưới',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUY_TRINH_BAO_CAO_THUC_HIEN_DU_TOAN_CHI_NSNN}/ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-chi-cuc`,
  },
  // {
  //   icon: 'htvbdh_tcdt_icon-common',
  //   title: 'Danh sách tổng hợp báo cáo điều chỉnh dự toán chi',
  //   description: 'Danh sách tổng hợp báo cáo điều chỉnh dự toán chi',
  //   url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUY_TRINH_BAO_CAO_THUC_HIEN_DU_TOAN_CHI_NSNN}/tim-kiem`,
  // },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Kiểm tra báo cáo thực hiện dự toán (giải ngân) tháng/năm từ các đơn vị dưới',
    description: 'Danh sách tổng hợp báo cáo tình hình sử dụng dự toán (giải ngân)tháng/năm từ đơn vị dưới',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUY_TRINH_BAO_CAO_THUC_HIEN_DU_TOAN_CHI_NSNN}/kiem-tra`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Tổng hợp báo cáo tình hình sử dụng dự toán (giải ngân) tháng/năm',
    description: 'Tổng hợp báo cáo tình hình sử dụng dự toán (giải ngân) tháng/năm',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUY_TRINH_BAO_CAO_THUC_HIEN_DU_TOAN_CHI_NSNN}/tong-hop`,
  },
];
