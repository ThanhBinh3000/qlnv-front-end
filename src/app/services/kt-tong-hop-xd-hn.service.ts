import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class KtTongHopXdHnService extends BaseService{
  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dt-xd-theo-nam/tong-hop','/qlnv-kho');
  }

  tongHop(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dt-xd-theo-nam/tong-hop/danh-sach-dx`;
    return this.httpClient.post(url, body).toPromise();
  }

  exportDetail(body: any) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat-detail`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }
}
