import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { environment } from 'src/environments/environment';
import { OldResponseData } from 'src/app/interfaces/response';

@Injectable({
    providedIn: 'root',
})
export class BienBanThuThieuService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'dieu-chuyen-noi-bo/bien-ban-thua-thieu', '/qlnv-hang');
    }
    hoanThanh(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/hoan-thanh`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
}
