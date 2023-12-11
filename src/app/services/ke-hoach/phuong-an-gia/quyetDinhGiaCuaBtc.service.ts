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

  getQdGiaLastestBtc(body: any) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phuong-an-gia/qd-gia-btc/gia-btc-lastest`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  previewQdGia(body: any)  {
    // const url = `http://localhost:3010/phuong-an-gia/xem-truoc-qd-gia`;
    const url = `${environment.SERVICE_API}/qlnv-report/phuong-an-gia/xem-truoc-qd-gia`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }


}
