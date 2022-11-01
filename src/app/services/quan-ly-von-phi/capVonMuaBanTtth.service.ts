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

    maNopTienVon(): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/qlnv-khoachphi/nhap-ghi-nhan-von/sinh-ma/nop-tien-von'
        );
    }

    //chi tiet ma phuong an
    ctietVonMuaBan(id: any): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/qlnv-khoachphi/nhap-ghi-nhan-von/chi-tiet/' + id
        );
    }

    themMoiVonMuaBan(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/nhap-ghi-nhan-von/them-moi',
            request);
    }

    //cap nhat phuong an
    capNhatVonMuaBan(requestUpdate: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/qlnv-khoachphi/nhap-ghi-nhan-von/cap-nhat'
            , requestUpdate);
    }

    //search list bao cao
    timKiemCapVon(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/cap-ung-von/danh-sach',
            request,
        );
    }

    maCapVonUng(): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/qlnv-khoachphi/nhap-ghi-nhan-von/sinh-ma/cap-von-ung'
        );
    }


}
