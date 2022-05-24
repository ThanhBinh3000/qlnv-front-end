import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyPhieuNhapKhoService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyPhieuNhapKho','');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-nhap-kho-lt?`
    if (body.denNgay)
      url_ += 'denNgay=' + encodeURIComponent('' + body.denNgay) + '&';
    if (body.maDonVi)
      url_ += 'maDonVi=' + encodeURIComponent('' + body.maDonVi) + '&';
    if (body.vatTuId)
      url_ += 'vatTuId=' + encodeURIComponent('' + body.vatTuId) + '&';
    if (body.soPhieu)
      url_ += 'soPhieu=' + encodeURIComponent('' + body.soPhieu) + '&';
    if (body.maKhoNgan)
      url_ += 'maKhoNgan=' + encodeURIComponent('' + body.maKhoNgan) + '&';
    if (body.tuNgay)
      url_ += 'tuNgay=' + encodeURIComponent('' + body.tuNgay) + '&';
    if (body.trangThai)
      url_ += 'trangThai=' + encodeURIComponent('' + body.trangThai) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }
}