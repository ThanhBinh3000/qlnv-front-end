import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const Danh_Muc_Dia_Ban_Hanh_Chinh_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface DiaBanHanhChinhModel {
    cap: string,
    id: number,
    maCha: string,
    maDbhc: number,
    maHchinh: string,
    tenDbhc: string,
    trangThai: string
}