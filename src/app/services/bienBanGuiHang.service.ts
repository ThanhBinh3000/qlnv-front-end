import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class BienBanGuiHangService extends BaseService {
  GATEWAY = '/qlnv-hang';
  BIEN_BAN_GUI_HANG = 'bien-ban-gui-hang'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'BienBanGuiHang', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/${this.BIEN_BAN_GUI_HANG}?`;
    if (body.ngayGuiHang) {
      url_ += 'ngayGuiHangTu=' + encodeURIComponent('' + dayjs(body.ngayNhapKho[0]).format('YYYY-MM-DD')) + '&';
      url_ += 'ngayGuiHangDen=' + encodeURIComponent('' + dayjs(body.ngayNhapKho[1]).format('YYYY-MM-DD')) + '&';
    }
    if (body.soBienBan)
      url_ +=
        'soBienBan=' + encodeURIComponent('' + body.soBienBan) + '&';
    if (body.soQuyetDinh)
      url_ +=
        'soQdNhap=' + encodeURIComponent('' + body.soQuyetDinh) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ +=
        'paggingReq.page=' +
        encodeURIComponent('' + (body.pageNumber - 1)) +
        '&';
    if (body.trangThai) {
      url_ += 'trangThai=' + encodeURIComponent('' + body.trangThai) + '&';
    }
    if (body.pageSize)
      url_ +=
        'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  chiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/${this.BIEN_BAN_GUI_HANG}/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.BIEN_BAN_GUI_HANG}/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.BIEN_BAN_GUI_HANG}/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

  deleteData(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.BIEN_BAN_GUI_HANG}/${id}`;
    return this.httpClient.delete(url).toPromise();
  }

  themMoi(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.BIEN_BAN_GUI_HANG}`;
    return this.httpClient.post(url, body).toPromise();
  }

  chinhSua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.BIEN_BAN_GUI_HANG}`;
    return this.httpClient.put(url, body).toPromise();
  }
  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.BIEN_BAN_GUI_HANG}/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }
}
