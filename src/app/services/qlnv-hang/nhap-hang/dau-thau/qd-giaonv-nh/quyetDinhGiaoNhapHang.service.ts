import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhGiaoNhapHangService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/nhap-xuat', '/qlnv-hang');
  }

  updateDdiemNhap(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/cap-nhat-ddiem-nhap`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  exportBbNtBq(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat/bbntbq`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

  layTatCaQdGiaoNvNh(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-qd-giao-nv-nh`;
    return this._httpClient.post<any>(url, body).toPromise();
  }
}
