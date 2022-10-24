import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuanLyBienBanKetThucNhapKhoService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyBienBanKetThucNhapKho', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ket-thuc-nhap-kho-vt?`;
    if (body.soQdNhap)
      url_ += 'soQdNhap=' + encodeURIComponent('' + body.soQdNhap) + '&';
    if (body.soBienBan)
      url_ += 'soBienBan=' + encodeURIComponent('' + body.soBienBan) + '&';
    if (body.ngayNhapDayKhoTu) {
      url_ += 'ngayNhapDayKhoTu=' + encodeURIComponent('' + body.ngayNhapDayKhoTu) + '&';
    }
    if (body.capDvis) {
      url_ += 'capDvis=' + encodeURIComponent('' + body.capDvis) + '&';
    }
    if (body.ngayNhapDayKhoDen) {
      url_ += 'ngayNhapDayKhoDen=' + encodeURIComponent('' + body.ngayNhapDayKhoDen) + '&';
    }
    if (body.ngayKetThucTu) {
      url_ += 'ngayKetThucTu=' + encodeURIComponent('' + body.ngayKetThucTu) + '&';
    }
    if (body.ngayKetThucDen) {
      url_ += 'ngayKetThucDen=' + encodeURIComponent('' + body.ngayKetThucDen) + '&';
    }
    if (body.trangThai) {
      url_ += 'trangThai=' + encodeURIComponent('' + body.trangThai) + '&';
    }
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ket-thuc-nhap-kho-vt/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ket-thuc-nhap-kho-vt`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ket-thuc-nhap-kho-vt`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  deleteData(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ket-thuc-nhap-kho-vt/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ket-thuc-nhap-kho-vt/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ket-thuc-nhap-kho-vt/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ket-thuc-nhap-kho-vt/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
