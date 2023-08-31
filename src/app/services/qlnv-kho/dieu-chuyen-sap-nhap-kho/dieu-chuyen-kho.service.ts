import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { BaseService } from "../../base.service";
import { OldResponseData } from "../../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class DieuChuyenKhoService extends BaseService {
  GATEWAY = '/qlnv-kho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'qly-kho-tang/dieu-chuyen-sap-nhap/dieu-chuyen-kho', '');
  }

  search(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
  chiTietHangSapNhapDiemKho(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet-hang?maChiCucDi=${body.maChiCucDi}&maChiCucDen=${body.maChiCucDen}&maDiemKhoDi=${body.maDiemKhoDi}&maDiemKhoDen=${body.maDiemKhoDen}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
  chiTietHangSapNhapChiCuc(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet-hang?maChiCucDi=${body.maChiCucDi}&maChiCucDen=${body.maChiCucDen}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
  chiTietCCDC(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet-ccdc?maChiCucDi=${body.maChiCucDi}&maChiCucDen=${body.maChiCucDen}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
}
