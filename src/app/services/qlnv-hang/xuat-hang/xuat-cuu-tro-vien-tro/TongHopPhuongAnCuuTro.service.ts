import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../base.service";
import { environment } from "../../../../../environments/environment";
import { OldResponseData } from "../../../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class TongHopPhuongAnCuuTroService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'cuu-tro/tong-hop', '');
  }
  syntheic(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/dieu-chinh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  tonghop(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}`
    return this.httpClient.post(url, body).toPromise();
  }
  danhSach(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
