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
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'DanhSachDauThau');
  }

  timKiem(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}/qlnv-gateway/qlnv-hang/dx-kh/lcnt-gao/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
  getChiTietDeXuatKeHoachLuaChonNhaThau(
    id: number,
  ): Promise<ResponseData<ThongTinDeXuatKeHoachLuaChonNhaThau>> {
    const url = `${environment.SERVICE_API}/qlnv-gateway/qlnv-hang/dx-kh/lcnt-gao/chi-tiet/${id}`;
    return this.httpClient
      .get<ResponseData<ThongTinDeXuatKeHoachLuaChonNhaThau>>(url)
      .toPromise();
  }
  suaThongTinKeHoachLCNT(
    thongTinDeXuatKeHoachLCNT: ThongTinDeXuatKeHoachLuaChonNhaThauInput,
  ): Promise<ResponseData<ThongTinDeXuatKeHoachLuaChonNhaThauInput>> {
    const url = `${environment.SERVICE_API}/qlnv-gateway/qlnv-hang/dx-kh/lcnt-gao/cap-nhat`;
    return this.httpClient
      .post<ResponseData<ThongTinDeXuatKeHoachLuaChonNhaThauInput>>(
        url,
        thongTinDeXuatKeHoachLCNT,
      )
      .toPromise();
  }
}
