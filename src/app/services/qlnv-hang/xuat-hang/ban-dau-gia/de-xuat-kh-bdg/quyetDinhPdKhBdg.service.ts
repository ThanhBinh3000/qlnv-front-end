import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class QuyetDinhPdKhBdgService extends BaseService {

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'ban-dau-gia/qd-pd-bdg', '/qlnv-hang');
    }

    getDtlDetail(id, isLocal?): Promise<OldResponseData> {
        if (isLocal) {
            const url = `http://localhost:189/${this.table}/chi-tiet/${id}`;
            return this._httpClient.get<OldResponseData>(url).toPromise();
        } else {
            const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/dtl-chi-tiet/${id}`;
            return this._httpClient.get<OldResponseData>(url).toPromise();
        }
    }


}
