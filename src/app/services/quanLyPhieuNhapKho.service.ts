import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyPhieuNhapKhoService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyPhieuNhapKho', '');
  }

  timKiem(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-nhap-kho-lt/tra-cuu`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-nhap-kho-lt/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-nhap-kho-lt/them-moi`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-nhap-kho-lt`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  deleteData(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-nhap-kho-lt/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-nhap-kho-lt/status`;
    return this.httpClient.put(url, body).toPromise();
  }
}