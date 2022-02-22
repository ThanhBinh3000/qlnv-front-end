import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})

export class NhomQuyenService extends BaseService{
  constructor(
    public httpClient: HttpClient
  ) {
    super(httpClient, "DmQuyen");
  }

  capNhatHanhDong(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DmQuyen/CapNhatHanhDong`;
    return this.httpClient.post<OldResponseData>(url, body).toPromise();
  }

  capNhatChucNang(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DmQuyen/CapNhatChucNang`;
    return this.httpClient.post<OldResponseData>(url, body).toPromise();
  }

  layTatCaChucNangUser(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DmQuyen/LayTatCaChucNangUser`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  layQuyenChucNangUser(controller): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DmQuyen/LayQuyenChucNangUser?controller=${controller}`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

}