import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThongBaoDauGiaKhongThanhCongService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ThongBaoDauGiaTaiSanService', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia-khong-thanh?`;
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
    if (body.paggingReq.page != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.paggingReq.page)) + '&';
    if (body.paggingReq.limit)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.paggingReq.limit) + '&';
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
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia-khong-thanh/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  deleteData(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia-khong-thanh/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia-khong-thanh/delete/multiple`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia-khong-thanh/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia-khong-thanh`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia-khong-thanh`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia-khong-thanh/status`;
    return this.httpClient.put<any>(url, body).toPromise();
  }
}
