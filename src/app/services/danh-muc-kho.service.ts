import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {OldResponseData} from "../interfaces/response";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DanhMucKhoService extends BaseService{

  gateway: string = '/qlnv-kho'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'danh-muc-kho', '/qlnv-kho');
  }

  getAllDmKho(type): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach/${type}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }


}
