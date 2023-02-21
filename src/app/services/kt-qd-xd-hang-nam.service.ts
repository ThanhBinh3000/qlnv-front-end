import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class KtQdXdHangNamService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dt-tx-theo-nam/quyet-dinh','/qlnv-kho');
  }

  getAllPaTc(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dt-tx-theo-nam/quyet-dinh/list-tt`;
    return this.httpClient.get(url).toPromise();
  }
}