import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const IOM_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface IomUserInfo {
    fullname: string;
    email: string;
}
export interface ForcePasswordChange {
    newPassword: string;
    confirmPassword: string;
    language: number;
    time: string;
    sig: string;
}

export interface submitDate {
    fromDate: string;
    toDate: string;
}

