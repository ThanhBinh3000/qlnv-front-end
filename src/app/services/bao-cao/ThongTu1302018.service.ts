import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../base.service";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ThongTu1302018Service extends BaseService {
  GATEWAY = '/qlnv-report';

  constructor(public httpClient: HttpClient) {
    super(httpClient, '130-2018-ttbtc', '/qlnv-report');
  }

  bcSlGtriHangDtqg(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/sl-gia-tri-hang-dtqg`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  bcSlGtriHangDtqgNhap(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/sl-gia-tri-hang-dtqg-nhap`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  bcSlGtriHangDtqgXuat(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/sl-gia-tri-hang-dtqg-xuat`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  bcKhMuaHangDtqg(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-kh-mua-hang-dtqg`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

}
