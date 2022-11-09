import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from '../../base.service';

@Injectable({
  providedIn: 'root',
})
export class DeNghiCapVonBoNganhService extends BaseService {
  GATEWAY = '/qlnv-khoach';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'DeNghiCapVonBoNganh', '');
  }

  timKiem(body: any): Promise<any> {
    // let url_ = `${environment.SERVICE_API}${this.GATEWAY}/de-nghi-cap-von-bo-nganh/search?`
    let url_ = `http://localhost:3333/de-nghi-cap-von-bo-nganh/search?`
    if (body.soDeNghi)
      url_ += 'soDeNghi=' + encodeURIComponent('' + body.soDeNghi) + '&';
    if (body.maBoNganh)
      url_ += 'maBoNganh=' + encodeURIComponent('' + body.maBoNganh) + '&';
    if (body.maDvis)
      url_ += 'maDvis=' + encodeURIComponent('' + body.maDvis) + '&';
    if (body.nam)
      url_ += 'nam=' + encodeURIComponent('' + body.nam) + '&';
    if (body.trangThai)
      url_ += 'trangThai=' + encodeURIComponent('' + body.trangThai) + '&';
    if (body.trangThaiTh)
      url_ += 'trangThaiTh=' + encodeURIComponent('' + body.trangThaiTh) + '&';
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
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: body
    }
    return this.httpClient.delete(url, httpOptions).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/de-nghi-cap-von-bo-nganh/trang-thai?id=${body.id}&trangThaiId=${body.trangThaiId}`;
    return this.httpClient.put(url, null).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/de-nghi-cap-von-bo-nganh/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

}
