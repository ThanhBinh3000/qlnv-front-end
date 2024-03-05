import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../base.service";
import { environment } from "../../../environments/environment";
import { OldResponseData } from "src/app/interfaces/response";

@Injectable({
    providedIn: 'root',
})
export class BcNvQuanLyKhoTangService extends BaseService {
    GATEWAY = '/qlnv-report';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'quan-ly-kho-tang', '');
    }

    baoCaoThongTinHienTrangCaiTaoSuaChuaKho(body) {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/hien-trang-cai-tao-sua-chua`;
        return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
    }

    baoCaoRaSoatTichLuongKho(body) {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ra-soat-he-thong-kho-tang`;
        return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
    }

    hienTrangTichLuongKho(body) {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/hien-trang-kho/tich-luong`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    hienTrangTonKho(body) {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/hien-trang-kho/ton-kho`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    hienTrangKhoTang(body) {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/hien-trang-kho/tra-cuu-hien-trang`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    hienTrangKhoTangChart(body){
      const url=`${environment.SERVICE_API}${this.GATEWAY}/${this.table}/hien-trang-kho/hien-trang`;
      return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
}
