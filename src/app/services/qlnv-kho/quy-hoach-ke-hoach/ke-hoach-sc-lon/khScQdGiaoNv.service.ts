import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../../base.service";
import {environment} from "../../../../../environments/environment";
import {OldResponseData} from "../../../../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class KhScQdGiaoNvService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kt-kh-sc-lon/quyet-dinh-giao-nv','/qlnv-kho');
  }

  getListTaoBtcTcdt(body){
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-kh-sc-lon/quyet-dinh-giao-nv/ds-tao-qd`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getListTaoDc(body){
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-kh-sc-lon/quyet-dinh-giao-nv/ds-tao-dc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }


}
