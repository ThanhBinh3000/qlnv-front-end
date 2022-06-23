import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class DonviLienQuanService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-category'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dmuc-dvi-lquan', '/qlnv-gateway/qlnv-category');
  }
}
