import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';


@Injectable({
    providedIn: 'root',
})
export class LapThamDinhService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'quanLyVonPhi', '');
    }

    urlDefault = environment.SERVICE_API;

    //search list bao cao
    timBaoCaoLapThamDinh(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/danh-sach',
            request,
        );
    }

    //xóa báo cáo nút xóa Báo cáo
    xoaBaoCaoLapThamDinh(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/xoa',
            request
        );
    }

    //sinh ma bao cao
    sinhMaBaoCao(): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/sinh-ma',
        );
    }

    // call api chi tiết báo cáo
    bCLapThamDinhDuToanChiTiet(id: any): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/chi-tiet/' + id,
        );
    }

    // call api nút chức năng
    approveThamDinh(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/trang-thai',
            request,
        );
    }

    // trinh duyet
    trinhDuyetService(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/them-moi',
            request,
        );
    }

    // upload list
    updateBieuMau(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/cap-nhat',
            request,
        );
    }

    // upload list
    updateLapThamDinh(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/chi-tiet/cap-nhat',
            request,
        );
    }

    // call api nút chức năng
    approveCtietThamDinh(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/chi-tiet/phe-duyet',
            request,
        );
    }
}
