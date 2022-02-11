import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import format from 'date-fns/format';
import { BehaviorSubject, EMPTY, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, concatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomEncoder } from '../../core';
import { ApiConstant, CustomHttpErrorResponse, PaginateOptions } from '../../types';
import { Danh_Muc_Don_Vi_Tinh_API_TOKEN, DonViTinhModel } from '../types';

const TRANSACTION_NAME = environment.elasticAPM.transactionName;

@Injectable()
export class DanhMucDonViTinhService {
    urlDefault = this.apiConstant.endpoint;

    private errorsSub$ = new Subject<string[]>();
    errors$ = this.errorsSub$.asObservable();

    private newDonViTinhSub$ = new Subject<any>();
    newDonViTinh$ = this.newDonViTinhSub$.asObservable();

    private listDonViTinhSub$ = new BehaviorSubject<any>({});
    listDonViTinh$ = this.listDonViTinhSub$.asObservable();

    private paginateByUserRole(
        options: PaginateOptions,
        optionSearch?: any
    ) {
        let params;
        params = new HttpParams({ encoder: new CustomEncoder() })
        const { pageIndex, pageSize } = options;
        const headers = new HttpHeaders();
        return this.httpClient
            .post<any>(
                `${this.apiConstant.endpoint}/qlnv-category/dmuc-dvi-tinh/danh-sach`,
                {
                    "dviDo": optionSearch ? optionSearch.dviDo : "",
                    "kyHieu": optionSearch ? optionSearch.kyHieu : "",
                    "maDviTinh": optionSearch ? optionSearch.maDviTinh : "",
                    "paggingReq": {
                        "limit": pageSize,
                        "page": pageIndex + 1
                    },
                    "str": "",
                    "tenDviTinh": optionSearch ? optionSearch.tenDviTinh : "",
                    "trangThai": optionSearch ? optionSearch.trangThai : ""
                },
                { headers },
            )
            .pipe(
                tap(response => {
                    if (response && response.data && response.data.content) {
                        this.listDonViTinhSub$.next({ data: response.data.content, count: response.data.totalElements, startAtPage: { pageIndex } });
                    }
                }),
                catchError((err) => {
                    this.listDonViTinhSub$.next({ data: [], count: 0 });
                    if (err.errorJson) {
                        this.errorsSub$.next(err.errorJson.message);
                    } else {
                        this.errorsSub$.next([err.message]);
                    }
                    return EMPTY;
                }),
            );
    }

    constructor(@Inject(Danh_Muc_Don_Vi_Tinh_API_TOKEN) private apiConstant: ApiConstant, private httpClient: HttpClient) { }

    paginteAdmins(options: PaginateOptions, optionSearch?: any) {
        return this.paginateByUserRole(options, optionSearch);
    }

    delete(id: string, pageSize: number): Promise<any> {
        const headers = new HttpHeaders();
        return this.httpClient
            .get<any>(`${this.urlDefault}/qlnv-category/dmuc-dvi-tinh/xoa/${id}`, { headers })
            .pipe(
                tap(() => {
                    this.errorsSub$.next([]);
                }),
                switchMap(() =>
                    this.paginteAdmins({ pageIndex: 0, pageSize, }),
                ),
                catchError((err: CustomHttpErrorResponse) => {
                    if (err.errorJson) {
                        this.errorsSub$.next(err.errorJson.message);
                    } else {
                        this.errorsSub$.next([err.message]);
                    }
                    return EMPTY;
                }),
            )
            .toPromise();
    }

    create(input: DonViTinhModel, options: PaginateOptions) {
        const headers = new HttpHeaders();
        const { maDviTinh, tenDviTinh, kyHieu, id, dviDo, trangThai, } = input;
        return this.httpClient
            .post<any>(
                `${this.apiConstant.endpoint}/qlnv-category/dmuc-dvi-tinh/them-moi`,
                {
                    maDviTinh, tenDviTinh, kyHieu, id, dviDo, trangThai,
                },
                { headers },
            )
            .pipe(
                tap(response => {
                    this.newDonViTinhSub$.next(response);
                    this.errorsSub$.next([]);
                }),
                concatMap(() => this.paginteAdmins(options)),
                catchError((err: CustomHttpErrorResponse) => {
                    let errorMessage = '';
                    if (err.errorJson) {
                        this.errorsSub$.next(err.errorJson.message);
                        errorMessage = err.errorJson.message
                    } else {
                        this.errorsSub$.next([err.message]);
                        errorMessage = err.message;
                    }
                    return throwError(errorMessage);
                }),
            );
    }

    update(input: DonViTinhModel, options: PaginateOptions) {
        const headers = new HttpHeaders();
        const { maDviTinh, tenDviTinh, kyHieu, id, dviDo, trangThai, } = input;
        return this.httpClient
            .post<any>(
                `${this.apiConstant.endpoint}/qlnv-category/dmuc-dvi-tinh/sua`,
                {
                    maDviTinh, tenDviTinh, kyHieu, id, dviDo, trangThai,
                },
                { headers },
            )
            .pipe(
                tap(response => {
                    this.newDonViTinhSub$.next(response);
                    this.errorsSub$.next([]);
                }),
                concatMap(() => this.paginteAdmins(options)),
                catchError((err: CustomHttpErrorResponse) => {
                    let errorMessage = '';
                    if (err.errorJson) {
                        this.errorsSub$.next(err.errorJson.message);
                        errorMessage = err.errorJson.message
                    } else {
                        this.errorsSub$.next([err.message]);
                        errorMessage = err.message;
                    }
                    return throwError(errorMessage);
                }),
            );
    }

    getAll() {
        const headers = new HttpHeaders();
        return this.httpClient.get<any>(`${this.urlDefault}/qlnv-category/dmuc-dvi-tinh/danh-sach/tat-ca`, { headers }).pipe(
            tap(result => { }),
        );
    }
}
