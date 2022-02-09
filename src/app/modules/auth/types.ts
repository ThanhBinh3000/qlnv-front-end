import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface AuthenticateInfo {
    email: string;
    password: string;
    currentLanguageCode?: string;
    isPersisMission?: boolean;
}

export interface TokenPayload {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    fullname?: string;
    email: string;
    role: string;
    lastLoginTime: string;
    status: string;
    iat: number;
    exp: number;
    genderId: string;
    genderName: string;
    countryId: string;
    countryName: string;
    educationId: string;
    educationName: string;
    address: string;
    dob: string;
    phoneNumber: string;
}
export interface NotificationResult {
    notifications: [Notification];
    total: number;
}

export interface Notification {
    id: number;
    type: string;
    isRead: boolean;
    sender: {
        id: string;
        fullName: string;
        email: string;
    };
    createdAt: string;
    data?: {
        questionnaireResponseId: string;
    }
}
