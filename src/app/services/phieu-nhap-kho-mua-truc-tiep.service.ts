import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import {BaseLocalService} from "./base-local.service";

@Injectable({
  providedIn: 'root'
})
export class PhieuNhapKhoMuaTrucTiepService extends BaseLocalService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'phieu-nhap-kho/phieu-nhap-kho-mtt', '');
  }
}
