import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyBienBanLayMauService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyBienBanLayMau', '');
  }

  timKiem(body: any): Promise<any> {

    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/bban-lay-mau/tra-cuu?`
    if (body.ngayLayMau) {
      url_ += 'ngayLapBbanTuNgay=' + encodeURIComponent('' + body.denNgay) + '&';
      url_ += 'ngayLapBbanDenNgay=' + encodeURIComponent('' + body.denNgay) + '&';
    }
    if (body.soHopDong)
      url_ += 'soHopDong=' + encodeURIComponent('' + body.soHopDong) + '&';
    if (body.diemkho)
      url_ += 'diemkho=' + encodeURIComponent('' + body.diemkho) + '&';
    if (body.nhaKho)
      url_ += 'nhaKho=' + encodeURIComponent('' + body.nhaKho) + '&';
    if (body.nganLoBaoQuan)
      url_ += 'nganLoBaoQuan=' + encodeURIComponent('' + body.nganLoBaoQuan) + '&';
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
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/bban-lay-mau/chi-tiet?id=${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bban-lay-mau/them-moi`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bban-lay-mau/cap-nhat`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  xoa(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bban-lay-mau/xoa`;
    return this.httpClient.delete<any>(`${url}/${id}`).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bban-lay-mau/phe-duyet`;
    return this.httpClient.put(url, body).toPromise();
  }

}