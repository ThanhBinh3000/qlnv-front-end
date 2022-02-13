import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomEncoder } from '../../core';
import { ApiConstant, PaginateOptions } from '../../types';
import { TRANG_CHU_API_TOKEN, TrangchuModel } from '../types';

const TRANSACTION_NAME = environment.elasticAPM.transactionName;

@Injectable()
export class TrangChuService {
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
                `${this.apiConstant.endpoint}/qlnv-category/dmuc-donvi/danh-sach`, 
                {
                    "capDvi": optionSearch ? optionSearch.capDvi : "",
                    "kieuDvi": optionSearch ? optionSearch.kieuDvi : "",
                    "loaiDvi": optionSearch ? optionSearch.loaiDvi : "",
                    "maDvi": optionSearch ? optionSearch.maDvi : "",
                    "maPhuong": optionSearch ? optionSearch.maPhuong : "",
                    "maQuan": optionSearch ? optionSearch.maQuan : "",
                    "maTinh": optionSearch ? optionSearch.maTinh : "",
                    "paggingReq": {
                        "limit": pageSize,
                        "page": pageIndex + 1
                    },
                    "str": "",
                    "tenDvi": optionSearch ? optionSearch.tenDvi : "",
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

    constructor(@Inject(TRANG_CHU_API_TOKEN) private apiConstant: ApiConstant, private httpClient: HttpClient) { }

    paginteAdmins(options: PaginateOptions, optionSearch?: any) {
        return this.paginateByUserRole(options, optionSearch);
    }
    
    getAll(){
        const headers = new HttpHeaders();
        return this.httpClient.get<any>(`${this.urlDefault}/qlnv-category/dmuc-donvi/danh-sach/tat-ca`, { headers }).pipe(
            tap(result => {}),
        );
    }
}
