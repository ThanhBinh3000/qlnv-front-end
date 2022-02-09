import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const Danh_Muc_Don_Vi_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface DonViModel {
    capDvi: string,
    diaChi: string,
    ghiChu: string,
    id: number,
    kieuDvi: string,
    loaiDvi: string,
    maDvi: string,
    maDviCha: string,
    maHchinh: string,
    maPhuong: string,
    maQuan: string,
    maTinh: string,
    tenDvi: string,
    trangThai: string
}