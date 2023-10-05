
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';
import { PATH } from 'src/app/constants/path';

@Injectable({
  providedIn: 'root'
})
export class TongHopDeXuatKeHoachBanDauGiaService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.DAU_GIA + "/" + PATH.TH_KH_BDG, PATH.QLNV_HANG);
  }

  tonghop(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}`
    return this.httpClient.post(url, body).toPromise();
  }
}
