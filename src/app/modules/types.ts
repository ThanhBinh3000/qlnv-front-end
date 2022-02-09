import { HttpErrorResponse } from '@angular/common/http';

export interface ApiConstant {
    endpoint: string;
    socketServer: string;
}

export interface EpicMedicalResponse<T> {
    message: any;
    response: T;
}

export interface CustomHttpErrorResponse extends HttpErrorResponse {
    errorJson?: any;
}

export interface PaginateOptions {
    pageIndex: number;
    pageSize: number;
}


export type UserStatus = 'Active' | 'Deactivated' ;


export const MIN_PASSWORD_LEN = 8;
