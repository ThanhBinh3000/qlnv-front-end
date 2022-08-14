import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhGiaoNhiemVuXuatHangService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuyetDinhGiaoNhiemVuXuatHangService', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/qd-giao-nvu-xuat-hang?`;
    if (body.namXuat)
      url_ += 'namXuat=' + encodeURIComponent('' + body.namXuat) + '&';
    if (body.loaiVthh)
      url_ += 'loaiVthh=' + encodeURIComponent('' + body.loaiVthh) + '&';
    if (body.soQuyetDinh)
      url_ += 'soQuyetDinh=' + encodeURIComponent('' + body.soQuyetDinh) + '&';
    if (body.trichyeu)
      url_ += 'trichyeu=' + encodeURIComponent('' + body.trichyeu) + '&';
    if (body.ngayKyTu)
      url_ += 'ngayKyTu=' + encodeURIComponent('' + body.ngayKyTu) + '&';
    if (body.ngayKyDen)
      url_ += 'ngayKyDen=' + encodeURIComponent('' + body.ngayKyDen) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'pageable.pageNumber=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'pageable.pageSize=' + encodeURIComponent('' + body.pageSize) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/qd-giao-nvu-xuat-hang/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-giao-nvu-xuat-hang`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-giao-nvu-xuat-hang`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  deleteData(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-giao-nvu-xuat-hang/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-giao-nvu-xuat-hang/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-giao-nvu-xuat-hang/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-giao-nvu-xuat-hang/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
