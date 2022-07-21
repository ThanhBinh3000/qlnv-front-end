import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';
import { OldResponseData } from 'src/app/interfaces/response';


@Injectable({
  providedIn: 'root',
})
export class QlLichSuTruyCapService extends BaseService {
  gateway: string = '/qlnv-system'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'user', '');
  }

  findList(body) {
    const url = `${environment.SERVICE_API}${this.gateway}/history/findList`;
    return this.httpClient.post<any>(url, body).toPromise();
  }



  exportExcel(body) {
    const url = `${environment.SERVICE_API}${this.gateway}/history/exportExcel`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  find(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/history/find`;
    return this.httpClient.post<any>(url, body).toPromise();
  }


}
