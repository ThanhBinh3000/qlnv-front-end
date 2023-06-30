import { BaseService } from "../../../base.service";
import { HttpClient } from "@angular/common/http";
import { OldResponseData } from "../../../../interfaces/response";
import { environment } from "../../../../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class TongHopDxKhNhapKhacService extends BaseService {
  GATEWAY = '/qlnv-hang';
  CONTROLLER = 'nhap-khac/thop-kh-nk';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'nhap-khac/thop-kh-nk', '/qlnv-hang');
  }

  dsDxDuocTaoQDinhPDuyet(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/dx-chua-th`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  dsThDuocTaoQDinhPduyet(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-th-chua-tao-qd`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
}
