import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';


@Injectable({
    providedIn: 'root',
})
export class DieuChinhService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'quanLyVonPhi', '');
    }
    urlTest = 'http://localhost:9159';
    urlDefault = environment.SERVICE_API + '/qlnv-khoachphi-dev';

    //sinh ma bao cao dieu chinh du toan
    sinhMaBaoCaoDieuChinh(): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/dieu-chinh-du-toan-chi/sinh-ma',
            // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/sinh-ma',
        );
    }

    // trinh duyet dieu chinh du toan NSNN
    trinhDuyetDieuChinhService(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/dieu-chinh-du-toan-chi/them-moi',
            // 'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/them-moi',
            request,
        );
    }
    // trinh duyet dieu chinh du toan NSNN
    trinhDuyetDieuChinhService1(request: any): Observable<any> {
        return this.httpClient.post(
            // this.urlDefault + '/dieu-chinh-du-toan-chi/them-moi',
            'http://localhost:9159/dieu-chinh-du-toan-chi/them-moi',
            request,
        );
    }

    // upload phu luc dieu chinh du toan NSNN
    updatePLDieuChinh(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/dieu-chinh-du-toan-chi/chi-tiet',
            // 'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/chi-tiet',
            request,
        );
    }

    // upload phu luc dieu chinh du toan NSNN
    updatePLDieuChinh1(request: any): Observable<any> {
        return this.httpClient.put(
            // this.urlDefault + '/dieu-chinh-du-toan-chi/chi-tiet',
            'http://localhost:9159/dieu-chinh-du-toan-chi/chi-tiet',
            request,
        );
    }

    // tong hop dieu chinh du toan
    tongHopDieuChinhDuToan(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/dieu-chinh-du-toan-chi/tong-hop',
            // 'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/tong-hop',
            request,
        );
    }
    // tong hop dieu chinh du toan
    tongHopDieuChinhDuToan1(request: any): Observable<any> {
        return this.httpClient.post(
            // this.urlDefault + '/dieu-chinh-du-toan-chi/tong-hop',
            'http://localhost:9159/dieu-chinh-du-toan-chi/tong-hop',
            request,
        );
    }

    bCDieuChinhDuToanChiTiet(id: any): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/dieu-chinh-du-toan-chi/chi-tiet/' + id,
            // 'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/chi-tiet/' + id,
        );
    }

    bCDieuChinhDuToanChiTiet1(id: any): Observable<any> {
        return this.httpClient.get(
            // this.urlDefault + '/dieu-chinh-du-toan-chi/chi-tiet/' + id,
            'http://localhost:9159/dieu-chinh-du-toan-chi/chi-tiet/' + id,
        );
    }

    themmoiDieuChinh(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/dieu-chinh-du-toan-chi/them-moi',
            // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/them-moi',
            request);
    }

    updateDieuChinh(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/dieu-chinh-du-toan-chi/cap-nhat',
            request);
    }
    updateDieuChinh1(request: any): Observable<any> {
        return this.httpClient.put(
            'http://localhost:9159/dieu-chinh-du-toan-chi/cap-nhat',
            request);
    }

    chiTietDieuChinh(id: any): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/dieu-chinh-du-toan-chi/chi-tiet/' + id
            // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/chi-tiet/' + id,
        );
    }

    timKiemDieuChinh(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/dieu-chinh-du-toan-chi/danh-sach',
            request);
    }
    timKiemDieuChinh1(request: any): Observable<any> {
        return this.httpClient.post(
            'http://192.168.1.101:8094/dieu-chinh-du-toan-chi/danh-sach',
            request);
    }

    danhSachDieuChinh(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/dieu-chinh-du-toan-chi/danh-sach',
            // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/danh-sach-dieu-chinh',
            request);
    }

    // call api nút chức năng
    approveDieuChinh(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/dieu-chinh-du-toan-chi/trang-thai',
            // 'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/trang-thai',
            request,
        );
    }

    // call api nút chức năng
    approveDieuChinhPheDuyet(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/dieu-chinh-du-toan-chi/chi-tiet/phe-duyet',
            request,
        );
    }
    // call api nút chức năng dieu chinh
    approveDieuChinhPheDuyet1(request: any): Observable<any> {
        return this.httpClient.put(
            'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/chi-tiet/phe-duyet',
            request,
        );
    }

    //xóa báo cáo nút xóa Báo cáo
    xoaDuToanDieuChinh(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/dieu-chinh-du-toan-chi/xoa',
            request
            // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/xoa/' + id
        );
    }
    //xóa báo cáo nút xóa Báo cáo
    xoaDuToanDieuChinh1(request: any): Observable<any> {
        return this.httpClient.post(
            // this.urlDefault + '/dieu-chinh-du-toan-chi/xoa/' + id
            'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/xoa',
            request
        );
    }

    getDataVp(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/dieu-chinh-du-toan-chi/get-data',
            // 'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/get-data',
            request
        );
    };

    restoreReport(cId: string, rId: string): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/dieu-chinh-du-toan-chi/phuc-hoi/currentId=' + cId + '/recoverId=' + rId,
        );
    };

    addHistory(id: string): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/dieu-chinh-du-toan-chi/sao-chep/' + id,
        );
    };

    ctietBieuMau(id: string): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/dieu-chinh-du-toan-chi/chi-tiet/bieu-mau/' + id,
        );
    };

    soLuongVp(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/dieu-chinh-du-toan-chi/get-so-luong',
            request,
        );
    }
}
