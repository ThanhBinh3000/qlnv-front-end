import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { environment } from "../../../environments/environment";
import { OldResponseData } from "../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class PhieuXuatKhoScService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'sua-chua/phieu-xuat-kho', '/qlnv-hang');
  }

  getDanhSachTaoBangKe(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-bang-ke`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getDanhSachKiemTraCl(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-kiem-tra-cl`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
