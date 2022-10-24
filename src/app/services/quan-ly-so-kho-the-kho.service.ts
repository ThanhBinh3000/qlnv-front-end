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
    super(httpClient, 'QuanLySoKhoTheKho', '');
  }

  pheDuyet(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/so-kho-the-kho/phe-duyet`
    return this.httpClient.put<any>(url, body).toPromise();
  }

  them(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/so-kho-the-kho`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/so-kho-the-kho`
    return this.httpClient.put<any>(url, body).toPromise();
  }

  timKiem(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/so-kho-the-kho/tra-cuu`
    return this.httpClient.post<any>(url, body).toPromise();
  }
  chiTiet(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/so-kho-the-kho/${id}`
    return this.httpClient.get<any>(url).toPromise()
  }
  deleteData(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/so-kho-the-kho/${id}`;
    return this.httpClient.delete(url).toPromise();
  }
  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/so-kho-the-kho/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  exportCT(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/so-kho-the-kho/export/listct`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/so-kho-the-kho/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/so-kho-the-kho/phe-duyet`
    return this.httpClient.put(url, body).toPromise();
  }
  editData(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/so-kho-the-kho`
    return this.httpClient.put(url, body).toPromise();
  }
}
