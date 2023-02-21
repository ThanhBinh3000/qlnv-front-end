import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class MmDxChiCucService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'de-xuat-tbmm-tbcd','/qlnv-kho');
  }

  searchDsChuaSuDung(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach-danh-muc-tai-san-da-ban-hanh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  tongHopDxCc(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/cuc-th/tra-cuu-dx-chi-cuc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
