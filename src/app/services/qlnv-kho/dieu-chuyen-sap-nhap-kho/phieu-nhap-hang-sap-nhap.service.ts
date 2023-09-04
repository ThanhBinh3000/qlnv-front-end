import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { BaseService } from "../../base.service";
import { OldResponseData } from "../../../interfaces/response";

@Injectable({
    providedIn: 'root',
})
export class PhieuNhapHangSapNhapService extends BaseService {
    GATEWAY = '/qlnv-kho';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'qly-kho-tang/dieu-chuyen-sap-nhap/phieu-nhap-hang', '');
    }

    search(body) {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
}
