import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MmHienTrangMmService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'hien-trang-may-moc-thiet-bi','/qlnv-kho');
  }

  chotDuLieu(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hien-trang-may-moc-thiet-bi/chot-du-lieu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
  hoanThanhKhoiTao(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hien-trang-may-moc-thiet-bi/hoan-thanh`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
}
