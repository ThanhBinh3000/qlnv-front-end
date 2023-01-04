import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class TheoDoiBqService extends BaseService{

  GATEWAY = '/qlnv-luukho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'theo-doi-bao-quan', '/qlnv-luukho');
  }

  export(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/export/list`;
    return this._httpClient.post(url, body, {responseType: 'blob'});
  }

  exportCt(id : number): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/export/listct/${id}`;
    return this._httpClient.get(url, {responseType: 'blob'});
  }

  delete(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/xoa/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  deleteMulti(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/delete/multiple`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
