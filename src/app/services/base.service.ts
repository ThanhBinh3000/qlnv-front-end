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

  exportReport(body: any): Observable<Blob> {
    const url = `http://192.168.5.184:3333/nhap-xuat-ton/bao-cao-chi-tiet`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }

  deleteMuti(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/xoa/multi`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
