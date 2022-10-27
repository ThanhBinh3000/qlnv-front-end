import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { OldResponseData, ResponseData } from '../../../../../interfaces/response';
import {
  ThongTinDeXuatKeHoachLuaChonNhaThau,
  ThongTinDeXuatKeHoachLuaChonNhaThauInput,
} from '../../../../../models/DeXuatKeHoachuaChonNhaThau';
import { BaseService } from '../../../../base.service';

@Injectable({
  providedIn: 'root',
})
export class DxuatKhLcntService extends BaseService {
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

  getSoLuongAdded(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/count-sl-kh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
