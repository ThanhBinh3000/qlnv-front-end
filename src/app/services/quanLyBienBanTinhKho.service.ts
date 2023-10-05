import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyBienBanTinhKhoService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyBienBanTinhKho', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/xh-bb-tinh-kho?`;
    if (body.ngayXuatDen)
      url_ += 'ngayXuatDen=' + encodeURIComponent('' + body.ngayXuatDen) + '&';
    if (body.ngayXuatTu)
      url_ += 'ngayXuatTu=' + encodeURIComponent('' + body.ngayXuatTu) + '&';
    if (body.pageSize)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
    if (body.orderBy)
      url_ += 'paggingReq.orderBy=' + encodeURIComponent('' + body.orderBy) + '&';
    if (body.orderType)
      url_ += 'paggingReq.orderType=' + encodeURIComponent('' + body.orderType) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.quyetDinhId)
      url_ += 'quyetDinhId=' + encodeURIComponent('' + body.quyetDinhId) + '&';
    if (body.soBienBan)
      url_ += 'soBienBan=' + encodeURIComponent('' + body.soBienBan) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/xh-bb-tinh-kho/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/xh-bb-tinh-kho`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/xh-bb-tinh-kho`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  deleteData(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/xh-bb-tinh-kho/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/xh-bb-tinh-kho/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/xh-bb-tinh-kho/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/xh-bb-tinh-kho/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
