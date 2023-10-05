import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BaseService} from './base.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeXuatDieuChinhService extends BaseService {
  GATEWAY = '/qlnv-khoach';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'DeXuatDieuChinh', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/de-xuat-dieu-chinh-ke-hoach-nam?`
    if (body.namKeHoach)
      url_ += 'namKeHoach=' + encodeURIComponent('' + body.namKeHoach) + '&';
    if (body.maDvi)
      url_ += 'maDonVi=' + encodeURIComponent('' + body.maDvi) + '&';
    if (body.soVanBan)
      url_ += 'soVanBan=' + encodeURIComponent('' + body.soVanBan) + '&';
    if (body.trichYeuDx)
      url_ += 'trichYeuDx=' + encodeURIComponent('' + body.trichYeuDx) + '&';
    if (body.ngayKyDenNgayDx)
      url_ += 'ngayKyDenNgayDx=' + encodeURIComponent('' + body.ngayKyDenNgayDx) + '&';
    if (body.ngayKyTuNgayDx)
      url_ += 'ngayKyTuNgayDx=' + encodeURIComponent('' + body.ngayKyTuNgayDx) + '&';
    if (body.soQuyetDinh)
      url_ += 'soQuyetDinh=' + encodeURIComponent('' + body.soQuyetDinh) + '&';
    if (body.trichYeuQd)
      url_ += 'trichYeuQd=' + encodeURIComponent('' + body.trichYeuQd) + '&';
    if (body.ngayKyDenNgayQd)
      url_ += 'ngayKyDenNgayQd=' + encodeURIComponent('' + body.ngayKyDenNgayQd) + '&';
    if (body.ngayKyTuNgayQd)
      url_ += 'ngayKyTuNgayQd=' + encodeURIComponent('' + body.ngayKyTuNgayQd) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/de-xuat-dieu-chinh-ke-hoach-nam/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/de-xuat-dieu-chinh-ke-hoach-nam`;
    return this.httpClient.post(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/de-xuat-dieu-chinh-ke-hoach-nam`;
    return this.httpClient.put(url, body).toPromise();
  }

  deleteData(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/de-xuat-dieu-chinh-ke-hoach-nam/${id}`;
    return this.httpClient.delete(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/de-xuat-dieu-chinh-ke-hoach-nam/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/de-xuat-dieu-chinh-ke-hoach-nam/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  soLuongTruocDieuChinh(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/de-xuat-dieu-chinh-ke-hoach-nam/so-luong-truoc-dieu-chinh/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/de-xuat-dieu-chinh-ke-hoach-nam/export/list`;
    return this.httpClient.post(url, body, {responseType: 'blob'});
  }
}
