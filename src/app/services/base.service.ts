import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OldResponseData } from '../interfaces/response';

export abstract class BaseService {
  table = '';
  _httpClient: HttpClient;
  GATEWAY = ''
  constructor(httpClient: HttpClient, tableName: string, GATEWAY: string) {
    this.table = tableName;
    this._httpClient = httpClient;
    this.GATEWAY = GATEWAY;
  }

  getAll(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tat-ca`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  create(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/them-moi`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  update(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/cap-nhat`;
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
}
