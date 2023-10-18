import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../../base.service";
import { environment } from "src/environments/environment";
import { OldResponseData } from "src/app/interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class TongHopTieuHuyService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-tieu-huy/tong-hop', '/qlnv-hang');
  }

  getDsTaoHoSo(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-tong-hop-tao-hs`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
