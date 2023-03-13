import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from "../../../base.service";
// import { BaseLocalService } from "../../../base-local.service";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhPheDuyetPhuongAnCuuTroService extends BaseService {
  GATEWAY = '';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'cuu-tro/quyet-dinh', '');
  }

  getDsQdPaChuyenXc(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/qd-pa-xuat-cap`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
}
