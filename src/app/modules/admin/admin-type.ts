import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const ADMIN_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface ChangePasswordInfo {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
