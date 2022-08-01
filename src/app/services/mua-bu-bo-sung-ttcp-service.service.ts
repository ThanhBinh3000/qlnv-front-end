import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MuaBuBoSungTtcpServiceService extends BaseService{


  gateway: string = '/qlnv-khoach'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'giao-ke-hoach-mua-bu-bo-sung/quyet-dinh/ttcp', '/qlnv-khoach');
  }

  deleteAll(body): Promise<any> {
    const url = `${environment.SERVICE_API}/qlnv-khoach/giao-ke-hoach-mua-bu-bo-sung/quyet-dinh/ttcp/xoa/multi`;
    return this._httpClient.post<any>(url, body).toPromise();
  }
}
