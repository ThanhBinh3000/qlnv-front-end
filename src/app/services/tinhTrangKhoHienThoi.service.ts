import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class TinhTrangKhoHienThoiService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'TinhTrangKhoHienThoi','');
  }

  timKiemNganLo(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/mlk/ngan-lo/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
}
