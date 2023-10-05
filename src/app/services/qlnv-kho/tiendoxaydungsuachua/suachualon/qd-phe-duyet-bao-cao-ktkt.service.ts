import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../../../environments/environment";
import {OldResponseData} from "../../../../interfaces/response";
import {BaseService} from "../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class QdPheDuyetBaoCaoKtktService extends BaseService{

  GATEWAY = '/qlnv-kho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'tien-do-xdsc/sua-chua/quyetdinh-pd-bc-ktkt', '');
  }

  search(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
