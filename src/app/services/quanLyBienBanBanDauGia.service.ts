import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyBienBanBanDauGiaService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyBienBanBanDauGia', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ban-dau-gia?`;
    if (body.loaiVthh)
      url_ += 'loaiVthh=' + encodeURIComponent('' + body.loaiVthh) + '&';
    if (body.maDvis)
      url_ += 'maDvis=' + encodeURIComponent('' + body.maDvis) + '&';
    if (body.maThongBaoBdg)
      url_ += 'maThongBaoBdg=' + encodeURIComponent('' + body.maThongBaoBdg) + '&';
    if (body.nam)
      url_ += 'nam=' + encodeURIComponent('' + body.nam) + '&';
    if (body.ngayToChucBdgDen)
      url_ += 'ngayToChucBdgDen=' + encodeURIComponent('' + body.ngayToChucBdgDen) + '&';
    if (body.ngayToChucBdgTu)
      url_ += 'ngayToChucBdgTu=' + encodeURIComponent('' + body.ngayToChucBdgTu) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
    if (body.soBienBan)
      url_ += 'soBienBan=' + encodeURIComponent('' + body.soBienBan) + '&';
    if (body.trangThai)
      url_ += 'trangThai=' + encodeURIComponent('' + body.trangThai) + '&';
    if (body.trichYeu)
      url_ += 'trichYeu=' + encodeURIComponent('' + body.trichYeu) + '&';

    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ban-dau-gia/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ban-dau-gia`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ban-dau-gia`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  deleteData(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ban-dau-gia/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ban-dau-gia/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ban-dau-gia/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-ban-dau-gia/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
