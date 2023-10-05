import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../base.service";

@Injectable({
  providedIn: 'root'
})
export class BienBanGiaoNhanPvcService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'pvc-bien-ban-giao-nhan','/qlnv-kho');
  }
}
