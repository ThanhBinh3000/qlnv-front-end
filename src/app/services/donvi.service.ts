import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class DonviService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-category'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dmuc-donvi','/qlnv-gateway/qlnv-category');
  }

  layTatCaDonVi(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/danh-sach/hoat-dong`;
    return this.httpClient.get<any>(url).toPromise();
  }
  
  layTatCaDonViCha(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/danh-sach/dvi-cha`;
    return this.httpClient.get<any>(url).toPromise();
  }
  layDonViCon(): Promise<any> {
    const url = `${environment.SERVICE_API}/qlnv-gateway/qlnv-category/dmuc-donvi/ds-donvi-child`;
    return this.httpClient.get<any>(url).toPromise();
  }
  getDonVi(id: string): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/chi-tiet/${id}`;
    return this.httpClient.get<any>(url).toPromise();
  }
  loadDonViTinh(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-dvi-tinh/danh-sach/tat-ca`;
    return this.httpClient.get<any>(url).toPromise();
  }
  layDonViCon(body): Promise<any> {
    const url = `${environment.SERVICE_API}/qlnv-gateway/qlnv-category/dmuc-donvi/ds-donvi-child`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
}
