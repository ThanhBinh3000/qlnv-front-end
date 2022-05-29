import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLySoKhoService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLySoKho', '');
  }

  getList(body): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/business/so-kho/findList`
    return this.httpClient.post<any>(url_, body).toPromise();
  }
}