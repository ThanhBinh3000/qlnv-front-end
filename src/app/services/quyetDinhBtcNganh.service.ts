
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhBtcNganhService extends BaseService {

  gateway: string = '/qlnv-khoach'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'giao-chi-tieu-von-dau-nam/quyet-dinh/btc-nganh', '/qlnv-khoach');
  }

  preview(body) {
    const url = `${environment.SERVICE_API_LOCAL}/${this.table}/xem-truoc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
