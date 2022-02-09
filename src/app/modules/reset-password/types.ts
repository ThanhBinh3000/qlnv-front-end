import { InjectionToken } from "@angular/core";
import { ApiConstant } from "../types";

export const RESET_PASSWORD_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface ForgotPasswordInfo {
    email: string;
}

export interface ResetPasswordInfo {
    id: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
}
