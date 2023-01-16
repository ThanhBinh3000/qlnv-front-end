import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class DanhMucKhoService extends BaseService{

  gateway: string = '/qlnv-kho'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'danh-muc-kho', '/qlnv-kho');
  }
}
