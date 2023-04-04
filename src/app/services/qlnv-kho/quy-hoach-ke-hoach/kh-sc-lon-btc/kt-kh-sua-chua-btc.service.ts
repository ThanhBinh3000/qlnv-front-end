import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class KtKhSuaChuaBtcService extends BaseService{


  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kt-kh-sc-btc/de-xuat','/qlnv-kho');
  }
}
