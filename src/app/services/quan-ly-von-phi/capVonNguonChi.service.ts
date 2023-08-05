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

    urlTest = 'http://localhost:9150';
    urlDefault = environment.SERVICE_API + '/qlnv-khoachphi';

    //tao  ma de nghi
    maDeNghi(): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/de-nghi-cap-von/sinh-ma'
        );
    }

    //danh sach de nghi cap von
    timKiemDeNghi(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/de-nghi-cap-von/danh-sach',
            request,
        );
    }

    //xóa báo cáo nút xóa Báo cáo
    xoaDeNghi(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/de-nghi-cap-von/xoa',
            request,
        );
    }

    //chi tiết đề nghị cấp vốn
    ctietDeNghi(id: any): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/de-nghi-cap-von/chi-tiet/' + id
        );
    }

    ///thay doi trang thai de nghi cap von
    trinhDeNghi(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/de-nghi-cap-von/trang-thai',
            request);
    }

    //tao moi de nghi cap von
    taoMoiDeNghi(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/de-nghi-cap-von/them-moi',
            request);
    }

    // cap nhat de nghi cap von
    updateDeNghi(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/de-nghi-cap-von/cap-nhat',
            request,
        );
    }

    //tong ho de nghi cap von
    tongHopDeNghi(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/de-nghi-cap-von/tong-hop',
            request,
        );
    }







    //ma hop dong
    maHopDong(): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/cap-von-hop-dong/sinh-ma'
        );
    }
    //them moi hop dong
    themMoiHopDong(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/cap-von-hop-dong/them-moi',
            request);
    }
    // cap nhat hop dong
    updateHopDong(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/cap-von-hop-dong/cap-nhat',
            request,
        );
    }
    //chi tiết hop dong
    ctietHopDong(id: any): Observable<any> {
        return this.httpClient.get(
            this.urlDefault + '/cap-von-hop-dong/chi-tiet/' + id
        );
    }
    //danh sach hop dong
    timKiemHopDong(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/cap-von-hop-dong/danh-sach',
            request,
        );
    }
    //xóa hop dong nút xóa Báo cáo
    xoaHopDong(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/cap-von-hop-dong/xoa',
            request,
        );
    }
    ///thay doi trang thai hop dong
    trinhHopDong(request: any): Observable<any> {
        return this.httpClient.put(
            this.urlDefault + '/cap-von-hop-dong/trang-thai',
            request);
    }
    tongHopHopDong(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/cap-von-hop-dong/tong-hop',
            request,
        );
    }
    //tong hop hop dong cho de nghi cap von
    tongHopHd(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/cap-von-hop-dong/tong-hop-hd',
            request,
        );
    }







    //danh sach op dong
    dsachHopDong(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/hop-dong/danh-sach/ds-hop-dong',
            request,
        );
    }

    danhSachHopDong(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/hop-dong/danh-sach/so-qd',
            request,
        )
    }

    soQdChiTieu(request: any): Observable<any> {
        return this.httpClient.post(
            this.urlDefault + '/hop-dong/danh-sach/so-qdinh-ctieu',
            request,
        )
    }

}
