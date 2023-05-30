import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {BaseTestService} from "../../../base-test.service";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhPheDuyetKeHoachNhapKhacService extends BaseTestService {
  GATEWAY = '';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'nhap-khac/qd-pduyet-khnk', '');
  }

  updateDdiemNhap(body: any): Promise<any> {
    const url = `${environment.SERVICE_API_LOCAL}${this.GATEWAY}/${this.table}/cap-nhat-ddiem-nhap`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  exportBbNtBq(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API_LOCAL}${this.GATEWAY}/${this.table}/ket-xuat/bbntbq`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

}
