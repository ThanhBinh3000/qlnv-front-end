import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../../../services/base.service";
import { environment } from 'src/environments/environment';
import { OldResponseData } from 'src/app/interfaces/response';

@Injectable({
    providedIn: 'root',
})
export class BienBanTinhKhoDieuChuyenService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'dieu-chuyen-noi-bo/bien-ban-tinh-kho', '/qlnv-hang');
    }
    dsBBTinhKho(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
}
