import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhDieuChinhChiTieuKeHoachNamService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-khoachphi';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuyetDinhDieuChinhChiTieuKeHoachNam');
  }

  timKiem(param: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/quyet-dinh-dieu-chinh`;
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

  importFile(body: any): Promise<any> {
    const formData = new FormData();
    formData.append('file', body, body.name);
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/quyet-dinh-dieu-chinh/import`
    return this.httpClient.post(url, formData).toPromise();
  }

  exportList(): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/quyet-dinh-dieu-chinh/export/list`
    return this.httpClient.post(url, null, { responseType: 'blob' });
  }

  deleteData(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/quyet-dinh-dieu-chinh/${id}`
    return this.httpClient.delete(url).toPromise();
  }
}