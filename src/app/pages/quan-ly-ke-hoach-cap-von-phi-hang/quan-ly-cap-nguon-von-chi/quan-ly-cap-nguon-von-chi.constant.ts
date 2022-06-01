import { QuanLyCapNguonVonChiNSNN } from './quan-ly-cap-nguon-von-chi.type';
import {MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG, MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN} from '../../../constants/routerUrl';

export const QUAN_LY_CAP_NGUON_VON_CHI_NSNN_LIST: QuanLyCapNguonVonChiNSNN[] = [
  {
    icon: 'htvbdh_tcdt_icon-common',
    title: 'Tìm kiếm',
    description: 'Danh sách công văn đề nghị cấp vốn',
    url: `/${MAIN_ROUTE_QUAN_LY_CAP_VON_PHI_HANG}/${MAIN_ROUTE_QUAN_LY_CAP_NGUON_VON_CHI_NSNN}/tim-kiem`,
  },

];
