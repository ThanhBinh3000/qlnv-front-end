import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const QL_Danh_Muc_Hang_DTQG_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface DanhMucHangDTQGModel {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    genderId: string; 
    countryId: string; 
    educationId: string; 
    address: string; 
    dob: string; 
    phoneNumber: string;
}