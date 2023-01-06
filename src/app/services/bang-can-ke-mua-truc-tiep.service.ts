import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BangCanKeMuaTrucTiepService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bang-can-ke/bang-can-ke-mtt', '/qlnv-hang');
  }
}
