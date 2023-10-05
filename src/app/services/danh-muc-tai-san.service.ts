import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class DanhMucTaiSanService extends BaseService{

  gateway: string = '/qlnv-category'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dmuc-taisan', '/qlnv-category');
  }

  searchDsChuaSuDung(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach-chua-su-dung`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
