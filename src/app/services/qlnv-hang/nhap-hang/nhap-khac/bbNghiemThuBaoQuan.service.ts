import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {OldResponseData} from "../../../../interfaces/response";
import {environment} from "../../../../../environments/environment";
import {BaseService} from "../../../base.service";

@Injectable({
  providedIn: 'root',
})
export class BbNghiemThuBaoQuanService extends BaseService {
  GATEWAY = '/qlnv-hang';
  CONTROLLER = 'nhap-khac/bb-nt';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'nhap-khac/bb-nt', '/qlnv-hang');
  }

  getDataKho(maDvi): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet/data-kho/${maDvi}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
}
