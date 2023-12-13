import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from '../base.service';
import {environment} from "../../../environments/environment";
import {OldResponseData} from "../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class QlDinhMucPhiService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dinh-muc-phi', '/qlnv-kho');
  }

  layDanhSachTongDinhMucTongCucPhan(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tong-dinh-muc-tong-cuc-phan`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  exportDetail(body: any) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat-detail`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }
}
