import { QuanLyGiaoDuToanChiNSNN } from './quan-ly-giao-du-toan-chi-nsnn.type';
import {MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI, MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN} from '../../../constants/routerUrl';
export const QUAN_LY_GIAO_DU_TOAN_CHI_NSNN_LIST: QuanLyGiaoDuToanChiNSNN[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách quản lý giao dự toán chi tại TC-DTNN',
    description: 'Danh sách quản lý giao dự toán chi tại TC-DTNN',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tim-kiem`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Danh sách tổng hợp báo cáo điều chỉnh dự toán chi',
    description: 'Danh sách tổng hợp báo cáo điều chỉnh dự toán chi',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tim-kiem`,
  },
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Tổng hợp',
    description: 'Tổng hợp số liệu dự toán NSNN hàng năm và KHTC 03 năm',
    url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_GIAO_DU_TOAN_CHI_NSNN}/tong-hop`,
  },
];
