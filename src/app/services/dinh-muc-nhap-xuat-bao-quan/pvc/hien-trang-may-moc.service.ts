import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {BaseService} from "../../base.service";

@Injectable({
  providedIn: 'root'
})
export class HienTrangMayMocService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'hien-trang-cong-cu-dung-cu','/qlnv-kho');
  }

  chotDuLieu(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hien-trang-cong-cu-dung-cu/chot-du-lieu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
  hoanThanhKhoiTao(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hien-trang-cong-cu-dung-cu/hoan-thanh`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
}
