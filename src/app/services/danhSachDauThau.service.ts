import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class DanhSachDauThauService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'DanhSachDauThau');
  }

  timKiem(body: any): Promise<any> {
    const url = `http://192.168.1.62:8762/qlnv-gateway/qlnv-hang/dx-kh/lcnt-gao/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
}
