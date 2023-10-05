import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyHangBiHongCanBaoHanhService extends BaseService {
  GATEWAY = '/qlnv-luukho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyHangBiHongCanBaoHanh', '');
  }

  tracuu(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-can-bao-hanh/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  chitiet(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-can-bao-hanh/${id}`;
    return this.httpClient.get<any>(url).toPromise();
  }

  them(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-can-bao-hanh`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-can-bao-hanh`;
    return this.httpClient.put<any>(url, body).toPromise();
  }

  xoa(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-can-bao-hanh/${id}`;
    return this.httpClient.delete<any>(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-can-bao-hanh/delete/multiple`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-can-bao-hanh/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

  exportListct(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-can-bao-hanh/export/listct`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

}
