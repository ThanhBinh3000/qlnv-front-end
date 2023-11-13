
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OldResponseData } from '../interfaces/response';
import {BaseLocalService} from "./base-local.service";

@Injectable({
  providedIn: 'root'
})
export class DanhSachMuaTrucTiepService extends BaseLocalService {
  GATEWAY = '';

  constructor(public httpClient: HttpClient
  ) {
    super(httpClient, 'mua-truc-tiep/dx-kh-mtt', '');
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API_LOCAL}${this.GATEWAY}/mua-truc-tiep/dx-kh-mtt/phe-duyet`;
    return this.httpClient.post(url, body).toPromise();
  }

  getSoLuongAdded(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API_LOCAL}${this.GATEWAY}/${this.table}/count-sl-kh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}

