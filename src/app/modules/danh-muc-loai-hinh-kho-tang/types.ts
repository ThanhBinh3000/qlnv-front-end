import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const Danh_Muc_Loai_Hinh_Kho_Tang_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface LoaiHinhKhoTangModel {
    id: number;
    maLhKho: string;
    tenLhKho: string;
    trangThai: string;
    kyHieu: string;
    ghiChu: string;
}