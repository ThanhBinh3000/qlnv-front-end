import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EMPTY, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiConstant, CustomHttpErrorResponse, EpicMedicalResponse } from '../..';
import {
    EmployerAccountInfo,
    AdminAccountInfo,
    UpdateEmployerAccountInfo,
    UpdateIomAccountInfo,
    US_API_TOKEN,
} from '../user-settings-types';

@Injectable()
export class MyAccountService {
    urlDefault = this.apiConstant.endpoint;

    private errorsAdminSub$ = new Subject<string[]>();
    errorsAdmin$ = this.errorsAdminSub$.asObservable();

    private successAdminSub$ = new Subject<EpicMedicalResponse<AdminAccountInfo>>();
    successAdmin$ = this.successAdminSub$.asObservable();

    private errorsEmployerSub$ = new Subject<string[]>();
    errorsEmployer$ = this.errorsEmployerSub$.asObservable();

    private successEmployerSub$ = new Subject<EpicMedicalResponse<EmployerAccountInfo>>();
    successEmployer$ = this.successEmployerSub$.asObservable();

    constructor(
        @Inject(US_API_TOKEN)
        private apiConstant: ApiConstant,
        private httpClient: HttpClient,
    ) {}

    getAccountInfoForAdmin() {
        return this.httpClient.get<AdminAccountInfo>(`${this.urlDefault}/user/my-account`);
    }

    getAccountInfoForEmployer() {
        return this.httpClient.get<EpicMedicalResponse<EmployerAccountInfo>>(`${this.urlDefault}/employer/my-account`);
    }

    updateAccountInfoForIom(info: UpdateIomAccountInfo) {
        return this.httpClient
            .post<EpicMedicalResponse<AdminAccountInfo>>(`${this.urlDefault}/user/my-account`, info)
            .pipe(
                tap(respone => {
                    this.successAdminSub$.next(respone);
                    this.errorsAdminSub$.next([]);
                    return EMPTY;
                }),
                catchError((err: CustomHttpErrorResponse) => {
                    if (err.errorJson) {
                        this.errorsAdminSub$.next(err.errorJson.message);
                        return err.errorJson.message;
                    } else {
                        this.errorsAdminSub$.next([err.message]);
                        return err.message;
                    }
                }),
            )
            .subscribe();
    }

    updateAccountInfoForEmployer(info: UpdateEmployerAccountInfo) {
        return this.httpClient
            .post<EpicMedicalResponse<EmployerAccountInfo>>(`${this.urlDefault}/employer/my-account`, info)
            .pipe(
                tap(respone => {
                    this.successEmployerSub$.next(respone);
                    this.errorsEmployerSub$.next([]);
                    return EMPTY;
                }),
                catchError((err: CustomHttpErrorResponse) => {
                    if (err.errorJson) {
                        this.errorsEmployerSub$.next(err.errorJson.message);
                        return err.errorJson.message;
                    } else {
                        this.errorsEmployerSub$.next([err.message]);
                        return err.message;
                    }
                }),
            )
            .subscribe();
    }
}
