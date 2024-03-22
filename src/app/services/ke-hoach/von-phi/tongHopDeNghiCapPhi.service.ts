import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from '../../base.service';

@Injectable({
    providedIn: 'root',
})
export class TongHopDeNghiCapPhiService extends BaseService {
    GATEWAY = '/qlnv-khoach';
    router = 'tong-hop-de-nghi-cap-phi'

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'tong-hop-de-nghi-cap-phi', '');
    }

    timKiem(body: any): Promise<any> {
        let url_ = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}?`
        if (body.maTongHop)
            url_ += 'maTongHop=' + encodeURIComponent('' + body.maTongHop) + '&';
        if (body.maDvis)
            url_ += 'maDvis=' + encodeURIComponent('' + body.maDvis) + '&';
        if (body.nam)
            url_ += 'nam=' + encodeURIComponent('' + body.nam) + '&';
        if (body.trangThais)
          url_ += 'trangThais=' + encodeURIComponent('' + body.trangThais) + '&';
        if (body.ngayTongHopDenNgay)
            url_ += 'ngayTongHopDenNgay=' + encodeURIComponent('' + body.ngayTongHopDenNgay) + '&';
        if (body.ngayTongHopTuNgay)
            url_ += 'ngayTongHopTuNgay=' + encodeURIComponent('' + body.ngayTongHopTuNgay) + '&';
        if (body.pageNumber != null || body.pageNumber != undefined)
            url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
        if (body.pageSize)
            url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
        url_ = url_.replace(/[?&]$/, '');
        return this.httpClient.get<any>(url_).toPromise();
    }

    loadChiTiet(id: number): Promise<any> {
        const url_ = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}/${id}`;
        return this.httpClient.get<any>(url_).toPromise();
    }

    them(body: any): Promise<any> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}`;
        return this.httpClient.post(url, body).toPromise();
    }

    sua(body: any): Promise<any> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}`;
        return this.httpClient.put(url, body).toPromise();
    }

    deleteData(id: any): Promise<any> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}/${id}`;
        return this.httpClient.delete(url).toPromise();
    }

    deleteMultiple(body: any): Promise<any> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}/delete/multiple`;
        return this.httpClient.post(url, body).toPromise();
    }

    updateStatus(body: any): Promise<any> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}/status`;
        return this.httpClient.put(url, body).toPromise();
    }

    exportList(body: any): Observable<Blob> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}/export/list`;
        return this.httpClient.post(url, body, { responseType: 'blob' });
    }

}
