import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HangSapHetHanLkChuaXuatKhoService extends BaseService {
  GATEWAY = '/qlnv-luukho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLySoKhoTheKho', '');
  }
  search(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-sap-het-han-lk-chua-xuat-kho/tra-cuu`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-sap-het-han-lk-chua-xuat-kho/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
