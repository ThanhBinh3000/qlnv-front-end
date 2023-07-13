import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import {OldResponseData} from "../../interfaces/response";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhXhService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'sua-chua/xuat-hang', '/qlnv-hang');
  }

  getDanhSachTaoPhieuXuatKho(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-phieu-xuat-kho`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getDanhSachTaoQuyetDinhNhapHang(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-tao-qd-nh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
