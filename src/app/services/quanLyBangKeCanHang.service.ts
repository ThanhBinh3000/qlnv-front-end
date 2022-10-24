import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyBangKeCanHangService extends BaseService {

  constructor(public httpClient: HttpClient) {
      super(httpClient, 'ql-bang-ke-can-hang-lt', '/qlnv-hang');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/ql-bang-ke-can-hang-lt?`
    if (body.denNgay)
      url_ += 'denNgayNhap=' + encodeURIComponent('' + body.denNgay) + '&';
    if (body.capDvis) {
      url_ += 'capDvis=' + encodeURIComponent('' + body.capDvis) + '&';
    }
    if (body.maDonVi)
      url_ += 'maDonVi=' + encodeURIComponent('' + body.maDonVi) + '&';
    if (body.maVatTuCha)
      url_ += 'maVatTuCha=' + encodeURIComponent('' + body.maVatTuCha) + '&';
    if (body.soQdNhap)
      url_ += 'soQdNhap=' + encodeURIComponent('' + body.soQdNhap) + '&';
    if (body.soBangKe)
      url_ += 'soBangKe=' + encodeURIComponent('' + body.soBangKe) + '&';
    if (body.tuNgay)
      url_ += 'tuNgayNhap=' + encodeURIComponent('' + body.tuNgay) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/ql-bang-ke-can-hang-lt/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-bang-ke-can-hang-lt`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-bang-ke-can-hang-lt`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  xoa(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-bang-ke-can-hang-lt/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-bang-ke-can-hang-lt/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-bang-ke-can-hang-lt/status`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-bang-ke-can-hang-lt/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}