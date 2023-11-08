import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class UserAPIService extends BaseService {
  GATEWAY = '/qlnv-security';
  ROUTER = 'user-info'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'user-info', '');
  }

  getPermission(): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/${this.ROUTER}/permission`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  getDvql(): Promise<any> {
    const url_ = `${environment.SERVICE_API}/qlnv-category/dmuc-donvi/dvql`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  logout(): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/${this.ROUTER}/logout`;
    return this.httpClient.post<any>(url_, {}).toPromise();
  }
}
