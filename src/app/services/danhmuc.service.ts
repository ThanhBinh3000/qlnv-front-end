import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class DanhMucService extends BaseService {
  gateway: string = '/qlnv-gateway/qlnv-category'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'DanhMuc');
  }

  loadDanhMucHangHoa() {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-hang/danh-sach`;
    return this.httpClient.post<any>(url, null);
  }

  phuongThucDauThauGetAll(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-chung/danh-sach/PT_DTHAU`;
    return this.httpClient.get<any>(url).toPromise();
  }

  nguonVonGetAll(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-chung/danh-sach/NGUON_VON`;
    return this.httpClient.get<any>(url).toPromise();
  }

  hinhThucDauThauGetAll(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-chung/danh-sach/HT_LCNT`;
    return this.httpClient.get<any>(url).toPromise();
  }

  loaiHopDongGetAll(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-chung/danh-sach/LOAI_HDONG`;
    return this.httpClient.get<any>(url).toPromise();
  }

  danhMucDonViGetAll(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-donvi/danh-sach/tat-ca`;
    return this.httpClient.get<any>(url).toPromise();
  }
}
