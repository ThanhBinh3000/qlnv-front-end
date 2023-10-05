import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class BienBanHaoDoiThanhLyService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-thanh-ly/bien-ban-hao-doi', '/qlnv-hang');
  }

}
