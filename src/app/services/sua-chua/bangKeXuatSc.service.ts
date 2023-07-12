import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class BangKeXuatScService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'sua-chua/bang-ke-xuat-vt', '/qlnv-hang');
  }

}
