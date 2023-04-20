import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';
import { Observable } from 'rxjs';
import { OldResponseData } from "../../../../../interfaces/response";
import { BaseTestService } from 'src/app/services/base-test.service';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhPheDuyetKetQuaLCNTService extends BaseTestService {
  GATEWAY = '';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/qd-pduyet-kqlcnt', '');
  }


  getDetailBySoQd(body) {
    const url = `${environment.SERVICE_API_LOCAL}${this.GATEWAY}/${this.table}/chi-tiet/bySoQd`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
