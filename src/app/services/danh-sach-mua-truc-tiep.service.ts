
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OldResponseData } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class DanhSachMuaTrucTiepService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient
  ) {
    super(httpClient, 'mua-truc-tiep/dx-kh-mtt', '/qlnv-hang');
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/mua-truc-tiep/dx-kh-mtt/phe-duyet`;
    return this.httpClient.post(url, body).toPromise();
  }

  getSoLuongAdded(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/count-sl-kh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}

