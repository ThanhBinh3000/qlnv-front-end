import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../../base.service";
import { environment } from "../../../../../environments/environment";
import { OldResponseData } from "../../../../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class TienDoCongViecTdscService extends BaseService {
  GATEWAY = '/qlnv-kho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'tien-do-xdsc/sua-chua/tien-do-cong-viec', '');
  }

  hoanThanh(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/hoan-thanh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
