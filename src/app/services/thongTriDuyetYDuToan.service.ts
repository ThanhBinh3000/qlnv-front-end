import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThongTriDuyetYDuToanService extends BaseService {
  GATEWAY = '/qlnv-khoach';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ThongTriDuyetYDuToan', '');
  }

  timKiem(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/von-thong-tri-duyet-y-du-toan/search`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  deleteData(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/von-thong-tri-duyet-y-du-toan/${id}`;
    return this.httpClient.delete(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/von-thong-tri-duyet-y-du-toan/delete/multiple`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: body
    }
    return this.httpClient.post(url, httpOptions).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/von-thong-tri-duyet-y-du-toan/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/von-thong-tri-duyet-y-du-toan//${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/von-thong-tri-duyet-y-du-toan`;
    return this.httpClient.post(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/von-thong-tri-duyet-y-du-toan`;
    return this.httpClient.put(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/von-thong-tri-duyet-y-du-toan/status`;
    return this.httpClient.put(url, body).toPromise();
  }
}
