import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { OldResponseData } from "../../../../interfaces/response";
import { environment } from "../../../../../environments/environment";
import { BaseService } from "../../../base.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TongHopDxScLonService extends BaseService {

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kt-kh-sc-lon/tong-hop','/qlnv-kho');
  }

  tongHop(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-kh-sc-lon/tong-hop/danh-sach-dx`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getListThTaoQdGiaoNv(body){
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-kh-sc-lon/tong-hop/ds-tao-qd-gnv`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  exportDetail(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat/detail`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }

}
