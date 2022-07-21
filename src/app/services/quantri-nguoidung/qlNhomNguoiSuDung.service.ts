import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';
import { OldResponseData } from 'src/app/interfaces/response';


@Injectable({
  providedIn: 'root',
})
export class QlNhomNguoiSuDungService extends BaseService {
  gateway: string = '/qlnv-system'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'user', '');
  }

  active(body) {
    const url = `${environment.SERVICE_API}${this.gateway}/nhom-nguoi-dung/active`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  create(body) {
    const url = `${environment.SERVICE_API}${this.gateway}/nhom-nguoi-dung/create`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  findAll() {
    const url = `${environment.SERVICE_API}${this.gateway}/nhom-nguoi-dung/findAll`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  delete(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/nhom-nguoi-dung/delete`;
    return this.httpClient.post<any>(url, body).toPromise();
  }


  update(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/nhom-nguoi-dung/update`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
  findId(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/nhom-nguoi-dung/find`;
    return this.httpClient.post<any>(url, body).toPromise();
  }


  findList(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/nhom-nguoi-dung/findList`;
    return this.httpClient.post<any>(url, body).toPromise();
  }



}
