import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../base.service";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ThongTu1082018Service extends BaseService {
  GATEWAY = '/qlnv-report';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bc-tt-qd', '/qlnv-report');
  }

  baoCaoSLuongCLuongCcdc(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-sl-cl-ccdc`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  bcCtNhapXuatTonKhoHangDTQG(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-ct-nhap-xuat-ton-kho`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

}
