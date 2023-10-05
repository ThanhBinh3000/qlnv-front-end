import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../../../environments/environment";
import {BaseService} from "../../../base.service";

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhPheDuyetKeHoachNhapKhacService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'nhap-khac/qd-pduyet-khnk', '/qlnv-hang');
  }

  updateDdiemNhap(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/cap-nhat-ddiem-nhap`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

}
