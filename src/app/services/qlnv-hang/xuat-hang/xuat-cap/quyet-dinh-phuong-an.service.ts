import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../base.service";
import { environment } from "../../../../../environments/environment";
import { OldResponseData } from "../../../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhPhuongAnService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-cap/quyet-dinh-phuong-an', '');
  }
  getQuyetDinhPhuongAn(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/phuong-an`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
