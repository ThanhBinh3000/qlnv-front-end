import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from 'src/app/services/base.service';
import { Observable } from 'rxjs';
import { OldResponseData } from 'src/app/interfaces/response';
@Injectable({
  providedIn: 'root',
})
export class QuanLyBienBanLayMauXuatService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyBienBanLayMau', '');
  }

  search(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-lay-mau/search?`;
    if (body.soBienBan)
      url_ += 'soBienBan=' + encodeURIComponent('' + body.soBienBan) + '&';
    if (body.capDvis)
      url_ += 'capDvis=' + encodeURIComponent('' + body.capDvis) + '&';
    if (body.maDvis)
      url_ += 'maDvis=' + encodeURIComponent('' + body.maDvis) + '&';
    if (body.maDiemKho)
      url_ += 'maDiemKho=' + encodeURIComponent('' + body.maDiemKho) + '&';
    if (body.maNhaKho)
      url_ += 'maNhaKho=' + encodeURIComponent('' + body.maNhaKho) + '&';
    if (body.maNganKho)
      url_ += 'maNganKho=' + encodeURIComponent('' + body.maNganKho) + '&';
    if (body.maNganLo)
      url_ += 'maNganLo=' + encodeURIComponent('' + body.maNganLo) + '&';
    if (body.ngayLayMauDenNgay)
      url_ +=
        'ngayLayMauDenNgay=' +
        encodeURIComponent('' + body.ngayLayMauDenNgay) +
        '&';
    if (body.ngayLayMauTuNgay)
      url_ +=
        'ngayLayMauTuNgay=' +
        encodeURIComponent('' + body.ngayLayMauTuNgay) +
        '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ +=
        'paggingReq.page=' +
        encodeURIComponent('' + (body.pageNumber - 1)) +
        '&';
    if (body.pageSize)
      url_ +=
        'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';

    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  searchDetail(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-lay-mau/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }
  addNew(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-lay-mau`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
  edit(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-lay-mau`;
    return this.httpClient.put<any>(url, body).toPromise();
  }
  delete(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-lay-mau/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }
  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-lay-mau`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: body
    }
    return this.httpClient.delete(url, httpOptions).toPromise();
  }
  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-lay-mau/trang-thai?id=${body.id}&trangThaiId=${body.trangThai}`;
    return this.httpClient.put<any>(url, null).toPromise();
  }
  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bien-ban-lay-mau/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
