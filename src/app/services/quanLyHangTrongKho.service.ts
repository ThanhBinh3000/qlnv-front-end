import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyHangTrongKhoService extends BaseService {
  GATEWAY = '/qlnv-luukho';

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'QuanLySoKhoTheKho', '');
  }

  searchHangTrongKho(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-trong-kho/tra-cuu`;
    return this.httpClient.post(url, body).toPromise();
  }

  searchDetail(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-trong-kho/detail`;
    return this.httpClient.post(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-trong-kho/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

  exportDetail(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-trong-kho/export/detail`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

  timKiemChiTiet(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-trong-kho/detail`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  getTrangThaiHienThoiKho(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-trong-kho/tim-kiem`;
    return this.httpClient.post<any>(url_, body).toPromise();
  }

  getTrangThaiHt(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-trong-kho/trang-thai-ht`;
    return this.httpClient.post<any>(url_, body).toPromise();
  }

  getTrangThaiHtNew(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-trong-kho/trang-thai-ht-new`;
    // let url_ = `http://localhost:3333/hang-trong-kho/trang-thai-ht-new`;
    return this.httpClient.post<any>(url_, body).toPromise();
  }
}
