
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TongHopDeXuatKeHoachBanDauGiaService extends BaseService {

  GATEWAY = '/qlnv-hang';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ban-dau-gia/thop-kh-bdg', '/qlnv-hang');
  }

}
