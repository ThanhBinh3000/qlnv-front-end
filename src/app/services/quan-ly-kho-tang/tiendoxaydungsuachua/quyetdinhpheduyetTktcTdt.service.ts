import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../base.service';
import {environment} from 'src/environments/environment';
import {OldResponseData} from "../../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class QuyetdinhpheduyetTktcTdtService extends BaseService {
  GATEWAY = '/qlnv-kho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'quyetdinh-pd-tktc-tdt', '');
  }

  search(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
