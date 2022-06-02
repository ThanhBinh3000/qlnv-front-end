import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class dauThauGoiThauService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/ttin-dthau-gthau', '/qlnv-gateway/qlnv-hang');
  }

  timKiem(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/ttin-dthau-gthau/tra-cuu`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  chiTiet(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/ttin-dthau-gthau/chi-tiet/${id}`
    return this.httpClient.get<any>(url).toPromise();
  }

  chiTietByGoiThauId(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/ttin-dthau-gthau/chi-tiet/goi-thau/${id}`
    return this.httpClient.get<any>(url).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/ttin-dthau-gthau/phe-duyet`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  update(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/ttin-dthau-gthau/cap-nhat`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  create(body: any): Promise<any> {
    let url = `http://localhost:8099/dx-kh/ttin-dthau-gthau/them-moi`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  xoa(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/ttin-dthau-gthau/xoa`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/ttin-dthau-gthau/ket-xuat`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}