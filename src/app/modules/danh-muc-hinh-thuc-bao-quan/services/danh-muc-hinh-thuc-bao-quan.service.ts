import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import format from 'date-fns/format';
import { BehaviorSubject, EMPTY, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, concatMap } from 'rxjs/operators';
import { API_TOKEN } from '../..';
// import { environment } from 'src/environments/environment';
import { CustomEncoder } from '../../core';
import { ApiConstant, CustomHttpErrorResponse, PaginateOptions } from '../../types';
import { HinhThucBaoQuanModel } from '../types';

// const TRANSACTION_NAME = environment.elasticAPM.transactionName;

@Injectable()
export class DanhMucHinhThucBaoQuanService {
    urlDefault = this.apiConstant.endpoint;
    urlByService = `${this.urlDefault}/qlnv-category/dmuc-ttrang-gthau`;
    url = `${this.apiConstant.endpoint}/auth`;

    private errorsSub$ = new Subject<string[]>();
    errors$ = this.errorsSub$.asObservable();

    private newCongCuDungCuSub$ = new Subject<any>();
    newCongCuDungCu$ = this.newCongCuDungCuSub$.asObservable();

    private listCongCuDungCuSub$ = new BehaviorSubject<any>({ });
    listCongCuDungCu$ = this.listCongCuDungCuSub$.asObservable();

    private paginateByUserRole(
        options: PaginateOptions,
        optionSearch?: HinhThucBaoQuanModel
    ) {
        let params;
        params = new HttpParams({ encoder: new CustomEncoder() })
        const { pageIndex, pageSize } = options;
        const headers = new HttpHeaders();
        return this.httpClient
            .post<any>(
                `${this.urlByService}/danh-sach`,
                {
                    ...optionSearch,
                    paggingReq: {
                        "limit": pageSize,
                        "page": pageIndex + 1
                    },
                    str: "",
                },
                { headers },
            )
            .pipe(
                tap(response => {
                    if(response && response.data && response.data.content) {
                        this.listCongCuDungCuSub$.next({ data: response.data.content, count: response.data.totalElements, startAtPage: { pageIndex } });
                    }
                }),
                catchError((err) => {
                    this.listCongCuDungCuSub$.next({ data: [], count: 0 });
                    if (err.errorJson) {
                        this.errorsSub$.next(err.errorJson.message);
                    } else {
                        this.errorsSub$.next([err.message]);
                    }
                    return EMPTY;
                }),
            );
    }

    constructor(@Inject(API_TOKEN) private apiConstant: ApiConstant, private httpClient: HttpClient) { }

    paginteAdmins(options: PaginateOptions, optionSearch?: any) {
        return this.paginateByUserRole(options, optionSearch);
    }

    delete(id: string, pageSize: number): Promise<any> {
        const headers = new HttpHeaders();
        return this.httpClient
            .get<any>(`${this.urlByService}/xoa/${id}`, { headers })
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

    create(input: HinhThucBaoQuanModel, options: PaginateOptions){
        const headers = new HttpHeaders();
        return this.httpClient
            .post<any>(
                `${this.urlByService}/them-moi`,
                input,
                { headers },
            )
            .pipe(
                tap(response => {
                    this.newCongCuDungCuSub$.next(response);
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

    update(input: HinhThucBaoQuanModel, options: PaginateOptions){
        const headers = new HttpHeaders();
        return this.httpClient
            .post<any>(
                `${this.urlByService}/sua`,
                input,
                { headers },
            )
            .pipe(
                tap(response => {
                    this.newCongCuDungCuSub$.next(response);
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
        // return this.httpClient.get<any>(`${this.urlByService}/danh-sach/tat-ca`, { headers }).pipe(
        //     tap(result => {}),
        // );
    }
}
