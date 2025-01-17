import { Injectable } from '@angular/core';
import { BaseService } from "../../../base.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class QuyetDinhGiaoNhiemVuThanhLyService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-thanh-ly/qd-giao-nv-thanh-ly', '/qlnv-hang');
  }
}
