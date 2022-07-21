import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';
import { OldResponseData } from 'src/app/interfaces/response';


@Injectable({
  providedIn: 'root',
})
export class QlTShethongService extends BaseService {
  gateway: string = '/qlnv-system'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'user', '');
  }

  active(body) {
    const url = `${environment.SERVICE_API}${this.gateway}/sysparam/active`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  create(body) {
    const url = `${environment.SERVICE_API}${this.gateway}/sysparam/create`;
    return this.httpClient.post<any>(url, body).toPromise();
  }


  delete(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/sysparam/delete`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  find(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/sysparam/find`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  findList(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/sysparam/findList`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
  update(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/sysparam/update`;
    return this.httpClient.post<any>(url, body).toPromise();
  }





}
