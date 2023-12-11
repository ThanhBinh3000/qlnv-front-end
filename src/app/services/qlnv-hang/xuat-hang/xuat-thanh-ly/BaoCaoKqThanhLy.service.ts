import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class BaoCaoKqThanhLyService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-thanh-ly/bao-cao-ket-qua', '/qlnv-hang');
  }
}
