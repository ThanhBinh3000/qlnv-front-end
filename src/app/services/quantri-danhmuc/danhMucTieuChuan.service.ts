import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class DanhMucTieuChuanService extends BaseService {
  gateway: string = '/qlnv-category'
  table: string = 'dm-tieu-chuan'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dm-tieu-chuan', '/qlnv-category');
  }

  getDetailByMaHh(maHh): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet/ma-hh/${maHh}`;
    return this._httpClient.get<any>(url).toPromise();
  }

}
