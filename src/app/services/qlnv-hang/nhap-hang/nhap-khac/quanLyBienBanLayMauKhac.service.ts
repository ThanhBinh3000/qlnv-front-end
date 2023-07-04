import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../../../environments/environment";
import {BaseService} from "../../../base.service";

@Injectable({
  providedIn: 'root',
})
export class QuanLyBienBanLayMauKhacService extends BaseService {
  GATEWAY = '';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bban-lay-mau-khac', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/bban-lay-mau-khac/tra-cuu?`;
    if (body.maDvis)
      url_ += 'maDvis=' + encodeURIComponent('' + body.maDvis) + '&';
    if (body.capDvis)
      url_ += 'capDvis=' + encodeURIComponent('' + body.capDvis) + '&';
    if (body.maVatTuCha)
      url_ += 'loaiVthh=' + encodeURIComponent('' + body.maVatTuCha) + '&';
    if (body.soQuyetDinhNhap)
      url_ +=
        'soQuyetDinhNhap=' +
        encodeURIComponent('' + body.soQuyetDinhNhap) +
        '&';
    if (body.soBienBan)
      url_ += 'soBienBan=' + encodeURIComponent('' + body.soBienBan) + '&';
    if (body.ngayLayMauTu)
      url_ +=
        'ngayLayMauTu=' + encodeURIComponent('' + body.ngayLayMauTu) + '&';
    if (body.ngayLayMauDen)
      url_ +=
        'ngayLayMauDen=' + encodeURIComponent('' + body.ngayLayMauDen) + '&';
    if (body.trangThai)
      url_ += 'trangThai=' + encodeURIComponent('' + body.trangThai) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ +=
        'paggingReq.page=' +
        encodeURIComponent('' + (body.pageNumber - 1)) +
        '&';
    if (body.pageSize)
      url_ +=
        'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';

    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/bban-lay-mau-khac/chi-tiet?id=${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bban-lay-mau-khac/them-moi`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bban-lay-mau-khac/cap-nhat`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  xoa(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bban-lay-mau-khac/xoa?id=${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/bban-lay-mau-khac/phe-duyet?id=${body.id}&trangThai=${body.trangThai}&lyDo=${body.lyDo}`;
    return this.httpClient.put<any>(url_, null).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bban-lay-mau-khac/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bban-lay-mau-khac/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
