import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';
import { Observable } from 'rxjs';
import {OldResponseData} from "../../../../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhPheDuyetKetQuaLCNTService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/qd-pduyet-kqlcnt', '/qlnv-hang');
  }


  getDetailBySoQd(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet/bySoQd`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  exportHd(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat/hop-dong`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }
}
