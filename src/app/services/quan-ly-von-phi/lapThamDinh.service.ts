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

    urlTest = 'http://localhost:9159';
    urlDefault = environment.SERVICE_API + '/qlnv-khoachphi';

    //search list bao cao
    timBaoCaoLapThamDinh(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/lap-tham-dinh/danh-sach',
            request,
        );
    }

    //xóa báo cáo nút xóa Báo cáo
    xoaBaoCaoLapThamDinh(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/lap-tham-dinh/xoa',
            request
        );
    }

    //sinh ma bao cao
    sinhMaBaoCao(): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/lap-tham-dinh/sinh-ma',
        );
    }

    // call api chi tiết báo cáo
    bCLapThamDinhDuToanChiTiet(id: any): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/lap-tham-dinh/chi-tiet/' + id,
        );
    }

    // call api nút chức năng
    approveThamDinh(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/lap-tham-dinh/trang-thai',
            request,
        );
    }

    // trinh duyet
    trinhDuyetService(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/lap-tham-dinh/them-moi',
            request,
        );
    }

    // upload list
    updateBieuMau(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/lap-tham-dinh/cap-nhat',
            request,
        );
    }

    ctietBieuMau(id: string): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/lap-tham-dinh/chi-tiet/bieu-mau/' + id,
        );
    }

    // upload list
    updateLapThamDinh(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/lap-tham-dinh/chi-tiet/cap-nhat',
            request,
        );
    }

    // call api nút chức năng
    approveCtietThamDinh(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/lap-tham-dinh/chi-tiet/phe-duyet',
            request,
        );
    }

    //tong hop
    tongHop(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/lap-tham-dinh/tong-hop',
            request,
        );
    }

    //tong hop
    soLuongVp(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/lap-tham-dinh/get-so-luong',
            request,
        );
    }

    themMoiTyLeBh(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/he-so-bao-hiem/them-moi',
            request,
        );
    }

    capNhatTyLeBh(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/he-so-bao-hiem/cap-nhat',
            request,
        );
    }

    chiTietTyLeBh(id: string): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/he-so-bao-hiem/chi-tiet/' + id,
        );
    }

    trangThaiTyLeBh(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/he-so-bao-hiem/trang-thai',
            request,
        );
    }

    tyLeBaoHiem(nam: number): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/he-so-bao-hiem/' + nam.toString(),
        );
    }

    danhSachHeSoBh(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/he-so-bao-hiem/danh-sach',
            request,
        );
    }

    xoaBh(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/he-so-bao-hiem/xoa',
            request
        );
    }

    addHistory(id: string): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/lap-tham-dinh/sao-chep/' + id,
        );
    }

    restoreReport(cId: string, rId: string): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/lap-tham-dinh/phuc-hoi/currentId=' + cId + '/recoverId=' + rId,
        );
    }
}
