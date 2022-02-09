import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { EMPTY, Subject } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ApiConstant, CustomHttpErrorResponse } from "../../types";
import { ForgotPasswordInfo, ResetPasswordInfo, RESET_PASSWORD_API_TOKEN } from "../types";

const TRANSACTION_NAME = environment.elasticAPM.transactionName;

@Injectable()
export class ResetPasswordService {
    url = `${this.apiConstant.endpoint}/auth`;

    private errorSub$ = new Subject<string[]>();
    error$ = this.errorSub$.asObservable();

    private requestSub$ = new Subject<boolean>();
    request$ = this.requestSub$.asObservable();

    private validLinkSub$ = new Subject<boolean>();
    validLink$ = this.validLinkSub$.asObservable();

    constructor(
        @Inject(RESET_PASSWORD_API_TOKEN) private apiConstant: ApiConstant,
        private httpClient: HttpClient,
    ){}

    request(input: ForgotPasswordInfo) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Request forgot password link' });

        return this.httpClient.post<boolean>(`${this.url}/forgot-password`, input, { headers }).pipe(
            tap(res => {
                this.requestSub$.next(res);
            }),
            // map((strValidInHour: string) => parseInt(strValidInHour, 10)),
            catchError((err: CustomHttpErrorResponse) => {
                if (err.errorJson) {
                    this.errorSub$.next(err.errorJson.message);
                } else {
                    this.errorSub$.next([err.message]);
                }
                return EMPTY;
            }),
        );
    }

    checkForgotPassword(id: string, code: string, time: string) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Check forgot password link' });

        return this.httpClient
            .post<boolean>(`${this.url}/check-forgot-password`, { id, code, time }, { headers })
            .pipe(
                tap(data => {
                    this.validLinkSub$.next(data);
                }),
                catchError((err: CustomHttpErrorResponse) => {
                    if (err.errorJson) {
                        this.errorSub$.next(err.errorJson.message);
                    } else {
                        this.errorSub$.next([err.message]);
                    }
                    return EMPTY;
                }),
            )
            .subscribe();
    }

    update(input: ResetPasswordInfo, id: string, code: string, time: string) {
        const { newPassword, confirmPassword } = input;
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Reset password' });
        const confirmNewPassword = confirmPassword;

        return this.httpClient
            .post<void>(
                `${this.url}/forgot-change-password`,
                { newPassword, confirmNewPassword, id, code, time },
                { headers },
            )
            .pipe(
                catchError((err: CustomHttpErrorResponse) => {
                    if (err.errorJson) {
                        this.errorSub$.next(err.errorJson.message);
                    } else {
                        this.errorSub$.next([err.message]);
                    }
                    return EMPTY;
                }),
            );
    }
}
