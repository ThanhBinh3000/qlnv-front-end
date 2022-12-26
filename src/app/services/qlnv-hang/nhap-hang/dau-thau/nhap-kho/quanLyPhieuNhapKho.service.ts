import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyPhieuNhapKhoService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'phieu-nhap-kho', '/qlnv-hang');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/phieu-nhap-kho?`;
    if (body.denNgayNhapKho)
      url_ += 'denNgayNhapKho=' + encodeURIComponent('' + body.denNgayNhapKho) + '&';
    if (body.maDvi)
      url_ += 'maDvis=' + encodeURIComponent('' + body.maDvi) + '&';
    if (body.capDvis) {
      url_ += 'capDvis=' + encodeURIComponent('' + body.capDvis) + '&';
    }
    if (body.loaiVthh)
      url_ += 'loaiVthh=' + encodeURIComponent('' + body.loaiVthh) + '&';
    if (body.soQdNhap)
      url_ += 'soQdNhap=' + encodeURIComponent('' + body.soQdNhap) + '&';
    if (body.tuNgayNhapKho)
      url_ += 'tuNgayNhapKho=' + encodeURIComponent('' + body.tuNgayNhapKho) + '&';
    if (body.soPhieu)
      url_ += 'soPhieu=' + encodeURIComponent('' + body.soPhieu) + '&';
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
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/phieu-nhap-kho/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phieu-nhap-kho`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phieu-nhap-kho`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  deleteData(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phieu-nhap-kho/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phieu-nhap-kho/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phieu-nhap-kho/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phieu-nhap-kho/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

  taoTheKho(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phieu-nhap-kho/lk-the-kho`;
    return this.httpClient.post(url, body).toPromise();
  }


}
