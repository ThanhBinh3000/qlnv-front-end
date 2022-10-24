import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class QuanLyDanhSachHangHongHocService extends BaseService {
  GATEWAY = '/qlnv-luukho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'hang-hong-hoc', '/qlnv-luukho');
  }


  update(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-hong-hoc/cap-nhat`;
    return this._httpClient.put<OldResponseData>(url, body).toPromise();
  }

  export(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-hong-hoc/export/list`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }

  exportList(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/hang-hong-hoc/export/listct/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
}
