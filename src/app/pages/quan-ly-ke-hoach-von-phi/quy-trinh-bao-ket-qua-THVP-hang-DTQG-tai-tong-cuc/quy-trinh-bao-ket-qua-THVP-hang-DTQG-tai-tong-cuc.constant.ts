import { QuytrinhbaocaoketquaTHVPhangDTQGtaitongtuc } from './quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc.type';
export const MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI = 'qlkh-von-phi';
export const MAIN_ROUTE_QUY_BAO_CAO_KET_QUA_THUC_HIEN_VON_PHI_HANG_DTQG_TAI_TONG_CUC_DTNN = 'quy-trinh-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-tong-cuc-dtnn';

export const QUY_TRINH_BAO_CAO_KET_QUA_THUC_HIEN_THVP_HANG_DTQG_TAI_TONG_CUC_DTNN_LIST: QuytrinhbaocaoketquaTHVPhangDTQGtaitongtuc[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Tìm kiếm báo cáo kết quả thực hiện vốn, phí hàng DTQG',
    description: 'Tìm kiếm báo cáo thực hiện vốn, phí hàng DTQG',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUY_BAO_CAO_KET_QUA_THUC_HIEN_VON_PHI_HANG_DTQG_TAI_TONG_CUC_DTNN}/tim-kiem-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Tổng hợp báo cáo kết quả thực hiện vốn, phí hàng DTQG',
    description: 'Tổng hợp báo cáo kết quả thực hiện vốn, phí hàng DTQG',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUY_BAO_CAO_KET_QUA_THUC_HIEN_VON_PHI_HANG_DTQG_TAI_TONG_CUC_DTNN}/tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg`,
  },
];
