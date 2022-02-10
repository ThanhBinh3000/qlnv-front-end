import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export const API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface AuthenticateInfo {
    email: string;
    password: string;
    currentLanguageCode?: string;
    isPersisMission?: boolean;
}

export interface AuthenticateModel {
    email: string;
    password: string;
}

export interface TokenPayload {
    sub: string;
    exp: number;
    iss: string;
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
