import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../base.service";
import {OldResponseData} from "../../../../interfaces/response";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DeXuatScLonService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kt-kh-sc-lon/de-xuat','/qlnv-kho');
  }

  tongHop(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-kh-sc-lon/tra-cuu-dx-cuc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
