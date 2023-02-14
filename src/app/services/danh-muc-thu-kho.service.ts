import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {OldResponseData} from "../interfaces/response";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DanhMucThuKhoService extends BaseService{


  gateway: string = '/qlnv-category'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dmuc-thukho', '/qlnv-category');
  }

  deleteMulti(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/xoa/multiple`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
