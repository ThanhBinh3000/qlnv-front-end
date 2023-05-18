import { MAIN_ROUTES } from 'src/app/layout/main/main-routing.constant';

export const MAIN_ROUTE_QUYET_TOAN = MAIN_ROUTES.quyetToan;
export const QUAN_LY_QUYET_TOAN = 'quan-ly-thong-tin-quyet-toan'
export const QUAN_LY_QUYET_TOAN_VPH_DTQG = 'quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg'
export const VON_PHI_HANG_CUA_BO_NGANH = 'von-phi-hang-cua-bo-nganh'
export const TONG_HOP_VA_PHE_DUYET = 'tong-hop-va-phe-duyet'
export const ROUTE_LIST_KE_HOACH = [
  // {
  //   icon: 'htvbdh_tcdt_icon-common',
  //   title: 'Quản lý thông tin quyết toán',
  //   url: `/${MAIN_ROUTES.quyetToan}/${QUAN_LY_QUYET_TOAN}`,
  // },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Vốn, phí hàng DTQG',
    url: `/${MAIN_ROUTES.quyetToan}/${QUAN_LY_QUYET_TOAN_VPH_DTQG}`,
  },
  {
    icon: 'htvbdh_tcdt_nhapkhac2',
    title: 'Vốn, phí hàng của Bộ/Ngành',
    url: `/${MAIN_ROUTES.quyetToan}/${VON_PHI_HANG_CUA_BO_NGANH}`,
  },
  {
    icon: 'htvbdh_tcdt_nhapkhac2',
    title: 'Tổng hợp và phê duyệt',
    url: `/${MAIN_ROUTES.quyetToan}/${TONG_HOP_VA_PHE_DUYET}`,
  },

];
