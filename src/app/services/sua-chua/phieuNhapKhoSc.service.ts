import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { environment } from "../../../environments/environment";
import { OldResponseData } from "../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class PhieuNhapKhoScService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'sua-chua/phieu-nhap-kho', '/qlnv-hang');
  }

  getDanhSachTaoBangKe(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-bang-ke`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
