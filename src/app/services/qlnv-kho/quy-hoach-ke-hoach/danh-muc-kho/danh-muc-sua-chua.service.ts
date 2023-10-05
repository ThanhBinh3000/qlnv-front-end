import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class DanhMucSuaChuaService extends BaseService{

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'danh-muc-sua-chua', '/qlnv-kho');
  }
}
