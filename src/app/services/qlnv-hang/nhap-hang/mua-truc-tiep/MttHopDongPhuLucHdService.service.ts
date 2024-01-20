import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import {OldResponseData} from "../../../../interfaces/response";
import {environment} from "../../../../../environments/environment";
import {BaseLocalService} from "../../../base-local.service";


@Injectable({
    providedIn: 'root',
})
export class MttHopDongPhuLucHdService extends BaseLocalService {
    GATEWAY = '';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'mua-truc-tiep/hd-mtt', '');
    }

  createPl(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API_LOCAL}${this.GATEWAY}/${this.table}/them-moi/phu-luc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  searchCuc(body) {
    const url = `${environment.SERVICE_API_LOCAL}${this.GATEWAY}/${this.table}/tra-cuu/hop-dong`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
