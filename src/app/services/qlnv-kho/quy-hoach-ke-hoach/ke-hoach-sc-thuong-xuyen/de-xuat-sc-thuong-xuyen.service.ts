import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../base.service";
import {OldResponseData} from "../../../../interfaces/response";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DeXuatScThuongXuyenService extends BaseService {

  GATEWAY = '/qlnv-kho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kt-kh-sc-thuong-xuyen/de-xuat', '/qlnv-kho');
  }

}
