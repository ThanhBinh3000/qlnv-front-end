import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {PATH} from 'src/app/constants/path';
import {BaseService} from '../../../../base.service';
import {OldResponseData} from 'src/app/interfaces/response';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DeXuatKhBanTrucTiepService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.BAN_TRUC_TIEP + "/" + PATH.DX_KH_BTT, PATH.QLNV_HANG);
  }

  getSoLuongAdded(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/count-sl-kh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getDonGiaDuocDuyet(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/gia-duoc-duyet`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
