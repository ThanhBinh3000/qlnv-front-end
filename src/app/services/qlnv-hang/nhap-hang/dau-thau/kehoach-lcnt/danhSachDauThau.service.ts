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
export class DanhSachDauThauService extends BaseService {
  GATEWAY = '/qlnv-hang';
  CONTROLLER = 'dx-kh/lcnt';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/lcnt', '/qlnv-hang');
  }

  getListDropdown(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/select-dropdown`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }


  deleteKeHoachLCNT(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/lcnt/xoa`;
    return this.httpClient.post(url, body).toPromise();
  }

}
