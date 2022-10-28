import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';


@Injectable({
    providedIn: 'root',
})
export class BaoCaoThucHienDuToanChiService extends BaseService {
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

    //sinh ma bao cao
    taoMaBaoCao(): Observable<any> {
        return this.httpClient.get(this.urlDefault + '/qlnv-khoachphi/bao-cao/sinh-ma');
    }

    //tong hop bao cao ket qua thuc hien von phi hang DTQG
    tongHopBaoCaoKetQua(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/bao-cao/tong-hop',
            request);
    }

    // them moi bao cao
    trinhDuyetBaoCaoThucHienDTCService(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/bao-cao/them-moi',
            request,
        );
    }

    // call api chi tiết báo cáo
    baoCaoChiTiet(id: any): Observable<any> {
        return this.httpClient.get(this.urlDefault + '/qlnv-khoachphi/bao-cao/chi-tiet/' + id,);
    }

    // call api nút chức năng
    approveBaoCao(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/qlnv-khoachphi/bao-cao/trang-thai',
            request,
        );
    }

    // cap nhat bao cao thuc hien du toan chi
    updateBaoCaoThucHienDTC(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/qlnv-khoachphi/bao-cao/cap-nhat',
            request,
        );
    }
}
