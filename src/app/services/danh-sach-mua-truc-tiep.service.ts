
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DanhSachMuaTrucTiepService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient
  ) {
    super(httpClient, 'mua-truc-tiep/dx-kh-mtt', '/qlnv-hang');
  }

}

