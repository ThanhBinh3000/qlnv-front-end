import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhPheDuyetKQBanDauGiaService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'qd-phe-duyet-kqbdg', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-kqbdg?`;
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
    if (body.ngayKyDen) {
      url_ += 'ngayKyDen=' + encodeURIComponent('' + body.ngayKyDen) + '&';
    }
    if (body.ngayKyTu) {
      url_ += 'ngayKyTu=' + encodeURIComponent('' + body.ngayKyTu) + '&';
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
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-kqbdg`;
    return this.httpClient.post(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-kqbdg`;
    return this.httpClient.put(url, body).toPromise();
  }
  xoa(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-kqbdg/${id}`;
    return this.httpClient.delete(url).toPromise();
  }
  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-kqbdg/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }
  chiTiet(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-kqbdg/${id}`;
    return this.httpClient.get(url).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-kqbdg/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-kqbdg/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

  listData(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/qd-phe-duyet-kqbdg/listData`;
    return this.httpClient.post(url, body).toPromise();
  }
}
