import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import {OldResponseData} from "../interfaces/response";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HopdongPhulucHopdongService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'mua-truc-tiep/hd-mtt', '/qlnv-hang');
  }

  dsTaoQd(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu/ds-tao-qd`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
