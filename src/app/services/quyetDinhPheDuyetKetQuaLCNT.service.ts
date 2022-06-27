import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhPheDuyetKetQuaLCNTService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/qd-pduyet-kqlcnt', '/qlnv-gateway/qlnv-hang');
  }

  timKiem(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-pduyet-kqlcnt/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  chiTiet(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-pduyet-kqlcnt/chi-tiet/${id}`;
    return this.httpClient.get<any>(url).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-pduyet-kqlcnt/phe-duyet`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  update(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-pduyet-kqlcnt/cap-nhat`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  create(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-pduyet-kqlcnt/them-moi`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  xoa(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-pduyet-kqlcnt/xoa`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
}
