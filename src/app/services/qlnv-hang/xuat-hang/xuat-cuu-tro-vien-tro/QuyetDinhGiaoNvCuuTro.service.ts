import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../base.service";
import { environment } from "../../../../../environments/environment";
import { OldResponseData } from "../../../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhGiaoNvCuuTroService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'cuu-tro/qd-gnv', '');
  }

  updateDdiemNhap(body: any): Promise<any> {
    const url = `http://192.168.5.184:1702/cuu-tro/qd-gnv/cap-nhat-ddiem-nhap`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

}
