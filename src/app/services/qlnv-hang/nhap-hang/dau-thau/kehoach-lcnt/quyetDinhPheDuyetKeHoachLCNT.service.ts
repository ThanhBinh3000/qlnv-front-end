import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';
import { Observable } from 'rxjs';
import {OldResponseData} from "../../../../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhPheDuyetKeHoachLCNTService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/qd-lcnt', '/qlnv-hang');
  }

  getDetailGoiThau(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet/goi-thau/${id}`
    return this.httpClient.get<any>(url).toPromise();
  }

  getDetailDtlCuc(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet-cuc/${id}`
    return this.httpClient.get<any>(url).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
  dsQdDuocDieuChinh(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-dieu-chinh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
