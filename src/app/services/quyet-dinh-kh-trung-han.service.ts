import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {OldResponseData} from "../interfaces/response";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class QuyetDinhKhTrungHanService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dt-xd-trung-han/quyet-dinh','/qlnv-kho');
  }

  getListToTrinh(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/list-tt`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  getListQd(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach-qd`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
}
