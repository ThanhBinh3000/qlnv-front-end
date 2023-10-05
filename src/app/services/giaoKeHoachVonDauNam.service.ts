import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class GiaoKeHoachVonDauNamService extends BaseService {
  GATEWAY = '/qlnv-khoach';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'GiaoKeHoachVonDauNam', '');
  }

  countSoLuong(): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/giao-kh-von-dau-nam/count`;
    return this.httpClient.get<any>(url_).toPromise();
  }
}
