import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyDanhSachHangHongHocService extends BaseService {
  GATEWAY = '/qlnv-luukho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyDanhSachHangHongHoc', '');
  }

  search(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-hong-hoc/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
  searchDetail(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-hong-hoc/${id}`
    return this.httpClient.get(url).toPromise()
  }
  deteleData(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-hong-hoc/${id}`
    return this.httpClient.delete(url).toPromise();
  }
  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-hong-hoc/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }
  exportDetail(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-hong-hoc/export/listct`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-hong-hoc/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
  editData(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-hong-hoc`
    return this.httpClient.put(url, body).toPromise();
  }
  addNew(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/hang-hong-hoc`
    return this.httpClient.post<any>(url, body).toPromise();
  }

}
