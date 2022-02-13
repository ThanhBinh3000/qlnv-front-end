import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const Danh_Muc_Hang_Dtqg_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface DanhMucHangDtqgModel {
    ghiChu: string;
    id: 0;
    ma: string;
    maCha: string;
    ten: string;
    trangThai: string;
}
