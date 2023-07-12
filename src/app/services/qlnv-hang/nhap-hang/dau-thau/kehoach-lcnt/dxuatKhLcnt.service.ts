import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { OldResponseData, ResponseData } from '../../../../../interfaces/response';
import {
  ThongTinDeXuatKeHoachLuaChonNhaThau
} from '../../../../../models/DeXuatKeHoachuaChonNhaThau';
import { BaseService } from '../../../../base.service';
import {BaseLocalService} from "../../../../base-local.service";

@Injectable({
  providedIn: 'root',
})
export class DxuatKhLcntService extends BaseLocalService {
  GATEWAY = '';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/lcnt', '');
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
    const url = `${environment.SERVICE_API_LOCAL}${this.GATEWAY}/${this.table}/count-sl-kh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getGiaBanToiDa(cloaiVthh: string, maDvi: string, namKhoach: string) {
    const url = `${environment.SERVICE_API_LOCAL}${this.GATEWAY}/${this.table}/gia-ban-toi-da/${cloaiVthh}/${maDvi}/${namKhoach}`;
    return this.httpClient.get<any>(url).toPromise();
  }
}
