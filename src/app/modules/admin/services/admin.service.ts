import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { EMPTY, Subject } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { UserInfo } from "../../core";
import { ApiConstant, CustomHttpErrorResponse } from "../../types";
import { ADMIN_API_TOKEN, ChangePasswordInfo } from "../admin-type";

const TRANSACTION_NAME = environment.elasticAPM.transactionName;

@Injectable()
export class AdminService {
    adminUrl = `${this.apiConstant.endpoint}/auth`;
    urlDefault = `${this.apiConstant.endpoint}`;

    private errorsSub$ = new Subject<string[]>();
    errors$ = this.errorsSub$.asObservable();

    private successSub$ = new Subject<UserInfo>();
    success$ = this.successSub$.asObservable();

    constructor(@Inject(ADMIN_API_TOKEN) private apiConstant: ApiConstant, private httpClient: HttpClient) {}

    async updatePassword(input: ChangePasswordInfo): Promise<any> {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Change user password' });
        return this.httpClient
            .put<UserInfo>(`${this.adminUrl}/change-password`, input, { headers })
            .pipe(
                tap((response) => {
                    this.successSub$.next(response)
                    this.errorsSub$.next([]);
                    return 'true';
                }),
                catchError((err: CustomHttpErrorResponse) => {
                    if (err.errorJson) {
                        this.errorsSub$.next(err.errorJson.message);
                        return 'false';
                    } else {
                        this.errorsSub$.next([err.message]);
                        return 'false';
                    }
                }),
            ).toPromise();

    }

    async deleteAccount(brandId?: string): Promise<any> {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Delete user' });

        return this.httpClient
            .delete<void>(`${this.urlDefault}/user/${brandId}`, { headers })
            .pipe(
                map(() => true),
                catchError(() => {
                    return EMPTY;
                }),
            )
            .toPromise();
    }
}
