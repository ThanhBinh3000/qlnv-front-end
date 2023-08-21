import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../../base.service";
import {OldResponseData} from "../../../../interfaces/response";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class QuyetDinhThanhLyService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-thanh-ly/quyet-dinh-thanh-ly', '');
  }

  approveDtl(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/dtl-chi-tiet/phe-duyet`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
