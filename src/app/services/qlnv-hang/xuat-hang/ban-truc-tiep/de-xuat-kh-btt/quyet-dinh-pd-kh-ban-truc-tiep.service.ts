import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from 'src/app/services/base.service';
import {OldResponseData} from 'src/app/interfaces/response';
import {environment} from 'src/environments/environment';
import {PATH} from 'src/app/constants/path';

@Injectable({
  providedIn: 'root'
})
export class QuyetDinhPdKhBanTrucTiepService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.BAN_TRUC_TIEP + "/" + PATH.QD_PD_BTT, PATH.QLNV_HANG);
  }

  getDtlDetail(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/dtl-chi-tiet/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  getDonGiaDuocDuyet(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/gia-duoc-duyet`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
