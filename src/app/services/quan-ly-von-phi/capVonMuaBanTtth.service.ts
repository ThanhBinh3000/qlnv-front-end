import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';


@Injectable({
    providedIn: 'root',
})
export class CapVonMuaBanTtthService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'quanLyVonPhi', '');
    }

    urlDefault = environment.SERVICE_API;

    //search list bao cao
    timKiemVonMuaBan(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/nhap-ghi-nhan-von/danh-sach',
            request,
        );
    }

    //xóa báo cáo nút xóa Báo cáo
    xoaVonMuaBan(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/nhap-ghi-nhan-von/xoa',
            request
        );
    }

}
