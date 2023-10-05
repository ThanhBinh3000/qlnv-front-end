import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { PATH } from 'src/app/constants/path';

@Injectable({
  providedIn: 'root'
})
export class BienBanHaoDoiBttService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.BAN_TRUC_TIEP + "/" + PATH.BIEN_BAN_HAO_DOI, PATH.QLNV_HANG);
  }


}
