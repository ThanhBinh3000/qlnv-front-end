import { MAIN_ROUTES } from 'src/app/layout/main/main-routing.constant';

export const MAIN_ROUTE_QUYET_TOAN = MAIN_ROUTES.quyetToan;
export const QUAN_LY_QUYET_TOAN = 'quan-ly-thong-tin-quyet-toan'
export const ROUTE_LIST_KE_HOACH = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Quản lý thông tin quyết toán',
    url: `/${MAIN_ROUTES.quyetToan}/${QUAN_LY_QUYET_TOAN}`,
  },
];
