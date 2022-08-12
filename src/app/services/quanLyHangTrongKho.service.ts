import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuanLyHangTrongKhoService extends BaseService {
  GATEWAY = '/qlnv-luukho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyHangTrongKho', '');
  }

  timKiemChiTiet(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-trong-kho/detail`
    return this.httpClient.post<any>(url, body).toPromise();
  }

}
