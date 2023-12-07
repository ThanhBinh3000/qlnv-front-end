import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from "../../../base.service";
import {environment} from "../../../../../environments/environment";


@Injectable({
  providedIn: 'root',
})
export class ReportKhScThuongXuyenService extends BaseService {
  GATEWAY = '';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kh-sc-thuong-xuyen', '');
  }

  thKhSuaChuaTXuyen(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/th-kh-sc-txuyen`;
    return this._httpClient.post(url, body, {responseType: 'blob'}).toPromise();
  }

}
