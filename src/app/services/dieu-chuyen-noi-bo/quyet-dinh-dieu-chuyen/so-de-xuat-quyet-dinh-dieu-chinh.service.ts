import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../base.service";
import { environment } from "../../../../environments/environment";
import { OldResponseData } from "../../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class SoDeXuatQuyetDinhDieuChuyenService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dieu-chuyen-noi-bo/tong-hop-ke-hoach-dieu-chuyen-c', '/qlnv-hang');
  }

  dsSoDX(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach-so-de-xuat`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
