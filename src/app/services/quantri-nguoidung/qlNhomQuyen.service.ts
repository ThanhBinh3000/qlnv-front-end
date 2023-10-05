import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';


@Injectable({
  providedIn: 'root',
})
export class QlNhomQuyenService extends BaseService {
  gateway: string = '/qlnv-system'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'roles', '/qlnv-system');
  }

}
