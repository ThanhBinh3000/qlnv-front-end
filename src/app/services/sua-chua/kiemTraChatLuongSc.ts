import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import {OldResponseData} from "../../interfaces/response";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class KiemTraChatLuongScService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'sua-chua/kt-cl', '/qlnv-hang');
  }

  getDanhSachTaoQdNh(body): Promise<OldResponseData>{
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-tao-qd-nh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
