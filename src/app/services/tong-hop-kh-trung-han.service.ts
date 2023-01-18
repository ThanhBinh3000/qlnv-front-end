import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TongHopKhTrungHanService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dt-tx-trung-han/tong-hop','/qlnv-kho');
  }

  tongHop(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dt-tx-trung-han/tong-hop/danh-sach-dx`;
    return this.httpClient.post(url, body).toPromise();
  }
}
