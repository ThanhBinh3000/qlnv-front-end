import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuanLySoKhoTheKhoService extends BaseService {
  GATEWAY = '/qlnv-luukho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'so-kho-the-kho', '');
  }

  loadDsNhapXuat(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}/qlnv-hang/lich-su-nhap-xuat/ds-nhap-xuat-the-kho`
    return this.httpClient.post<any>(url, body).toPromise();
  }
}
