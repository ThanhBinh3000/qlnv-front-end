import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from "../base.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ThongTu1452013Service extends BaseService {
  GATEWAY = 'qlnv-report';

  constructor(public httpClient: HttpClient) {
    super(httpClient, '145-2013-ttbtc', '');
  }

  reportNhapXuatTon(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/nhap-xuat-ton`;
    return this._httpClient.post(url, body, {responseType: 'blob'}).toPromise();
  }
}
