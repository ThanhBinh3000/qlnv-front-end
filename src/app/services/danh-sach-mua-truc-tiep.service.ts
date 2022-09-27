<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

=======
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
>>>>>>> 1fc815a363c3951b97d79ebd65c12cf8f4e34def
@Injectable({
  providedIn: 'root'
})
export class DanhSachMuaTrucTiepService extends BaseService {
  GATEWAY = '/qlnv-hang';
<<<<<<< HEAD
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'mua-truc-tiep/dx-kh-mtt', '/qlnv-hang');
  }

}
=======
  constructor(public httpClient: HttpClient
) {
    super(httpClient, 'mua-truc-tiep/dx-kh-mtt', '/qlnv-hang');
  }

}
>>>>>>> 1fc815a363c3951b97d79ebd65c12cf8f4e34def
