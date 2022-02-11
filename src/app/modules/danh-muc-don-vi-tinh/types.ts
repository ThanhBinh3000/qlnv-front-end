import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const Danh_Muc_Don_Vi_Tinh_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface DonViTinhModel {
    maDviTinh: string,
    tenDviTinh: string,
    kyHieu: string,
    id: number,
    dviDo: string,
    trangThai: string
}