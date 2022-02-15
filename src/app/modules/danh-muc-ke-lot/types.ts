import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const Danh_Muc_Ke_Lot_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface KeLotModel {
    id: string;
    ghiChu: string;
    maKieuKelot: number;
    tenKieuKelot: string;
    trangThai: string;
}