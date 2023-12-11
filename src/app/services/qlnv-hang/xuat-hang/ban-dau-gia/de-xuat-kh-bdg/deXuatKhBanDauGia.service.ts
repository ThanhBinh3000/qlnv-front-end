import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {PATH} from 'src/app/constants/path';
import {environment} from 'src/environments/environment';
import {OldResponseData} from '../../../../../interfaces/response';
import {BaseService} from '../../../../base.service';


@Injectable({
  providedIn: 'root'
})
export class DeXuatKhBanDauGiaService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.DAU_GIA + "/" + PATH.DX_KH_BDG, PATH.QLNV_HANG);
  }

  getSoLuongAdded(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/count-sl-kh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getDonGiaDuocDuyet(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/gia-duoc-duyet`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getGiaBanToiThieu(cloaiVthh: string, maDvi: string, namKhoach: string) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/gia-ban-toi-thieu/${cloaiVthh}/${maDvi}/${namKhoach}`;
    return this.httpClient.get<any>(url).toPromise();
  }
}
