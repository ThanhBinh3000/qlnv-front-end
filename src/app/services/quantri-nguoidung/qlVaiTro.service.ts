import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';
import { OldResponseData } from 'src/app/interfaces/response';


@Injectable({
  providedIn: 'root',
})
export class QlVaiTroService extends BaseService {
  gateway: string = '/qlnv-system'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'user', '');
  }

  findAll() {
    const url = `${environment.SERVICE_API}${this.gateway}//role/findAll`;
    return this.httpClient.post<any>(url, {}).toPromise();
  }


}
