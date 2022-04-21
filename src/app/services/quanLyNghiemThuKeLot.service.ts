import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyNghiemThuKeLotService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyNghiemThuKeLot');
  }

  timKiem(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/bb-nghiemthu-klst/tra-cuu`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/bb-nghiemthu-klst/them-moi`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/bb-nghiemthu-klst/cap-nhat`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  xoa(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/bb-nghiemthu-klst/xoa`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
}