import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../base.service";
import { environment } from "../../../../../environments/environment";
import { OldResponseData } from "../../../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class HoSoKyThuatCtvtService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'cuu-tro/kt-cl/ho-so-ky-thuat', '');
  }

  updateDdiemNhap(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/cap-nhat-ddiem-nhap`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

}
