import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const Danh_Muc_Cong_Cu_Dung_Cu_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface CongCuDungCuModel {
    ghiChu: string;
    id: number;
    maCcu: string;
    maDviTinh: string;
    tenCcu: string;
    trangThai: string;
}
