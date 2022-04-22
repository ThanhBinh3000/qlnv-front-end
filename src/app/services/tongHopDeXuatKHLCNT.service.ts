import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseData } from '../interfaces/response';
import {
  ThongTinDeXuatKeHoachLuaChonNhaThau,
  ThongTinDeXuatKeHoachLuaChonNhaThauInput,
} from '../models/DeXuatKeHoachuaChonNhaThau';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class TongHopDeXuatKHLCNTService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'TongHopDeXuatKHLCNT');
  }

  timKiem(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/thop-dlieu/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/thop-dlieu/chi-tiet/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  dsChuaTongHop(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/thop-dlieu/tra-cuu/ds-chua-th`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  deXuatCuc(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/thop-dlieu/dx-cuc`
    return this.httpClient.post(url, body).toPromise();
  }

  them(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/thop-dlieu/them-moi`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  sua(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/thop-dlieu/cap-nhat`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  xoa(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/thop-dlieu/xoa`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/thop-dlieu/ket-xuat`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
