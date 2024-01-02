import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import {environment} from "../../../../../../environments/environment";
import {OldResponseData} from "../../../../../interfaces/response";

@Injectable({
    providedIn: 'root',
})
export class DieuChinhQuyetDinhPdKhmttService extends BaseService {
    GATEWAY = '/qlnv-hang';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'mua-truc-tiep/dc-qd-pd', '');
    }

  danhSachQdDc(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu/dieu-chinh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
