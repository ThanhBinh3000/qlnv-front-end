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

    isTest = true;
    urlDefault = environment.SERVICE_API + (this.isTest ? '/qlnv-khoachphi-dev' : '/qlnv-khoachphi');

    //search list bao cao
    timBaoCao(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/bao-cao/danh-sach'
            , request)
    }

    //xóa báo cáo nút xóa Báo cáo
    xoaBaoCao(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/bao-cao/xoa',
            request
        );
    }

    //sinh ma bao cao (3.2.9)
    taoMaBaoCao(): Observable<any> {
        return this.httpClient.get(this.urlDefault + '/bao-cao/sinh-ma');
    }

    //lay thong tin luy ke
    getLuyKe(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/bao-cao/get-luy-ke'
            , request
        );
    }

    // call api chi tiết báo cáo
    baoCaoChiTiet(id: any): Observable<any> {
        return this.httpClient.get(this.urlDefault + '/bao-cao/chi-tiet/' + id,);
    }

    // call api nút chức năng
    approveBaoCao(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/bao-cao/trang-thai',
            request,
        );
    }

    // trinh duyet bao cao thuc hien du toan chi 3.2.8
    trinhDuyetBaoCaoThucHienDTCService(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/bao-cao/them-moi',
            request,
        );
    }

    // upload bao cao thuc hien du toan chi
    updateBaoCaoThucHienDTC(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/bao-cao/cap-nhat',
            request,
        );
    }

    ctietBieuMau(id: string): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/bao-cao/chi-tiet/bieu-mau/' + id,
        );
    }

    //tong hop bao cao ket qua thuc hien von phi hang DTQG
    tongHopBaoCaoKetQua(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/bao-cao/tong-hop',
            request);
    }

    //tao bao cao tai van phong
    // addOfficeReport(request: any): Observable<any> {
    //     return this.httpClient.post(
    //         this.urlDefault + '/bao-cao/tong-hop-vp',
    //         request);
    // }

    // call api chức năng duyet bieu mau
    approveBieuMau(request: any): Observable<any> {
        return this.httpClient.put(this.urlDefault + '/bao-cao/chi-tiet/phe-duyet', request);
    }

    // call api chi tiết báo cáo
    baoCaoCapNhatChiTiet(request: any): Observable<any> {
        return this.httpClient.put(this.urlDefault + '/bao-cao/chi-tiet', request);
    }

    // exprot excel
    exportBaoCao(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/bao-cao/chi-tiet/export',
            request,
            { responseType: 'blob' });
    }

    getDinhMuc(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/chung/dinh-muc',
            request,
        )
    }

    tongHopVanPhong(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/bao-cao/them-moi-vp',
            request,
        )
    }

    addHistory(id: string): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/bao-cao/tao-moi-lich-su/' + id,
        );
    }

    restoreReport(cId: string, rId: string): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/bao-cao/khoi-phuc/currentId=' + cId + '/recoverId=' + rId,
        );
    }
}
