import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyDanhSachHangHongHocService extends BaseService {
  GATEWAY = '/qlnv-luukho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyDanhSachHangHongHoc', '');
  }

  tracuu(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-hong-hoc/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

}
