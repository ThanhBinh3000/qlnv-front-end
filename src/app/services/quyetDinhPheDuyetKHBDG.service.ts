import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhPheDuyetKHBDGService extends BaseService {
  GATEWAY = '/qlnv-hang';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuyetDinhPheDuyetKHBDG', '/qlnv-hang');
  }
  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-ke-hoach-ban-dau-gia/search?`;
    if (body.maDvis) {
      url_ += 'maDvis=' + encodeURIComponent(body.maDvis) + '&';
    }
    if (body.capDvis) {
      url_ += 'capDvis=' + encodeURIComponent('' + body.capDvis) + '&';
    }
    if (body.loaiVthh) {
      url_ += 'loaiVthh=' + encodeURIComponent(body.loaiVthh) + '&';
    }
    if (body.nam) {
      url_ += 'nam=' + encodeURIComponent('' + body.nam) + '&';
    }
    if (body.soQuyetDinh) {
      url_ += 'soQuyetDinh=' + encodeURIComponent('' + body.soQuyetDinh) + '&';
    }
    if (body.trichYeu) {
      url_ += 'trichYeu=' + encodeURIComponent('' + body.trichYeu) + '&';
    }
    if (body.ngayKyDenNgay) {
      url_ += 'ngayKyDenNgay=' + encodeURIComponent('' + body.ngayKyDenNgay) + '&';
    }
    if (body.ngayKyTuNgay) {
      url_ += 'ngayKyTuNgay=' + encodeURIComponent('' + body.ngayKyTuNgay) + '&';
    }
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ +=
        'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';

    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-ke-hoach-ban-dau-gia`;
    return this.httpClient.post(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-ke-hoach-ban-dau-gia`;
    return this.httpClient.put(url, body).toPromise();
  }
  xoa(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-ke-hoach-ban-dau-gia/${id}`;
    return this.httpClient.delete(url).toPromise();
  }
  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-ke-hoach-ban-dau-gia`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: body
    }
    return this.httpClient.delete(url, httpOptions).toPromise();
  }
  chiTiet(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-ke-hoach-ban-dau-gia/${id}`;
    return this.httpClient.get(url).toPromise();
  }
  getPhuLuc(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-ke-hoach-ban-dau-gia/phu-luc?bhTongHopDeXuatId=${id}`;
    return this.httpClient.get(url).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-ke-hoach-ban-dau-gia/trang-thai`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-ke-hoach-ban-dau-gia/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

}
