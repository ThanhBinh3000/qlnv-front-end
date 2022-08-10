import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class PhieuNhapKhoTamGuiService extends BaseService {
  GATEWAY = '/qlnv-hang';
  PHIEU_NHAP_KHO_TAM_GUI = 'phieu-nhap-kho-tam-gui'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'PhieuNhapKhoTam', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/${this.PHIEU_NHAP_KHO_TAM_GUI}?`;
    if (body.maDvi)
      url_ += 'maDvi=' + encodeURIComponent('' + body.maDvi) + '&';
    if (body.loaiVthh)
      url_ += 'loaiVthh=' + encodeURIComponent('' + body.loaiVthh) + '&';
    if (body.ngayNhapKho) {
      url_ += 'ngayNhapKhoTu=' + encodeURIComponent('' + dayjs(body.ngayNhapKho[0]).format('YYYY-MM-DD')) + '&';
      url_ += 'ngayNhapKhoDen=' + encodeURIComponent('' + dayjs(body.ngayNhapKho[1]).format('YYYY-MM-DD')) + '&';
    }
    if (body.capDvis) {
      url_ += 'capDvis=' + encodeURIComponent('' + body.capDvis) + '&';
    }
    if (body.soPhieu)
      url_ +=
        'soPhieu=' + encodeURIComponent('' + body.soPhieu) + '&';
    if (body.soQuyetDinh)
      url_ +=
        'soQdNhap=' + encodeURIComponent('' + body.soQuyetDinh) + '&';
    if (body.trangThai) url_ += 'trangThai=' + encodeURIComponent('' + body.trangThai) + '&';
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

  chiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/${this.PHIEU_NHAP_KHO_TAM_GUI}/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.PHIEU_NHAP_KHO_TAM_GUI}/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.PHIEU_NHAP_KHO_TAM_GUI}/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

  deleteData(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.PHIEU_NHAP_KHO_TAM_GUI}/${id}`;
    return this.httpClient.delete(url).toPromise();
  }

  themMoi(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.PHIEU_NHAP_KHO_TAM_GUI}`;
    return this.httpClient.post(url, body).toPromise();
  }

  chinhSua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.PHIEU_NHAP_KHO_TAM_GUI}`;
    return this.httpClient.put(url, body).toPromise();
  }
  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.PHIEU_NHAP_KHO_TAM_GUI}/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }
}
