import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhuongAnKeHoachLCNTService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'PhuongAnKeHoachLCNT');
  }

  timKiem(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/pan-lcnt-gao/tra-cuu`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  danhSachChuaQuyetDinh(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/pan-lcnt-gao/tra-cuu/ds-chua-qd`
    return this.httpClient.post<any>(url, body).toPromise();
  }
}