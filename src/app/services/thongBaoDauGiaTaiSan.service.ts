import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThongBaoDauGiaTaiSanService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ThongBaoDauGiaTaiSanService', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia/search?`;
    if (body.namKeHoach)
      url_ += 'namKeHoach=' + encodeURIComponent('' + body.namKeHoach) + '&';
    if (body.maVatTuCha)
      url_ += 'maVatTuCha=' + encodeURIComponent('' + body.maVatTuCha) + '&';
    if (body.maDvis)
      url_ += 'maDvis=' + encodeURIComponent('' + body.maDvis) + '&';
    if (body.soQuyetDinhPheDuyetKHBDG)
      url_ += 'soQuyetDinhPheDuyetKHBDG=' + encodeURIComponent('' + body.soQuyetDinhPheDuyetKHBDG) + '&';
    if (body.maThongBaoBDG)
      url_ += 'maThongBaoBDG=' + encodeURIComponent('' + body.maThongBaoBDG) + '&';
    if (body.trichYeu)
      url_ += 'trichYeu=' + encodeURIComponent('' + body.trichYeu) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'pageable.pageNumber=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'pageable.pageSize=' + encodeURIComponent('' + body.pageSize) + '&';
    if (body.ngayToChucBDGTuNgay)
      url_ += 'ngayToChucBDGTuNgay=' + encodeURIComponent('' + body.ngayToChucBDGTuNgay) + '&';
    if (body.ngayToChucBDGDenNgay)
      url_ += 'ngayToChucBDGDenNgay=' + encodeURIComponent('' + body.ngayToChucBDGDenNgay) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  deleteData(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia`;
    return this.httpClient.delete(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/thong-bao-ban-dau-gia/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
