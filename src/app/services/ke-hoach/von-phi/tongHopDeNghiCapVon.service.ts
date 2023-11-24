import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {BaseService} from '../../base.service';

@Injectable({
  providedIn: 'root',
})
export class TongHopDeNghiCapVonService extends BaseService {
  GATEWAY = '/qlnv-khoach';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'TongHopDeNghiCapVon', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-nghi-cap-von?`
    if (body.maTongHop)
      url_ += 'maTongHop=' + encodeURIComponent('' + body.maTongHop) + '&';
    if (body.maDvis)
      url_ += 'maDvis=' + encodeURIComponent('' + body.maDvis) + '&';
    if (body.nam)
      url_ += 'nam=' + encodeURIComponent('' + body.nam) + '&';
    if (body.ngayTongHopDenNgay)
      url_ += 'ngayTongHopDenNgay=' + encodeURIComponent('' + body.ngayTongHopDenNgay) + '&';
    if (body.ngayTongHopTuNgay)
      url_ += 'ngayTongHopTuNgay=' + encodeURIComponent('' + body.ngayTongHopTuNgay) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-nghi-cap-von/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-nghi-cap-von`;
    return this.httpClient.post(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-nghi-cap-von`;
    return this.httpClient.put(url, body).toPromise();
  }

  deleteData(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-nghi-cap-von/${id}`;
    return this.httpClient.delete(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-nghi-cap-von/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-nghi-cap-von/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-nghi-cap-von/export/list`;
    return this.httpClient.post(url, body, {responseType: 'blob'});
  }

  preview(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tong-hop-de-nghi-cap-von/xem-truoc`;
    return this.httpClient.post(url, body).toPromise();
  }
}
