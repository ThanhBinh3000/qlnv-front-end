import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class TinhTrangKhoHienThoiService extends BaseService {
  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'TinhTrangKhoHienThoi', '');
  }

  timKiemNganLo(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/mlk/ngan-lo/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  getChiCucByMaTongCuc(id) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/mlk/chi-cuc/chi-tiet/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  getAllDiemKho() {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/mlk/diem-kho/tat-ca`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  diemKhoGetList(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/mlk/diem-kho/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  nhaKhoGetList(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/mlk/nha-kho/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  nganKhoGetList(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/mlk/ngan-kho/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  nganLoGetList(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/mlk/ngan-lo/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  getTreeKho(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/mlk/thong-tin`;
    return this._httpClient.post<any>(url, null).toPromise();
  }

  getMangLuoiKhoByMa(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/mlk/mang-luoi-kho`;
    return this._httpClient.post<any>(url, body).toPromise();
  }
}
