import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TongHopDeXuatKHMTTService extends BaseService {

  GATEWAY = '/qlnv-hang';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'mua-truc-tiep/thop-kh-mtt', '/qlnv-hang');
  }

}
