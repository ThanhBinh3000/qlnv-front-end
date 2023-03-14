import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../base.service";

@Injectable({
  providedIn: 'root'
})
export class DxChiCucPvcService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'pvc-de-xuat-ccdc','/qlnv-kho');
  }
}
