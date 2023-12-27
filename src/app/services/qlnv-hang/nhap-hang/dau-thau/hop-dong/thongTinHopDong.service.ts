import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';
import { Observable } from 'rxjs';
import {OldResponseData} from "../../../../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class ThongTinHopDongService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/hop-dong', '/qlnv-hang');
  }


  searchDsQdGiaoNvNh(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-qd-giao-nv-nh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  // timKiem(body: any): Promise<any> {
  //   let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/hop-dong/tra-cuu`
  //   return this.httpClient.post<any>(url, body).toPromise();
  // }
  //
  // loadChiTiet(id: number): Promise<any> {
  //   const url_ = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/hop-dong/chi-tiet/${id}`;
  //   return this.httpClient.get<any>(url_).toPromise();
  // }
  //
  loadChiTietSoHopDong(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/hop-dong/chi-tiet/so-hd`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
  //
  // them(body: any): Promise<any> {
  //   const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/hop-dong/them-moi`;
  //   return this.httpClient.post<any>(url, body).toPromise();
  // }
  //
  // sua(body: any): Promise<any> {
  //   const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/hop-dong/cap-nhat`;
  //   return this.httpClient.post<any>(url, body).toPromise();
  // }
  //
  // xoa(body: any): Promise<any> {
  //   const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/hop-dong/xoa`;
  //   return this.httpClient.post<any>(url, body).toPromise();
  // }
  saveSoTienTinhPhat(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tinh-tien-phat`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
}
