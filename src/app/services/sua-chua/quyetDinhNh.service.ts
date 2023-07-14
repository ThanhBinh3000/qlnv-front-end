import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhNhService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'sua-chua/nhap-hang', '/qlnv-hang');
  }

}
