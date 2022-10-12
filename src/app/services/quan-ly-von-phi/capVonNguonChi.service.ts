import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';


@Injectable({
    providedIn: 'root',
})
export class CapVonNguonChiService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'quanLyVonPhi', '');
    }

    urlDefault = environment.SERVICE_API;
    //tao  ma de nghi
    maDeNghi(): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/qlnv-khoachphi/de-nghi-cap-von/sinh-ma'
        );
    }
    //danh sach de nghi cap von
    timKiemDeNghi(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/de-nghi-cap-von/danh-sach',
            request,
        );
    }
    //xóa báo cáo nút xóa Báo cáo
    xoaDeNghi(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/de-nghi-cap-von/xoa',
            request,
        );
    }
    //chi tiết đề nghị cấp vốn
    ctietDeNghi(id: any): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/qlnv-khoachphi/de-nghi-cap-von/chi-tiet/' + id
        );
    }
    ///thay doi trang thai de nghi cap von
    trinhDeNghi(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/qlnv-khoachphi/de-nghi-cap-von/trang-thai',
            request);
    }
    //tao moi de nghi cap von
    taoMoiDeNghi(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/de-nghi-cap-von/them-moi',
            request);
    }
    // cap nhat de nghi cap von
    updateDeNghi(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/qlnv-khoachphi/de-nghi-cap-von/cap-nhat',
            request,
        );
    }

}
