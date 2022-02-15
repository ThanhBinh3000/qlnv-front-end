import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const Danh_Muc_Loai_Hinh_Nhap_Xuat_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface LoaiHinhNhapXuatModel {
    id: number,
    maLhinh: string,
    tenLhinh: string,
    ghiChu: string,
    trangThai: string
}