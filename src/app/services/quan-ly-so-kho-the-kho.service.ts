import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class QuanLySoKhoTheKhoService extends BaseService {
  GATEWAY = '/qlnv-luukho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'so-kho-the-kho', '/qlnv-luukho');
  }

  loadDsNhapXuat(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}/qlnv-hang/lich-su-nhap-xuat/ds-nhap-xuat-the-kho`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  getDsTaoSoTheoDoiBaoQuan(body): Promise<OldResponseData>{
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-tao-so-tdbq`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
