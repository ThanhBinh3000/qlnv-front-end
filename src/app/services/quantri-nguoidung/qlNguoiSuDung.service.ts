import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';


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


}
