import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { BaseService } from "../../base.service";
import { OldResponseData } from "../../../interfaces/response";

@Injectable({
    providedIn: 'root',
})
export class DanhMucDuyetKhoService extends BaseService {
    GATEWAY = '/qlnv-kho';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'qly-kho-tang/dieu-chuyen-sap-nhap/duyet-danh-muc-kho', '');
    }

    search(body) {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    getDetailTuQD(body) {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet-tu-quyet-dinh?quyetDinhId=${body.id}&maDvi=${body.maDvi}`;
        return this._httpClient.get<OldResponseData>(url).toPromise();
    }
}
