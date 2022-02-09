import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import format from 'date-fns/format';
import { BehaviorSubject, EMPTY, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, concatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomEncoder } from '../../core';
import { ApiConstant, CustomHttpErrorResponse, PaginateOptions } from '../../types';
import { Danh_Muc_Don_Vi_API_TOKEN, DonViModel } from '../types';

const TRANSACTION_NAME = environment.elasticAPM.transactionName;

@Injectable()
export class DanhMucDonViService {
    urlDefault = this.apiConstant.endpoint;
    url = `${this.apiConstant.endpoint}/auth`;

    private errorsSub$ = new Subject<string[]>();
    errors$ = this.errorsSub$.asObservable();

    private newDonViSub$ = new Subject<any>();
    newDonVi$ = this.newDonViSub$.asObservable();

    private listDonViSub$ = new BehaviorSubject<any>({ });
    listDonVi$ = this.listDonViSub$.asObservable();

    private paginateByUserRole(
        options: PaginateOptions,
    ) {
        let params;
        params = new HttpParams({ encoder: new CustomEncoder() })
        const { pageIndex, pageSize } = options;
        const headers = new HttpHeaders();
        return this.httpClient
            .post<any>(
                `${this.apiConstant.endpoint}/qlnv-category/dmuc-donvi/danh-sach`, 
                {
                    "capDvi": "",
                    "kieuDvi": "",
                    "loaiDvi": "",
                    "maDvi": "",
                    "maPhuong": "",
                    "maQuan": "",
                    "maTinh": "",
                    "paggingReq": {
                        "limit": pageSize,
                        "page": pageIndex + 1
                    },
                    "str": "",
                    "tenDvi": "",
                    "trangThai": ""
                },
                { headers },
            )
            .pipe(
                tap(response => {
                    if(response && response.data && response.data.content && response.data.content.length > 0) {
                        this.listDonViSub$.next({ data: response.data.content, count: response.data.totalElements, startAtPage: { pageIndex } });
                    }
                }),
                catchError((err) => {
                    this.listDonViSub$.next({ data: [], count: 0 });
                    if (err.errorJson) {
                        this.errorsSub$.next(err.errorJson.message);
                    } else {
                        this.errorsSub$.next([err.message]);
                    }
                    return EMPTY;
                }),
            );
    }

    constructor(@Inject(Danh_Muc_Don_Vi_API_TOKEN) private apiConstant: ApiConstant, private httpClient: HttpClient) { }

    paginteAdmins(options: PaginateOptions) {
        return this.paginateByUserRole(options);
    }

    delete(id: string, pageSize: number): Promise<any> {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Delete user' });
        return this.httpClient
            .get<any>(`${this.urlDefault}/qlnv-category/dmuc-donvi/xoa/${id}`, { headers })
            .pipe(
                tap(() => {
                    this.errorsSub$.next([]);
                }),
                switchMap(() =>
                    this.paginteAdmins({pageIndex: 0,pageSize,}),
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
F
    create(input: DonViModel, options: PaginateOptions){
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Create new' });
        const { capDvi, diaChi, ghiChu, id, kieuDvi, loaiDvi, maDvi, maDviCha, maHchinh, maPhuong, maQuan, maTinh, tenDvi, trangThai} = input;
        return this.httpClient
            .post<any>(
                `${this.apiConstant.endpoint}/user/create-user`,
                {
                    capDvi, diaChi, ghiChu, id, kieuDvi, loaiDvi, maDvi, maDviCha, maHchinh, maPhuong, maQuan, maTinh, tenDvi, trangThai
                },
                { headers },
            )
            .pipe(
                tap(response => {
                    this.newDonViSub$.next(response);
                    this.errorsSub$.next([]);
                }),
                concatMap(() => this.paginteAdmins(options)),
                catchError((err: CustomHttpErrorResponse) => {
                    let errorMessage='';
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

    update(input: DonViModel, options: PaginateOptions){
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Update' });
        const { capDvi, diaChi, ghiChu, id, kieuDvi, loaiDvi, maDvi, maDviCha, maHchinh, maPhuong, maQuan, maTinh, tenDvi, trangThai} = input;
        return this.httpClient
            .put<any>(
                `${this.apiConstant.endpoint}/user/update-user`,
                {
                    capDvi, diaChi, ghiChu, id, kieuDvi, loaiDvi, maDvi, maDviCha, maHchinh, maPhuong, maQuan, maTinh, tenDvi, trangThai
                },
                { headers },
            )
            .pipe(
                tap(response => {
                    this.newDonViSub$.next(response);
                    this.errorsSub$.next([]);
                }),
                concatMap(() => this.paginteAdmins(options)),
                catchError((err: CustomHttpErrorResponse) => {
                    let errorMessage='';
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
}
