import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeXuatKeHoachBanDauGiaService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ke-hoach-ban-dau-gia', '/qlnv-hang');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/ke-hoach-ban-dau-gia/search?`
    if (body.id)
      url_ += 'id=' + encodeURIComponent('' + body.id) + '&';
    if (body.namKeHoach)
      url_ += 'namKeHoach=' + encodeURIComponent('' + body.namKeHoach) + '&';
    if (body.maDvis)
      url_ += 'maDvis=' + encodeURIComponent('' + body.maDvis) + '&';
    if (body.soKeHoach)
      url_ += 'soKeHoach=' + encodeURIComponent('' + body.soKeHoach) + '&';
    if (body.trichYeu)
      url_ += 'trichYeu=' + encodeURIComponent('' + body.trichYeu) + '&';
    if (body.ngayKyTuNgay)
      url_ += 'ngayKyTuNgay=' + encodeURIComponent('' + body.ngayKyTuNgay) + '&';
    if (body.ngayKyDenNgay)
      url_ += 'ngayKyDenNgay=' + encodeURIComponent('' + body.ngayKyDenNgay) + '&';
    if (body.loaiVatTuHangHoa)
      url_ += 'loaiVatTuHangHoa=' + encodeURIComponent('' + body.loaiVatTuHangHoa) + '&';
    if (body.trangThai)
      url_ += 'trangThai=' + encodeURIComponent('' + body.trangThai) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';

    if (body.page != null || body.page != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.page - 1)) + '&';
    if (body.pageLimit)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageLimit) + '&';


    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/ke-hoach-ban-dau-gia/${id}`
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ke-hoach-ban-dau-gia`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ke-hoach-ban-dau-gia`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  xoa(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ke-hoach-ban-dau-gia/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ke-hoach-ban-dau-gia`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: body
    }
    return this.httpClient.delete(url, httpOptions).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ke-hoach-ban-dau-gia/trang-thai?id=${body.id}&trangThaiId=${body.trangThaiId}`;
    return this.httpClient.put<any>(url, null).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ke-hoach-ban-dau-gia/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
