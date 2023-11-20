import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OldResponseData } from '../interfaces/response';
import { Observable } from 'rxjs';

export abstract class BaseService {
  table = '';
  _httpClient: HttpClient;
  GATEWAY = ''

  constructor(httpClient: HttpClient, controller: string, GATEWAY: string) {
    this.table = controller;
    this._httpClient = httpClient;
    this.GATEWAY = GATEWAY;
  }

  getAll(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tat-ca`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getTreeAll(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tat-ca-tree`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  create(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/them-moi`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  update(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/cap-nhat`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  approve(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/phe-duyet`
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getDetail(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  delete(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/xoa`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  search(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  timTheoMa(ma): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/TimTheoMa?ma=${ma}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  export(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }

  deleteMuti(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/xoa/multi`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  preview(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/xem-truoc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
  danhSach(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
  downloadTemplate(tenFile) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/report-template/findByTenFileAndTrangThai/${tenFile}`;
    return this._httpClient.get(url, { responseType: 'blob' }).toPromise();
  }
  importExcel(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/bc-dtqg-bn/tt-130/import-du-lieu`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
