import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OldResponseData } from '../interfaces/response';

export abstract class BaseService {
  table = '';
  _httpClient: HttpClient;
  constructor(httpClient: HttpClient, tableName: string) {
    this.table = tableName;
    this._httpClient = httpClient;
  }

  layTatca(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/${this.table}/LayTatca`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  create(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/${this.table}/ThemMoi`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  update(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/${this.table}/CapNhatThongTin`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getDetail(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/${this.table}/TimTheoId/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  delete(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/${this.table}/Xoa/${id}`;
    return this._httpClient.post<OldResponseData>(url, {}).toPromise();
  }

  timTheoDieuKien(body) {
    const url = `${environment.SERVICE_API}api/${this.table}/TimTheoDieuKien`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  timTheoMa(ma): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/${this.table}/TimTheoMa?ma=${ma}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
}
