import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class BienBanNghiemThuTdscServiceService extends BaseService{

  GATEWAY = '/qlnv-kho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'tien-do-xdsc/sua-chua/bien-ban-nghiem-thu', '');
  }
}
