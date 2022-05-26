import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyPhieuNhapDayKhoService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyPhieuNhapDayKho', '');
  }

  timKiem(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-bien-ban-nhap-day-kho-lt/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  chiTiet(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/ql-bien-ban-nhap-day-kho-lt/${id}`
    return this.httpClient.get<any>(url).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-bien-ban-nhap-day-kho-lt/them-moi`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-bien-ban-nhap-day-kho-lt`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  xoa(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-bien-ban-nhap-day-kho-lt/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-bien-ban-nhap-day-kho-lt/status`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-bien-ban-nhap-day-kho-lt/ket-xuat`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}