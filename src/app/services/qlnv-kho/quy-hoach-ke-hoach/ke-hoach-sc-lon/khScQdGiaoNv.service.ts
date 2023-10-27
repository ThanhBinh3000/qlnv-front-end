import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class HhScQdGiaoNvService extends BaseService {

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kt-kh-sc-lon/quyet-dinh-giao-nv','/qlnv-kho');
  }

}