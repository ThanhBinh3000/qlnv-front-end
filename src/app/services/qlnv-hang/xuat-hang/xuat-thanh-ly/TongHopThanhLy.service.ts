import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../../base.service";
import { OldResponseData } from "src/app/interfaces/response";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TongHopThanhLyService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-thanh-ly/tong-hop', '/qlnv-hang');
  }

  getDanhSachTrinhThamDinh(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-trinh-tham-dinh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
