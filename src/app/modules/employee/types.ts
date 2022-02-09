import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const EMPLOYEE_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface EmployeeUserInfo {
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
export interface ForcePasswordChangeEmployee {
    newPassword: string;
    confirmPassword: string;
    language: number;
    time: string;
    sig: string;
}
