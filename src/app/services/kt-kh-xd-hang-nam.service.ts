import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class KtKhXdHangNamService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dt-xd-theo-nam/de-xuat','/qlnv-kho');
  }
}
