import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {OldResponseData} from "../../interfaces/response";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DanhSachSuaChuaService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'sua-chua/danh-sach', '');
  }

  getDetailDs(body): Promise<OldResponseData>{
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet-kho-sc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getDsTaoBienBanKetThuc(body): Promise<OldResponseData>{
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-tao-bb-kt`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
