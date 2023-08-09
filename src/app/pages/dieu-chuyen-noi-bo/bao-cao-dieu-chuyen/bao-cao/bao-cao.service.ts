import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { environment } from 'src/environments/environment';
import { OldResponseData } from 'src/app/interfaces/response';

@Injectable({
    providedIn: 'root',
})
export class BangCaoDieuChuyenService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'dieu-chuyen-noi-bo/bao-cao-ket-qua', '/qlnv-hang');
    }
    getThongTinNhapXuatChiCuc(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/nhap-xuat-hang-chi-cuc`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    getThongTinNhapXuatCuc(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/nhap-xuat-hang-cuc`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    hoanThanh(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/hoan-thanh`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
}
