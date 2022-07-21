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
export class DxuatKhLcntVatTuService extends BaseService {
  GATEWAY = '/qlnv-hang';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/lcnt/vat-tu', '/qlnv-hang');
  }

  getChiTietDeXuatKeHoachLuaChonNhaThau(
    id: number,
  ): Promise<ResponseData<ThongTinDeXuatKeHoachLuaChonNhaThau>> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/lcnt/chi-tiet/${id}`;
    return this.httpClient
      .get<ResponseData<ThongTinDeXuatKeHoachLuaChonNhaThau>>(url)
      .toPromise();
  }
}
