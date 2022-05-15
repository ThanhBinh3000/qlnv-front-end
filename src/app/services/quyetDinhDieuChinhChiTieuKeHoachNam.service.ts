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
    super(httpClient, 'QuyetDinhDieuChinhChiTieuKeHoachNam','');
  }

  timKiem(param: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/quyet-dinh-dieu-chinh`;
    let tempUrl = '';
    if (param && param.pageSize) {
      tempUrl = tempUrl + 'paggingReq.limit=' + param.pageSize + '&';
    }
    if (param && param.pageNumber) {
      tempUrl = tempUrl + 'paggingReq.page=' + (param.pageNumber - 1) + '&';
    }
    if (param && param.soQD) {
      tempUrl = tempUrl + 'soQD=' + param.soQD + '&';
    }
    if (param && param.namKeHoach) {
      tempUrl = tempUrl + 'namKeHoach=' + param.namKeHoach + '&';
    }
    if (param && param.trichYeu) {
      tempUrl = tempUrl + 'trichYeu=' + param.trichYeu + '&';
    }
    if (param && param.ngayKyDenNgay) {
      tempUrl = tempUrl + 'ngayKyDenNgay=' + param.ngayKyDenNgay + '&';
    }
    if (param && param.ngayKyTuNgay) {
      tempUrl = tempUrl + 'ngayKyTuNgay=' + param.ngayKyTuNgay + '&';
    }
    if (tempUrl && tempUrl != '') {
      url = url + '?' + tempUrl.substring(0, tempUrl.length - 1);
    }
    return this.httpClient.get<any>(url).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/quyet-dinh-dieu-chinh/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  importFile(body: any): Promise<any> {
    const formData = new FormData();
    formData.append('file', body, body.name);
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/quyet-dinh-dieu-chinh/import`;
    return this.httpClient.post(url, formData).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/quyet-dinh-dieu-chinh/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

  deleteData(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/quyet-dinh-dieu-chinh/${id}`;
    return this.httpClient.delete(url).toPromise();
  }

  soLuongTruocDieuChinh(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/quyet-dinh-dieu-chinh/so-luong-truoc-dieu-chinh`;
    return this.httpClient.post(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/quyet-dinh-dieu-chinh/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/quyet-dinh-dieu-chinh`;
    return this.httpClient.post(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/quyet-dinh-dieu-chinh`;
    return this.httpClient.put(url, body).toPromise();
  }
}
