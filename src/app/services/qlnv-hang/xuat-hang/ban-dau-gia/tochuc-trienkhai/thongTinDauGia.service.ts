import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from "../../../../base.service";
import {PATH} from 'src/app/constants/path';
import {OldResponseData} from "../../../../../interfaces/response";
import {environment} from "../../../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ThongTinDauGiaService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.DAU_GIA + "/" + PATH.TTIN_DGIA, PATH.QLNV_HANG);
  }
  khoiTaoDuLieu(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/khoi-tao`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
  capNhatKhoiTao(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/cap-nhat-khoi-tao`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
  hoanThanhKhoiTao(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/hoan-thanh-khoi-tao`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
