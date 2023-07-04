import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import {OldResponseData} from "../../interfaces/response";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class TongHopScService extends BaseService {
  gateway: string = '/qlnv-category'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'sua-chua/tong-hop', '/qlnv-hang');
  }

  getDanhSachTrinhThamDinh(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API_LOCAL}/${this.table}/ds-trinh-tham-dinh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
