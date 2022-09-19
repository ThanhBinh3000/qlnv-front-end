import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeNghiCapVonBoNganhService extends BaseService {
  GATEWAY = '/qlnv-khoach';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'DeNghiCapVonBoNganh', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/de-nghi-cap-von-bo-nganh/search?`
    if (body.soDeNghi)
      url_ += 'soDeNghi=' + encodeURIComponent('' + body.soDeNghi) + '&';
    if (body.maBoNganh)
      url_ += 'maBoNganh=' + encodeURIComponent('' + body.maBoNganh) + '&';
    if (body.maDvis)
      url_ += 'maDvis=' + encodeURIComponent('' + body.maDvis) + '&';
    if (body.nam)
      url_ += 'nam=' + encodeURIComponent('' + body.nam) + '&';
    if (body.ngayDeNghiDenNgay)
      url_ += 'ngayDeNghiDenNgay=' + encodeURIComponent('' + body.ngayDeNghiDenNgay) + '&';
    if (body.ngayDeNghiTuNgay)
      url_ += 'ngayDeNghiTuNgay=' + encodeURIComponent('' + body.ngayDeNghiTuNgay) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/de-nghi-cap-von-bo-nganh/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/de-nghi-cap-von-bo-nganh`;
    return this.httpClient.post(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/de-nghi-cap-von-bo-nganh`;
    return this.httpClient.put(url, body).toPromise();
  }

  deleteData(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/de-nghi-cap-von-bo-nganh/${id}`;
    return this.httpClient.delete(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/de-nghi-cap-von-bo-nganh`;
    return this.httpClient.delete(url, body).toPromise();
  }

  // updateStatus(body: any): Promise<any> {
  //   let url_ = `${environment.SERVICE_API}${this.GATEWAY}/de-nghi-cap-von-bo-nganh/trang-thai?`
  //   if (body.id)
  //     url_ += 'id=' + encodeURIComponent('' + body.id) + '&';
  //   if (body.trangThaiId)
  //     url_ += 'trangThaiId=' + encodeURIComponent('' + body.trangThaiId) + '&';
  //   url_ = url_.replace(/[?&]$/, '');
  //   return this.httpClient.put<any>(url_).toPromise();
  // }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/de-nghi-cap-von-bo-nganh/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

}
