import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import {OldResponseData} from "../../interfaces/response";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhNhService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'sua-chua/nhap-hang', '/qlnv-hang');
  }

  getDanhSachTaoPhieuNhapKho(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-phieu-nhap-kho`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }


}
