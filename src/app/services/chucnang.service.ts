import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class ChucNangService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ChucNang');
  }

  LayTatCaTheoTree() {
    const url = `${environment.SERVICE_API}api/ChucNang/LayTatCaTheoTree`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }
}
