import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class DonviService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'Donvi');
  }

  layTatCaDonVi(): Promise<any> {
    const url = `${environment.SERVICE_API}/qlnv-gateway/qlnv-category/dmuc-donvi/danh-sach/tat-ca`;
    return this.httpClient.get<any>(url).toPromise();
  }
  loadDonViTinh(): Promise<any> {
    const url = `${environment.SERVICE_API}/qlnv-gateway/qlnv-category/dmuc-dvi-tinh/danh-sach/tat-ca`;
    return this.httpClient.get<any>(url).toPromise();
  }
}
