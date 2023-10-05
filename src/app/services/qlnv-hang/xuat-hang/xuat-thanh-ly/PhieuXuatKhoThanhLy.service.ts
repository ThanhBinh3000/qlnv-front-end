import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {OldResponseData} from "../../../../interfaces/response";
import {environment} from "../../../../../environments/environment";
import {BaseService} from "../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class PhieuXuatKhoThanhLyService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-thanh-ly/phieu-xuat-kho', '/qlnv-hang');
  }

  getDanhSachTaoBangKe(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-bang-ke`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
