import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';
import { OldResponseData } from 'src/app/interfaces/response';


@Injectable({
  providedIn: 'root',
})
export class QlNguoiSuDungService extends BaseService {
  gateway: string = '/qlnv-gateway/qlnv-system'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'user');
  }

  findList(body) {
    const url = `${environment.SERVICE_API}${this.gateway}/user/findList`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  create(body) {
    const url = `${environment.SERVICE_API}${this.gateway}/user/create`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  activequyen(body) {
    const url = `${environment.SERVICE_API}${this.gateway}/user/active-quyen`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  delete(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/user/delete`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  update(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/user/update`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
  updateStatus(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/user/updateStatus`;
    return this.httpClient.post<any>(url, body).toPromise();
  }


  userInfo(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/user/userInfo`;
    return this.httpClient.post<any>(url, body).toPromise();
  }


  xoaquyen(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/user/xoa-quyen`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

}
