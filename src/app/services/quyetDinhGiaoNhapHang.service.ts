import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhGiaoNhapHangService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuyetDinhGiaoNhapHang', '');
  }

  timKiem(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/nhap-xuat/tra-cuu`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  chiTiet(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/nhap-xuat/chi-tiet/${id}`
    return this.httpClient.get<any>(url).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/nhap-xuat/them-moi`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/nhap-xuat/cap-nhat`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  xoa(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/nhap-xuat/xoa`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/nhap-xuat/phe-duyet`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/nhap-xuat/ket-xuat`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

  getLoaiNhapXuat(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/nhap-xuat/loai-nhap-xuat`;
    return this.httpClient.get<any>(url).toPromise();
  }
  getCount(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/nhap-xuat/count`;
    return this.httpClient.get<any>(url).toPromise();
  }
  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/nhap-xuat/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }
}