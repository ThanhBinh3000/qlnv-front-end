import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyBangKeCanHangService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyBangKeCanHang');
  }

  timKiem(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/ql-nxuat-hang/bke-can-hang/tra-cuu`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/ql-nxuat-hang/bke-can-hang/chi-tiet/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  danhSachChuaQuyetDinh(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/ql-nxuat-hang/bke-can-hang/tra-cuu/ds-chua-qd`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-nxuat-hang/bke-can-hang/them-moi`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-nxuat-hang/bke-can-hang/cap-nhat`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  xoa(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-nxuat-hang/bke-can-hang/xoa`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
}