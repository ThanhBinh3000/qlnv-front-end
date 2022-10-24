import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyBienBanBanGiaoService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyBienBanBanGiao', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/bban-giao-mau/tra-cuu?`;
    if (body.maDvi)
      url_ += 'maDvi=' + encodeURIComponent('' + body.maDvi) + '&';
    if (body.capDvis)
      url_ += 'capDvis=' + encodeURIComponent('' + body.capDvis) + '&';
    if (body.maVatTuCha)
      url_ += 'maVatTuCha=' + encodeURIComponent('' + body.maVatTuCha) + '&';
    if (body.soQuyetDinhNhap)
      url_ += 'soQuyetDinhNhap=' + encodeURIComponent('' + body.soQuyetDinhNhap) + '&';
    if (body.soBienBan)
      url_ += 'soBienBan=' + encodeURIComponent('' + body.soBienBan) + '&';
    if (body.ngayLayMauTu)
      url_ += 'ngayLayMauTu=' + encodeURIComponent('' + body.ngayLayMauTu) + '&';
    if (body.ngayLayMauDen)
      url_ += 'ngayLayMauDen=' + encodeURIComponent('' + body.ngayLayMauDen) + '&';
    if (body.trangThai)
      url_ += 'trangThai=' + encodeURIComponent('' + body.trangThai) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';

    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/bban-giao-mau/chi-tiet?id=${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bban-giao-mau/them-moi`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bban-giao-mau/cap-nhat`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  xoa(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bban-giao-mau/xoa?id=${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/bban-giao-mau/phe-duyet?`;
    if (body.id) url_ += 'id=' + encodeURIComponent('' + body.id) + '&';
    if (body.lyDo) url_ += 'lyDo=' + encodeURIComponent('' + body.lyDo) + '&';
    if (body.trangThai)
      url_ += 'trangThai=' + encodeURIComponent('' + body.trangThai) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.put<any>(url_, null).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bban-giao-mau/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bban-giao-mau/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
