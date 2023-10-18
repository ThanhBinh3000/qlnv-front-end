import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BaseService } from "./base.service";
import { environment } from "../../environments/environment";
import { OldResponseData } from "../interfaces/response";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QuyHoachKhoService extends BaseService {

  gateway: string = '/qlnv-kho'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kt-quy-hoach-kho/qd-quy-hoach', '/qlnv-kho');
  }

  danhSachQdGoc() {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/qd-goc`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  exportCt(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat-ct`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }
}
