import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PhieuNhapKhoMuaTrucTiepService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'phieu-nhap-kho/phieu-nhap-kho-mtt', '/qlnv-hang');
  }
}
