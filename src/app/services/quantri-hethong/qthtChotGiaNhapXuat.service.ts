import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class QthtChotGiaNhapXuatService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'quan-tri-he-thong/chot-gia-nhap-xuat', '/qlnv-hang');
  }

  checkChotGia(body: any) {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/check-khoa-chot-dieu-chinh-gia`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  checkChotNhapXuat(body: any) {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/check-khoa-chot-dieu-nhap-xuat`
    return this.httpClient.post<any>(url, body).toPromise();
  }
}
