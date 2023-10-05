import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class TongHopDeXuatKHBanDauGiaService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'tong-hop-de-xuat-ke-hoach-ban-dau-gia', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-xuat-ke-hoach-ban-dau-gia/search?`;
    if (body.maDvis) {
      url_ += 'maDvis=' + encodeURIComponent(body.maDvis) + '&';
    }
    if (body.capDvis) {
      url_ += 'capDvis=' + encodeURIComponent('' + body.capDvis) + '&';
    }
    if (body.maVatTuCha) {
      url_ += 'maVatTuCha=' + encodeURIComponent(body.maVatTuCha) + '&';
    }
    if (body.namKeHoach) {
      url_ += 'namKeHoach=' + encodeURIComponent('' + body.namKeHoach) + '&';
    }
    if (body.noiDungTongHop) {
      url_ += 'noiDungTongHop=' + encodeURIComponent('' + body.noiDungTongHop) + '&';
    }
    if (body.ngayTongHopDenNgay) {
      url_ += 'ngayTongHopDenNgay=' + encodeURIComponent('' + body.ngayTongHopDenNgay) + '&';
    }
    if (body.ngayTongHopTuNgay) {
      url_ += 'ngayTongHopTuNgay=' + encodeURIComponent('' + body.ngayTongHopTuNgay) + '&';
    }
    if (body.pageNumber != null || body.pageNumber != undefined) {
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    }
    if (body.pageSize) {
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
    }

    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-xuat-ke-hoach-ban-dau-gia`;
    return this.httpClient.post(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-xuat-ke-hoach-ban-dau-gia`;
    return this.httpClient.put(url, body).toPromise();
  }

  xoa(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-xuat-ke-hoach-ban-dau-gia/${id}`;
    return this.httpClient.delete(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-xuat-ke-hoach-ban-dau-gia`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: body
    }
    return this.httpClient.delete(url, httpOptions).toPromise();
  }

  chiTiet(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-xuat-ke-hoach-ban-dau-gia/${id}`;
    return this.httpClient.get(url).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-xuat-ke-hoach-ban-dau-gia/trang-thai`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-xuat-ke-hoach-ban-dau-gia/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
