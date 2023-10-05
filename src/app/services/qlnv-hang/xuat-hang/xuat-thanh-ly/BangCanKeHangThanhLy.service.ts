import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class BangCanKeHangThanhLyService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-thanh-ly/bang-ke-can-hang', '/qlnv-hang');
  }

}
