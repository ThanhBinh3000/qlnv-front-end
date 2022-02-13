import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import format from 'date-fns/format';
import { BehaviorSubject, EMPTY, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, concatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomEncoder } from '../../core';
import { ApiConstant, CustomHttpErrorResponse, PaginateOptions } from '../../types';
import { Danh_Muc_Hang_Dtqg_API_TOKEN, DanhMucHangDtqgModel } from '../types';

const TRANSACTION_NAME = environment.elasticAPM.transactionName;

@Injectable()
export class DanhMucHangDtqgService {
    urlDefault = this.apiConstant.endpoint;
    url = `${this.apiConstant.endpoint}/auth`;

    private errorsSub$ = new Subject<string[]>();
    errors$ = this.errorsSub$.asObservable();

    private newHangDtqgSub$ = new Subject<any>();
    newHangDtqg$ = this.newHangDtqgSub$.asObservable();

    private listHangDtqgSub$ = new BehaviorSubject<any>({});
    listHangDtqg$ = this.listHangDtqgSub$.asObservable();

    private paginateByUserRole(options: PaginateOptions, optionSearch?: any) {
        let params;
        params = new HttpParams({ encoder: new CustomEncoder() });
        const { pageIndex, pageSize } = options;
        const headers = new HttpHeaders();
        return this.httpClient
            .post<any>(
                `${this.apiConstant.endpoint}/qlnv-category/dm-hang/tra-cuu`,
                {
                    ma: optionSearch ? optionSearch.ma : '',
                    ten: optionSearch ? optionSearch.ten : '',
                    paggingReq: {
                        limit: pageSize,
                        page: pageIndex + 1,
                    },
                    str: '',
                    trangThai: optionSearch ? optionSearch.trangThai : '',
                },
                { headers },
            )
            .pipe(
                tap(response => {
                    if (response && response.data && response.data.content) {
                        this.listHangDtqgSub$.next({
                            data: response.data.content,
                            count: response.data.totalElements,
                            startAtPage: { pageIndex },
                        });
                    }
                }),
                catchError(err => {
                    this.listHangDtqgSub$.next({ data: [], count: 0 });
                    if (err.errorJson) {
                        this.errorsSub$.next(err.errorJson.message);
                    } else {
                        this.errorsSub$.next([err.message]);
                    }
                    return EMPTY;
                }),
            );
    }

    constructor(
        @Inject(Danh_Muc_Hang_Dtqg_API_TOKEN) private apiConstant: ApiConstant,
        private httpClient: HttpClient,
    ) {}

    paginteAdmins(options: PaginateOptions, optionSearch?: any) {
        return this.paginateByUserRole(options, optionSearch);
    }

    delete(id: string, pageSize: number): Promise<any> {
        const headers = new HttpHeaders();
        return this.httpClient
            .get<any>(`${this.urlDefault}/qlnv-category/dm-hang/xoa/${id}`, { headers })
            .pipe(
                tap(() => {
                    this.errorsSub$.next([]);
                }),
                switchMap(() => this.paginteAdmins({ pageIndex: 0, pageSize })),
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

    create(input: DanhMucHangDtqgModel, options: PaginateOptions) {
        const headers = new HttpHeaders();
        const { ghiChu, id, ma, maCha, ten, trangThai} = input;
        return this.httpClient
            .post<any>(
                `${this.apiConstant.endpoint}/qlnv-category/dm-hang/them-moi`,
                {
                    ghiChu, id, ma, maCha, ten, trangThai
                },
                { headers },
            )
            .pipe(
                tap(response => {
                    this.newHangDtqgSub$.next(response);
                    this.errorsSub$.next([]);
                }),
                concatMap(() => this.paginteAdmins(options)),
                catchError((err: CustomHttpErrorResponse) => {
                    let errorMessage = '';
                    if (err.errorJson) {
                        this.errorsSub$.next(err.errorJson.message);
                        errorMessage = err.errorJson.message;
                    } else {
                        this.errorsSub$.next([err.message]);
                        errorMessage = err.message;
                    }
                    return throwError(errorMessage);
                }),
            );
    }

    update(input: DanhMucHangDtqgModel, options: PaginateOptions) {
        const headers = new HttpHeaders();
        const { ghiChu, id, ma, maCha, ten, trangThai } = input;
        return this.httpClient
            .post<any>(
                `${this.apiConstant.endpoint}/qlnv-category/dm-hang/cap-nhat`,
                {
                    ghiChu, id, ma, maCha, ten, trangThai
                },
                { headers },
            )
            .pipe(
                tap(response => {
                    this.newHangDtqgSub$.next(response);
                    this.errorsSub$.next([]);
                }),
                concatMap(() => this.paginteAdmins(options)),
                catchError((err: CustomHttpErrorResponse) => {
                    let errorMessage = '';
                    if (err.errorJson) {
                        this.errorsSub$.next(err.errorJson.message);
                        errorMessage = err.errorJson.message;
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
        return this.httpClient
            .post<any>(`${this.urlDefault}/qlnv-category/dm-hang/danh-sach`, { headers })
            .pipe(tap(result => {}));
    }
}
