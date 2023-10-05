import { Injectable } from '@angular/core';
import {BaseService} from "../../../base.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {OldResponseData} from "../../../../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class HopDongThanhLyService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-thanh-ly/hop-dong', '/qlnv-hang');
  }

  searchDsTaoQdGiaoNvXh(body){
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-tao-qd-giao-nvxh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}

