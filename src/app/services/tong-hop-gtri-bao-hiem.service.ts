import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {HttpClient} from "@angular/common/http";
import {OldResponseData} from "../interfaces/response";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TongHopGtriBaoHiemService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'th-gia-tri-bao-hiem','/qlnv-kho');
  }

  getDetailCtiet(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/thong-tin-kho-hang-dtqg`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
}
