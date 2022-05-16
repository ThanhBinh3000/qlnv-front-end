import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyPhieuNhapDayKhoService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyPhieuNhapDayKho','');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/ql-bien-ban-nhap-day-kho-lt?`
    if (body.denNgay)
      url_ += 'denNgay=' + encodeURIComponent('' + body.denNgay) + '&';
    if (body.maDonVi)
      url_ += 'maDonVi=' + encodeURIComponent('' + body.maDonVi) + '&';
    if (body.maHang)
      url_ += 'maHang=' + encodeURIComponent('' + body.maHang) + '&';
    if (body.soBienBan)
      url_ += 'soBienBan=' + encodeURIComponent('' + body.soBienBan) + '&';
    if (body.tuNgay)
      url_ += 'tuNgay=' + encodeURIComponent('' + body.tuNgay) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  chiTiet(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/ql-nxuat-hang/bban-nhap-day-kho/chi-tiet/${id}`
    return this.httpClient.get<any>(url).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-nxuat-hang/bban-nhap-day-kho/them-moi`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-nxuat-hang/bban-nhap-day-kho/cap-nhat`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  xoa(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-nxuat-hang/bban-nhap-day-kho/xoa`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-nxuat-hang/bban-nhap-day-kho/phe-duyet`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-nxuat-hang/bban-nhap-day-kho/ket-xuat`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}