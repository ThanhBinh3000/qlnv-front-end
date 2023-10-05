import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyChatLuongLuuKhoService extends BaseService {
  GATEWAY = '/qlnv-luukho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'hang-thanh-ly', '');
  }

  suads(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-thanh-ly/cap-nhat`;
    return this.httpClient.post<any>(url_, body).toPromise();
  }

  traCuuHTL(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-thanh-ly/tra-cuu`;
    return this.httpClient.post<any>(url_, body).toPromise();
  }

  pheDuyet(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-thanh-ly/phe-duyet`;
    return this.httpClient.put<any>(url_, body).toPromise();
  }

  themds(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-thanh-ly/them-moi`;
    return this.httpClient.post<any>(url_, body).toPromise();
  }

  xoads(id: any): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-thanh-ly/xoa/${id}`;
    return this.httpClient.delete<any>(url_).toPromise();
  }

  xoalstds(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-thanh-ly/delete/multiple`;
    return this.httpClient.post<any>(url_, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-thanh-ly/export/list`;
    return this.httpClient.post(url_, body, { responseType: 'blob' });
  }

  exportListDetail(id: number): Observable<Blob> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-thanh-ly/export/listct/${id}`;
    return this.httpClient.get(url_, { responseType: 'blob' });
  }

  detail(id: any): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-thanh-ly/chi-tiet/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  // hang tieu huy

  hangTieuHuyThemds(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-tieu-huy`;
    return this.httpClient.post<any>(url_, body).toPromise();
  }

  hangTieuHuySuads(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-tieu-huy`;
    return this.httpClient.put<any>(url_, body).toPromise();
  }

  hangTieuHuytraCuu(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-tieu-huy/tra-cuu`;
    return this.httpClient.post<any>(url_, body).toPromise();
  }

  hangTieuHuyXoads(id: any): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-tieu-huy/${id}`;
    return this.httpClient.delete<any>(url_).toPromise();
  }

  hangTieuHuyXoalstds(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-tieu-huy/delete/multiple`;
    return this.httpClient.post<any>(url_, body).toPromise();
  }

  hangTieuHuyExportList(body: any): Observable<Blob> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-tieu-huy/export/list`;
    return this.httpClient.post(url_, body, { responseType: 'blob' });
  }

  hangTieuHuyexportListDetail(body: any): Observable<Blob> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-tieu-huy/export/listct`;
    return this.httpClient.post(url_, body, { responseType: 'blob' });
  }

  hangTieuHuyDetail(id: any): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-tieu-huy/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }
}
