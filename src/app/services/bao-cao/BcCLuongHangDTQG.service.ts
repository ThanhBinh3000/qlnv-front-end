import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../base.service";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class BcCLuongHangDTQGService extends BaseService {
  GATEWAY = '/qlnv-report';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bc-cl-hang-dtqg', '');
  }

  baoCaoSLuongCLuongCcdc(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-sl-cl-ccdc`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  baoCaoSLuongCLuongMmTbcd(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-sl-cl-mm-tbcd`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

}
