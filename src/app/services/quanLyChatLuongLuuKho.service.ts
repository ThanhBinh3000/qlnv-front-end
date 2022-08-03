import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyChatLuongLuuKhoService extends BaseService {
  GATEWAY = '/qlnv-luukho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyChatLuongLuuKho', '');
  }

  traCuu(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/hang-thanh-ly/tra-cuu`;
    return this.httpClient.post<any>(url_, body).toPromise();
  }
}