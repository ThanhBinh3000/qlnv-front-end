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
            // 'http://192.168.1.108:30101/lap-tham-dinh/them-moi',
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
            // 'http://192.168.1.111:30101/lap-tham-dinh/chi-tiet/cap-nhat',
            request,
        );
    }
    // upload list
    updateLapThamDinh1(request: any): Observable<any> {
        return this.httpClient.put(
            // this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/chi-tiet/cap-nhat',
            'http://192.168.1.107:30101/lap-tham-dinh/chi-tiet/cap-nhat',
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

    //tim kiem so giao tran chi
    timKiemPhuongAn(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/pa-giao-so/danh-sach'
            , request)
    }

    //xoa phuong an
    xoaPhuongAn(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/pa-giao-so/xoa',
            request
        );
    }

    //tao ma PA
    maPhuongAn(): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/qlnv-khoachphi/pa-giao-so/sinh-ma-pa'
        );
    }

    //danh sach bao cao tong hop nen bao cao to
    danhSachBaoCaoTongHop(maBcao: string): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/qlnv-khoachphi/giao-so/danh-sach/' + maBcao
        )
    }

    //chi tiet ma phuong an
    ctietPhuongAn(id: any): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/qlnv-khoachphi/pa-giao-so/chi-tiet/' + id
        );
    }

    trinhDuyetPhuongAn(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/qlnv-khoachphi/pa-giao-so/trang-thai',
            request);
    }

    //them moi phuong an
    themMoiPhuongAn(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/pa-giao-so/them-moi',
            request);
    }

    //nhap so QD-CV
    themMoiQdCv(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/qlnv-khoachphi/pa-giao-so/nhap-qd-cv'
            , request);
    }

    //cap nhat phuong an
    capnhatPhuongAn(requestUpdate: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/qlnv-khoachphi/pa-giao-so/cap-nhat'
            , requestUpdate);
    }

    //giao so tran chi
    giaoSoTranChi(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/giao-so/giao-so-dvi-cap-duoi'
            , request);
    }

    //tim kiem so giao kiem tra tran chi
    timKiemSoKiemTraTranChi(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/giao-so/dsach-giao-so'
            , request)
    }

    //xem chi tiet so giao tran chi
    ctietGiaoSoTranChi(id: any): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/qlnv-khoachphi/giao-so/chi-tiet/' + id
        );
    }

    //tong hop
    tongHop(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/tong-hop',
            // 'http://192.168.1.111:30101/lap-tham-dinh/tong-hop',
            request,
        );
    }

    //tao ma giao
    maGiao(): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/qlnv-khoachphi/giao-so/sinh-ma-giao-so'
        );
    }

    timKiemMaPaDuyet(): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/qlnv-khoachphi/pa-giao-so/danh-sach/pa-lanh-dao-duyet'
        );
    }

    //sua bao cao theo so giao tran chi
    suaBcao(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/qlnv-khoachphi/giao-so/cap-nhat/bao-cao',
            request);
    }

    tongHopPa(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/tong-hop-theo-ma-pa',
            request);
    }
}
