import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhPheDuyetKeHoachLCNTService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/qd-lcnt', '/qlnv-hang');
  }

  getDetailGoiThau(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-lcnt/chi-tiet/goi-thau/${id}`
    return this.httpClient.get<any>(url).toPromise();
  }


  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/qd-lcnt/ket-xuat`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}