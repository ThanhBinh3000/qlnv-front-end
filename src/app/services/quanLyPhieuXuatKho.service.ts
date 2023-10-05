import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyPhieuXuatKhoService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyPhieuXuatKho', '');
  }

  timKiem(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/xh-phieu-xuat-kho/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/xh-phieu-xuat-kho/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/xh-phieu-xuat-kho`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/xh-phieu-xuat-kho`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  deleteData(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/xh-phieu-xuat-kho/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/xh-phieu-xuat-kho/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/xh-phieu-xuat-kho/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/xh-phieu-xuat-kho/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}