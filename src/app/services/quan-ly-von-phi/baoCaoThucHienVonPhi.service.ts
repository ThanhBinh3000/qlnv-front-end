import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';


@Injectable({
    providedIn: 'root',
})
export class BaoCaoThucHienVonPhiService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'quanLyVonPhi', '');
    }

    urlDefault = environment.SERVICE_API;

    //search list bao cao
    timBaoCao(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/bao-cao/danh-sach'
            , request)
    }

    //xóa báo cáo nút xóa Báo cáo
    xoaBaoCao(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/bao-cao/xoa',
            request
        );
    }
}
