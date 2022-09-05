import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';
import { OldResponseData } from 'src/app/interfaces/response';


@Injectable({
  providedIn: 'root',
})
export class QlQuyenNSDService extends BaseService {
  gateway: string = '/qlnv-system'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'permission', '/qlnv-system');
  }

  // active(body) {
  //   const url = `${environment.SERVICE_API}${this.gateway}/quyen/active`;
  //   return this.httpClient.post<any>(url, body).toPromise();
  // }

  // create(body) {
  //   const url = `${environment.SERVICE_API}${this.gateway}/quyen/create`;
  //   return this.httpClient.post<any>(url, body).toPromise();
  // }

  // dsquyenbyuser(body) {
  //   const url = `${environment.SERVICE_API}${this.gateway}/quyen/ds-quyen-by-user`;
  //   return this.httpClient.post<any>(url, body).toPromise();
  // }

  // delete(body: any) {
  //   const url = `${environment.SERVICE_API}${this.gateway}/user/delete`;
  //   return this.httpClient.post<any>(url, body).toPromise();
  // }

  // find(body: any) {
  //   const url = `${environment.SERVICE_API}${this.gateway}/quyen/find`;
  //   return this.httpClient.post<any>(url, body).toPromise();
  // }
  // update(body: any) {
  //   const url = `${environment.SERVICE_API}${this.gateway}/quyen/update`;
  //   return this.httpClient.post<any>(url, body).toPromise();
  // }


  // dsquyen() {
  //   const url = `${environment.SERVICE_API}${this.gateway}/quyen/ds-quyen`;
  //   return this.httpClient.get<any>(url).toPromise();
  // }

}
