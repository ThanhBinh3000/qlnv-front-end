import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {OldResponseData} from "../interfaces/response";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class QuyetDinhMuaSamService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'quyet-dinh-mua-sam','/qlnv-kho');
  }

  listTtPbo(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet-tt-phan-bo`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  exportDetail(body: any) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat-detail`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }
  exportDetailTtPhanBo(body: any) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat-detail-tt-phanbo`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }
}
