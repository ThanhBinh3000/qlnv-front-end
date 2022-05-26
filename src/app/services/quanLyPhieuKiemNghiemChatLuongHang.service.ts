import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuanLyPhieuKiemNghiemChatLuongHangService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyPhieuKiemNghiemChatLuongHang', '');
  }

  timKiem(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/tra-cuu`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/them-moi`;
    return this.httpClient.post(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/cap-nhat`;
    return this.httpClient.put(url, body).toPromise();
  }
  xoa(id: number): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/xoa`;
    return this.httpClient.delete(`${url}/${id}`).toPromise();
  }
  chiTiet(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/chi-tiet`;
    return this.httpClient.put(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/knghiem-cluong/phe-duyet`;
    return this.httpClient.put(url, body).toPromise();
  }
}
