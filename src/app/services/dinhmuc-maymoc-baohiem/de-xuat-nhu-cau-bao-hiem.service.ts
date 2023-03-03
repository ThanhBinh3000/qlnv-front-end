import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";

@Injectable({
  providedIn: 'root'
})
export class DeXuatNhuCauBaoHiemService extends BaseService{

  GATEWAY = '/qlnv-kho'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'de-xuat-bao-hiem', '/qlnv-kho');
  }
}
