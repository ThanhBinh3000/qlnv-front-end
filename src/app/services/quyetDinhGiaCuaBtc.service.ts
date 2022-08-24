import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service.local';
import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class QuyetDinhGiaCuaBtcService extends BaseService {
  gateway: string = '/qlnv-khoach'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'phuong-an-gia/qd-gia-btc', 'qlnv-khoach')
  }

  loadToTrinhDeXuat(body: any) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phuong-an-gia/qd-gia-btc/ds-tt-dx`;
    return this.httpClient.post<any>(url, body).toPromise();

  }

  loadToTrinhDeXuatThongTinGia(id: number) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phuong-an-gia/qd-gia-btc/ds-tt-dx/chi-tiet/${id}`;
    return this.httpClient.get<any>(url).toPromise();
  }

  loadToTrinhTongHop(body: any) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phuong-an-gia/qd-gia-btc/ds-tt-th`;
    return this.httpClient.post<any>(url, body).toPromise();

  }

  loadToTrinhTongHopThongTinGia(id: number) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phuong-an-gia/qd-gia-btc/ds-tt-th/chi-tiet/${id}`;
    return this.httpClient.get<any>(url).toPromise();
  }
}
