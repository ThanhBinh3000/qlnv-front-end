import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ChaogiaUyquyenMualeService extends BaseService {
  GATEWAY = '/qlnv-hang';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'mua-truc-tiep/tkhai-mtt', '/qlnv-hang');
  }

}
