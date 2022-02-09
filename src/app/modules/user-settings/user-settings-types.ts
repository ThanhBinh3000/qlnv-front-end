
import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const US_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');
export interface ChangePasswordInfo {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface AdminAccountInfo {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    address: string;
    genderId: string;
    dob: string;
    countryId: string;
    educationId: string;
}

export interface EmployerAccountInfo {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    address: string;
    genderId: string;
    dob: string;
    countryId: string;
    educationId: string;
}

export interface UpdateIomAccountInfo{
    email: string;
}

export interface UpdateEmployerAccountInfo {
    email: string;
}

export interface UpdateAdmin extends ChangePasswordInfo {
    email: string;
}

export interface UpdateEmployer extends ChangePasswordInfo {
    email: string;
}

