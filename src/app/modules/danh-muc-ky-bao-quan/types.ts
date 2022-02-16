import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const Danh_Muc_Ky_Bao_Quan_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface KyBaoQuanModel {
    maKy: string,
    tenKy: string,
    ghiChu: string,
    id: number,
    trangThai: string
}