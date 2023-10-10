import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../base.service";
import { environment } from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhPheDuyetPhuongAnCuuTroService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'cuu-tro/quyet-dinh', '');
  }

  getDsQdPaChuyenXc(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/qd-pa-xuat-cap`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
  getDanhSach(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
}
