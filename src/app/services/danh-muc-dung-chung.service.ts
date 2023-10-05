import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class DanhMucDungChungService extends BaseService{

  gateway: string = '/qlnv-category'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dmuc-chung', '/qlnv-category');
  }

  danhMucChungGetAll(loai: string): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-chung/danh-sach/${loai}`;
    return this.httpClient.get<any>(url).toPromise();
  }

  xoa(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/xoa/${id}`;
    return this._httpClient.post<OldResponseData>(url, id).toPromise();
  }
}
