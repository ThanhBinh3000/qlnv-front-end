import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhDieuChinhChiTieuKeHoachNamService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuyetDinhDieuChinhChiTieuKeHoachNam');
  }

  timKiem(param: any): Promise<any> {
    let url = `${environment.SERVICE_API}/qlnv-gateway/qlnv-khoachphi/chi-tieu-ke-hoach-nam/quyet-dinh-dieu-chinh/`;
    let tempUrl = "";
    if (param && param.pageSize) {
      tempUrl = tempUrl + "pageSize=" + param.pageSize + "&";
    }
    if (param && param.pageNumber) {
      tempUrl = tempUrl + "pageNumber=" + param.pageNumber + "&";
    }
    if (param && param.soQD) {
      tempUrl = tempUrl + "soQD=" + param.soQD + "&";
    }
    if (param && param.namKeHoach) {
      tempUrl = tempUrl + "namKeHoach=" + param.namKeHoach + "&";
    }
    if (param && param.trichYeu) {
      tempUrl = tempUrl + "trichYeu=" + param.trichYeu + "&";
    }
    if (param && param.ngayKyDenNgay) {
      tempUrl = tempUrl + "ngayKyDenNgay=" + param.ngayKyDenNgay + "&";
    }
    if (param && param.ngayKyTuNgay) {
      tempUrl = tempUrl + "ngayKyTuNgay=" + param.ngayKyTuNgay + "&";
    }
    if (tempUrl && tempUrl != "") {
      url = url + "?" + tempUrl;
    }
    return this.httpClient.get<any>(url).toPromise();
  }
}