import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../../../services/base.service";
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PhieuXuatKhoDieuChuyenService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'dieu-chuyen-noi-bo/phieu-xuat-kho', '/qlnv-hang');
    }
    getThongTinChungPhieuXuatKho(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach-thong-tin-chung`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    danhSach(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
}
