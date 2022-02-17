import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import format from 'date-fns/format';
import { BehaviorSubject, EMPTY, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, concatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomEncoder } from '../../core';
import { ApiConstant, CustomHttpErrorResponse, PaginateOptions } from '../../types';
import { Danh_Muc_Dia_Ban_Hanh_Chinh_API_TOKEN, DiaBanHanhChinhModel } from '../types';

const TRANSACTION_NAME = environment.elasticAPM.transactionName;

@Injectable()
export class DanhMucDiaBanHanhChinhService {
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
        optionSearch?: any
    ) {
        let params;
        params = new HttpParams({ encoder: new CustomEncoder() })
        const { pageIndex, pageSize } = options;
        const headers = new HttpHeaders();
        return this.httpClient
            .post<any>(
                `${this.apiConstant.endpoint}/qlnv-category/dmuc-dbhc/danh-sach`,
                {
                    "maDbhc": optionSearch ? optionSearch.maDbhc : "",
                    "tenDbhc": optionSearch ? optionSearch.tenDbhc : "",
                    "paggingReq": {
                        "limit": pageSize,
                        "page": pageIndex + 1
                    },
                    "str": "",
                    "trangThai": optionSearch ? optionSearch.trangThai : ""
                },
                { headers },
            )
            .pipe(
                tap(response => {
                    if(response && response.data && response.data.content) {
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

    constructor(@Inject(Danh_Muc_Dia_Ban_Hanh_Chinh_API_TOKEN) private apiConstant: ApiConstant, private httpClient: HttpClient) { }

    paginteAdmins(options: PaginateOptions, optionSearch?: any) {
        return this.paginateByUserRole(options, optionSearch);
    }

    delete(id: string, pageSize: number): Promise<any> {
        const headers = new HttpHeaders();
        return this.httpClient
            .get<any>(`${this.urlDefault}/qlnv-category/dmuc-dbhc/xoa/${id}`, { headers })
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

    create(input: DiaBanHanhChinhModel, options: PaginateOptions){
        const headers = new HttpHeaders();
        const { cap, id, maCha, maDbhc, maHchinh, tenDbhc, trangThai} = input;
        return this.httpClient
            .post<any>(
                `${this.apiConstant.endpoint}/qlnv-category/dmuc-dbhc/them-moi`,
                {
                    cap, id, maCha, maDbhc, maHchinh, tenDbhc, trangThai
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

    update(input: DiaBanHanhChinhModel, options: PaginateOptions){
        const headers = new HttpHeaders();
        const { cap, id, maCha, maDbhc, maHchinh, tenDbhc, trangThai} = input;
        return this.httpClient
            .post<any>(
                `${this.apiConstant.endpoint}/qlnv-category/dmuc-dbhc/sua`,
                {
                    cap, id, maCha, maDbhc, maHchinh, tenDbhc, trangThai
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

    getAll(){
        // const headers = new HttpHeaders();
        // return this.httpClient.get<any>(`${this.urlDefault}/qlnv-category/dmuc-donvi/danh-sach/tat-ca`, { headers }).pipe(
        //     tap(result => {}),
        // );
    }

    getHuyen() {
        const headers = new HttpHeaders();
        const capQuan = '01';
        return this.httpClient.get<any>(`${this.urlDefault}/qlnv-category/dmuc-dbhc/danh-sach/ma-cha/${capQuan}`, { headers }).pipe(
            tap(result => {}),
        );
    }
}
