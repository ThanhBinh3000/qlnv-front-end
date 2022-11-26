import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../../base.service';

@Injectable({
  providedIn: 'root',
})
export class QuanLyBienBanChuanBiKhoService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bien-ban-chuan-bi-kho', '/qlnv-hang');
  }

}
