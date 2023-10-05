import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class MmBbGiaoNhanService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bien-ban-giao-nhan','/qlnv-kho');
  }
}
