import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import {OldResponseData} from "../../../../interfaces/response";
import {environment} from "../../../../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class MttBienBanLayMauService extends BaseService {
    GATEWAY = '/qlnv-hang';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'mua-truc-tiep/bb-lm', '/qlnv-hang');
    }

  getDetailBySoQd(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet/detail-by-so-qd`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getQuyChuanTheoCloaiVthh(cloaiVthh): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/quy-chuan-theo-loai-hang/${cloaiVthh}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
}
