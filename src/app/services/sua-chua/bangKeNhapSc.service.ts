import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class BangKeNhapScService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'sua-chua/bang-ke-nhap-vt', '/qlnv-hang');
  }

}
