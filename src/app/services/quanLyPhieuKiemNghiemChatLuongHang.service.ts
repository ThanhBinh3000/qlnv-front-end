import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuanLyPhieuKiemNghiemChatLuongHangService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyPhieuKiemNghiemChatLuongHang', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/?`;
    if (body.maDvi) {
      url_ += 'maDvi=' + encodeURIComponent(body.maDvi) + '&';
    }
    if (body.capDvis) {
      url_ += 'capDvis=' + encodeURIComponent('' + body.capDvis) + '&';
    }
    if (body.maVatTuCha) {
      url_ += 'maVatTuCha=' + encodeURIComponent(body.maVatTuCha) + '&';
    }

    if (body.ngayKnghiemTu) {
      url_ +=
        'ngayKnghiemTu=' + encodeURIComponent('' + body.ngayKnghiemTu) + '&';
    }
    if (body.ngayKnghiemDen) {
      url_ +=
        'ngayKnghiemDen=' + encodeURIComponent('' + body.ngayKnghiemDen) + '&';
    }
    if (body.ngayLayMauTu) {
      url_ +=
        'ngayLayMauTu=' + encodeURIComponent('' + body.ngayLayMauTu) + '&';
    }
    if (body.ngayLayMauDen) {
      url_ +=
        'ngayLayMauDen=' + encodeURIComponent('' + body.ngayLayMauDen) + '&';
    }
    if (body.ngayBanGiaoMauTu) {
      url_ +=
        'ngayBanGiaoMauTu=' +
        encodeURIComponent('' + body.ngayBanGiaoMauTu) +
        '&';
    }
    if (body.ngayBanGiaoMauDen) {
      url_ +=
        'ngayBanGiaoMauDen=' +
        encodeURIComponent('' + body.ngayBanGiaoMauDen) +
        '&';
    }

    if (body.soPhieu) {
      url_ += 'soPhieu=' + encodeURIComponent('' + body.soPhieu) + '&';
    }

    if (body.soBbBanGiao) {
      url_ += 'soBbBanGiao=' + encodeURIComponent('' + body.soBbBanGiao) + '&';
    }

    if (body.soQdNhap) {
      url_ += 'soQdNhap=' + encodeURIComponent('' + body.soQdNhap) + '&';
    }

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

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong`;
    return this.httpClient.post(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong`;
    return this.httpClient.put(url, body).toPromise();
  }
  xoa(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/${id}`;
    return this.httpClient.delete(url).toPromise();
  }
  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }
  chiTiet(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/${id}`;
    return this.httpClient.get(url).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Promise<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/export/list`;
    return this.httpClient
      .post(url, body, { responseType: 'blob' })
      .toPromise();
  }
}
