import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuanLyBienBanGiaoNhanService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyBienBanGiaoNhan', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-giao-nhan-vt?`;
    if (body.soQdNhap)
      url_ += 'soQdNhap=' + encodeURIComponent('' + body.soQdNhap) + '&';
    if (body.nam)
      url_ += 'nam=' + encodeURIComponent('' + body.nam) + '&';
    if (body.soHopDong)
      url_ += 'soHopDong=' + encodeURIComponent('' + body.soHopDong) + '&';
    if (body.soBienBan)
      url_ += 'soBienBan=' + encodeURIComponent('' + body.soBienBan) + '&';
    if (body.ngayHopDongTu) {
      url_ += 'ngayHopDongTu=' + encodeURIComponent('' + body.ngayHopDongTu) + '&';
    }
    if (body.ngayHopDongDen) {
      url_ += 'ngayHopDongDen=' + encodeURIComponent('' + body.ngayHopDongDen) + '&';
    }
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-giao-nhan-vt/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-giao-nhan-vt`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-giao-nhan-vt`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  deleteData(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-giao-nhan-vt/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-giao-nhan-vt/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-giao-nhan-vt/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-giao-nhan-vt/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
