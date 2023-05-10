import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { BaseService } from "../base.service";
import { BaseTestService } from "../base-test.service";
import { OldResponseData } from "src/app/interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class BcBnTt145Service extends BaseTestService {
  GATEWAY = '';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'tt-btc-145-bn', '');
  }

  bcThopNhapXuatHangDtqg(body) {
    const url = `${environment.SERVICE_API_LOCAL}${this.GATEWAY}/${this.table}/tra-cuu`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
  bcThopNhapXuatHangDtqgGetDetail(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API_LOCAL}${this.GATEWAY}/${this.table}/chi-tiet/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
  ketXuat(body) {
    const url = `${environment.SERVICE_API_LOCAL}${this.GATEWAY}/${this.table}/ket-xuat`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
}