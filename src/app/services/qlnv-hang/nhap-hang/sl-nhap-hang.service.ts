import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BaseService} from "../../base.service";
import {OldResponseData} from "../../../interfaces/response";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SoLuongNhapHangService extends BaseService {
  GATEWAY = '/qlnv-hang';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'sl-nhap-hang', '/qlnv-hang');
  }

  getSoLuongCtkhTheoQd(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/count-sl-ctkh-qd`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getSoLuongCtkhTheoKh(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/count-sl-ctkh-kh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
