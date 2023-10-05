import { ResponseData } from '../../../../../interfaces/response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';
import { Observable } from 'rxjs';
import { TonKhoDauNamLuongThuc } from '../../../../../models/ThongTinChiTieuKHNam';

@Injectable({
  providedIn: 'root',
})
export class QuanLyPhieuKiemTraChatLuongHangService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ql-phieu-kiem-tra-chat-luong-hang-lt', '/qlnv-hang');
  }

  getSoLuongNhap(body: any) {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/so-luong-nhap-kho`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  timKiem(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-kiem-tra-chat-luong-hang-lt/tra-cuu`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  chiTiet(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-kiem-tra-chat-luong-hang-lt/${id}`
    return this.httpClient.get<any>(url).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-kiem-tra-chat-luong-hang-lt/them-moi`;
    return this.httpClient.post(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-kiem-tra-chat-luong-hang-lt`;
    return this.httpClient.put(url, body).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-kiem-tra-chat-luong-hang-lt/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  deleteData(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-kiem-tra-chat-luong-hang-lt/${id}`;
    return this.httpClient.delete(url).toPromise();
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-kiem-tra-chat-luong-hang-lt/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-kiem-tra-chat-luong-hang-lt/export/list`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
