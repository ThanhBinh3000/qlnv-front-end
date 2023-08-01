import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';
import { environment } from "../../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class QuyetDinhGiaCuaBtcService extends BaseService {
  gateway: string = '/qlnv-khoach'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'phuong-an-gia/qd-gia-btc', '/qlnv-khoach')
  }
  tongHopDataToTrinh(body: any) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phuong-an-gia/qd-gia-btc/danh-sach-tt-vt`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  getQdGiaVattu(body: any) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phuong-an-gia/qd-gia-btc/gia-btc`;
    return this.httpClient.post<any>(url, body).toPromise();
  }


}
