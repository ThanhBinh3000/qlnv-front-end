import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BienBanDayKhoMuaTrucTiepService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bien-ban-day-kho-mua-tt/bien-ban-day-kho', '/qlnv-hang');
  }
}