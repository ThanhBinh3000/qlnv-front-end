import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { ResponseData } from '../../../../../interfaces/response';
import {
  ThongTinDeXuatKeHoachLuaChonNhaThau,
  ThongTinDeXuatKeHoachLuaChonNhaThauInput,
} from '../../../../../models/DeXuatKeHoachuaChonNhaThau';
import { BaseService } from '../../../../base.service';
import {BaseTestService} from "../../../../base-test.service";

@Injectable({
  providedIn: 'root',
})
export class TongHopDeXuatKHLCNTService extends BaseTestService {
  GATEWAY = '';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/thop-dlieu', '/qlnv-hang');
  }

  deXuatCuc(body: any): Promise<any> {
    const url = `${environment.SERVICE_API_LOCAL}${this.GATEWAY}/dx-kh/thop-dlieu/dx-cuc`
    return this.httpClient.post(url, body).toPromise();
  }

}
