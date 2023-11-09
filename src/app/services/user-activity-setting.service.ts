import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from "../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class UserActivitySettingService extends BaseService {

  gateway: string = '/qlnv-system'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'lich-su-truy-cap-setting', '/qlnv-system');
  }

  cauHinhHeThong(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/save`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getCauHinhHeThong(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/get-setting`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
