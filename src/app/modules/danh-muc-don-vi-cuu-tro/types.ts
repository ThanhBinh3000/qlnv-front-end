import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const Danh_Muc_Don_Vi_Cuu_Tro_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface DonViCuuTroModel {
    maDviCuutro: string,
    tenDviCuutro: string,
    id: number,
    trangThai: string
}