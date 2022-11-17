
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';


@Injectable({
  providedIn: 'root'
})
export class DeXuatKhBanDauGiaService extends BaseService {
  GATEWAY = '/qlnv-hang';
  CONTROLLER = 'ban-dau-gia/dx-kh-bdg';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ban-dau-gia/dx-kh-bdg', '/qlnv-hang');
  }

}