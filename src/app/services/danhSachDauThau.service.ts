import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
export class DanhSachDauThauService extends BaseService {
  GATEWAY = '/qlnv-hang';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/lcnt', '/qlnv-hang');
  }

  getChiTietDeXuatKeHoachLuaChonNhaThau(
    id: number,
  ): Promise<ResponseData<ThongTinDeXuatKeHoachLuaChonNhaThau>> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/lcnt/chi-tiet/${id}`;
    return this.httpClient
      .get<ResponseData<ThongTinDeXuatKeHoachLuaChonNhaThau>>(url)
      .toPromise();
  }
  suaThongTinKeHoachLCNT(
    thongTinDeXuatKeHoachLCNT: ThongTinDeXuatKeHoachLuaChonNhaThauInput,
  ): Promise<ResponseData<ThongTinDeXuatKeHoachLuaChonNhaThauInput>> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/lcnt/cap-nhat`;
    return this.httpClient
      .post<ResponseData<ThongTinDeXuatKeHoachLuaChonNhaThauInput>>(
        url,
        thongTinDeXuatKeHoachLCNT,
      )
      .toPromise();
  }
  themThongTinKeHoachLCNT(
    thongTinDeXuatKeHoachLCNT: ThongTinDeXuatKeHoachLuaChonNhaThauInput,
  ): Promise<ResponseData<ThongTinDeXuatKeHoachLuaChonNhaThauInput>> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/lcnt/them-moi`;
    return this.httpClient
      .post<ResponseData<ThongTinDeXuatKeHoachLuaChonNhaThauInput>>(
        url,
        thongTinDeXuatKeHoachLCNT,
      )
      .toPromise();
  }
  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/lcnt/phe-duyet`;
    return this.httpClient.post(url, body).toPromise();
  }
  deleteKeHoachLCNT(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/lcnt/xoa`;
    return this.httpClient.post(url, body).toPromise();
  }
  // export(body: any): Promise<any> {
  //   const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/lcnt/ket-xuat`;
  //   return this.httpClient.post<any>(url, body).toPromise();
  // }
  // export(body: any): Observable<Blob> {
  //   const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/lcnt/ket-xuat`;
  //   return this.httpClient.post(url, body, { responseType: 'blob' });
  // }
}
