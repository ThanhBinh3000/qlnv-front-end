import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class ChiTieuKeHoachNamCapTongCucService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ChiTieuKeHoachNamCapTongCuc');
  }
  GATEWAY = '/qlnv-gateway/qlnv-khoachphi';
  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam?`;
    if (body.donViId)
      url_ += 'donViId=' + encodeURIComponent('' + body.donViId) + '&';
    if (body.ngayKyTuNgay)
      url_ +=
        'ngayKyTuNgay=' + encodeURIComponent('' + body.ngayKyTuNgay) + '&';
    if (body.ngayKyDenNgay)
      url_ +=
        'ngayKyDenNgay=' + encodeURIComponent('' + body.ngayKyDenNgay) + '&';
    if (body.soQD) url_ += 'soQD=' + encodeURIComponent('' + body.soQD) + '&';
    if (body.tenDonVi)
      url_ += 'tenDonVi=' + encodeURIComponent('' + body.tenDonVi) + '&';
    if (body.trichYeu)
      url_ += 'trichYeu=' + encodeURIComponent('' + body.trichYeu) + '&';
    if (body.pageNumber)
      url_ += 'pageNumber=' + encodeURIComponent('' + body.pageNumber) + '&';
    if (body.pageSize)
      url_ += 'pageSize=' + encodeURIComponent('' + body.pageSize) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadThongTinChiTieuKeHoachNam(id: number) {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/${id}`;
    return this.httpClient.get<any>(url_);
  }
}
