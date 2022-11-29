import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { environment } from 'src/environments/environment';
import {OldResponseData} from "../../interfaces/response";

@Injectable({
    providedIn: 'root',
})
export class MangLuoiKhoService extends BaseService {
    GATEWAY = '/qlnv-kho';
    // GATEWAY = '';
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'mlk', '');
    }

    getDetailByMa(body) {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/mlk/info-mlk`;
        return this._httpClient.post<any>(url, body).toPromise();
    }

  createKho(type, body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/${type}/them-moi`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  updateKho(type, body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/${type}/cap-nhat`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
