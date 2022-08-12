import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class QuanLyHangTrongKhoService extends BaseService {
  GATEWAY = '/qlnv-luukho';
  constructor(private httpClient: HttpClient) {
    super(httpClient, 'QuanLySoKhoTheKho', '');
  }
  search(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-trong-kho`;
    return this.httpClient.get(url).toPromise();
  }
  searchDetail(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-trong-kho/detail`;
    return this.httpClient.post(url, body).toPromise();
  }
  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-trong-kho/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
  exportDetail(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-trong-kho/export/detail`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

}
