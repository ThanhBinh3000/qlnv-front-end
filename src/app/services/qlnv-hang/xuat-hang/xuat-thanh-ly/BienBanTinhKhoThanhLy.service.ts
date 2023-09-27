import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class BienBanTinhKhoThanhLyService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-thanh-ly/bien-ban-tinh-kho', '');
  }

}
