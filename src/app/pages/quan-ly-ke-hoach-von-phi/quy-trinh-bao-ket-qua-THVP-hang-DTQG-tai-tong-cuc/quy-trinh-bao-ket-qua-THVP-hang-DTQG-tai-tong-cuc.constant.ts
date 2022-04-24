import { QuytrinhbaocaoketquaTHVPhangDTQGtaitongtuc } from './quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc.type';
export const MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI = 'qlkh-von-phi';
export const MAIN_ROUTE_QUY_BAO_CAO_KET_QUA_THUC_HIEN_VON_PHI_HANG_DTQG_TAI_TONG_CUC_DTNN = 'quy-trinh-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-tong-cuc-dtnn';

export const QUY_TRINH_BAO_CAO_KET_QUA_THUC_HIEN_THVP_HANG_DTQG_TAI_TONG_CUC_DTNN_LIST: QuytrinhbaocaoketquaTHVPhangDTQGtaitongtuc[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách báo cáo kết quả thực hiện vốn phí hàng DTQG',
    description: 'Danh sách báo cáo kết quả thực hiện vốn phí hàng DTQG',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUY_BAO_CAO_KET_QUA_THUC_HIEN_VON_PHI_HANG_DTQG_TAI_TONG_CUC_DTNN}/tim-kiem-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách báo cáo kết quả thực hiện vốn phí hàng DTQG từ Chi Cục',
    description: 'Danh sách báo cáo kết quả thực hiện vốn phí hàng DTQG từ Chi Cục',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUY_BAO_CAO_KET_QUA_THUC_HIEN_VON_PHI_HANG_DTQG_TAI_TONG_CUC_DTNN}/duyet-bao-cao-thuc-hien-von-phi-hang-dtqg`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Kiểm tra tình trang phê duyệt báo cáo từ chi cuc',
    description: 'Kiểm tra tình trang phê duyệt báo cáo từ chi cuc',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUY_BAO_CAO_KET_QUA_THUC_HIEN_VON_PHI_HANG_DTQG_TAI_TONG_CUC_DTNN}/kiem-tra-tinh-trang-phe-duyet-bao-cao-tu-chi-cuc`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Tổng hợp báo cáo từ chi cục',
    description: 'Tổng hợp báo cáo từ chi cục',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUY_BAO_CAO_KET_QUA_THUC_HIEN_VON_PHI_HANG_DTQG_TAI_TONG_CUC_DTNN}/tong-hop-bao-tu-chi-cuc`,
  },
];
