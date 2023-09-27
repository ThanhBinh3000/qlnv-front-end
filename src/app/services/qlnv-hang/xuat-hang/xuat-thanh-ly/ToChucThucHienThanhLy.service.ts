import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../base.service";
import {OldResponseData} from "../../../../interfaces/response";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ToChucThucHienThanhLyService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-thanh-ly/to-chuc-thuc-hien', '');
  }

  getDsTaoQuyetDinhPdKq(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-tao-qd-pd-kq`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }


}
