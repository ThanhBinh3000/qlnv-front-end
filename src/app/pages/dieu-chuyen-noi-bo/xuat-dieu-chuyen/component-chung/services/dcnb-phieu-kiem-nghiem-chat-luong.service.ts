import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../../../services/base.service";
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PhieuKiemNghiemChatLuongDieuChuyenService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'dieu-chuyen-noi-bo/phieu-kiem-nghiem-chat-luong', '/qlnv-hang');
    }
    dsBBLMKiemNghiem(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bien-ban-lay-mau`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
}
