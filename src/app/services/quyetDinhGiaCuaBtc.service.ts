import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';


@Injectable({
  providedIn: 'root'
})
export class QuyetDinhGiaCuaBtcService extends BaseService {
  gateway: string = '/qlnv-khoach'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kh-lt-pag-qd-btc/luong-thuc/gia-lh/qd-gia-btc', '')
  }

}
