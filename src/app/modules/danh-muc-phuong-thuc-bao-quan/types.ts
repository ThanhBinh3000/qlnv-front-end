import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const Danh_Muc_Phuong_Thuc_Bao_Quan_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface PhuongThucBaoQuanModel {
    maPthuc: string,
    tenPthuc: string,
    ghiChu: string,
    id: number,
    trangThai: string
}