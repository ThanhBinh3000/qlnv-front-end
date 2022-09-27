import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class QuyHoachKhoService extends BaseService{

  // gateway: string = '/qlnv-kho'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kt-quy-hoach-kho/qd-quy-hoach', '');
  }

  danhSachQdGoc() {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/qd-goc`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }


}
