import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhPheDuyetKeHoachLCNTService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuyetDinhPheDuyetKeHoachLCNT','');
  }

  timKiem(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-lcnt-gao/tra-cuu`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  chiTiet(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-lcnt-gao/chi-tiet/${id}`
    return this.httpClient.get<any>(url).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-lcnt-gao/phe-duyet`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  update(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-lcnt-gao/cap-nhat`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  create(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-lcnt-gao/them-moi`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  xoa(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-lcnt-gao/xoa`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-lcnt-gao/ket-xuat`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}