import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuanLyPhieuKiemNghiemChatLuongHangService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyPhieuKiemNghiemChatLuongHang', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/tra-cuu?`
    if (body.ngayKnghiemTuNgay) {
      url_ += 'ngayKnghiemTuNgay=' + encodeURIComponent('' + body.ngayKnghiemTuNgay) + '&';
    }
    if (body.ngayKnghiemDenNgay) {
      url_ += 'ngayKnghiemDenNgay=' + encodeURIComponent('' + body.ngayKnghiemDenNgay) + '&';
    }
    if (body.soPhieu)
      url_ += 'soPhieu=' + encodeURIComponent('' + body.soPhieu) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/them-moi`;
    return this.httpClient.post(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/cap-nhat`;
    return this.httpClient.put(url, body).toPromise();
  }
  xoa(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/xoa?id=${id}`;
    return this.httpClient.delete(url).toPromise();
  }
  chiTiet(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/chi-tiet?id=${id}`;
    return this.httpClient.get(url).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/phe-duyet`;
    return this.httpClient.put(url, body).toPromise();
  }
}
