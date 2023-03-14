import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATH } from 'src/app/constants/path';
import { BaseService } from '../../../../base.service';

@Injectable({
  providedIn: 'root'
})
export class BienBanLayMauBttService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.BAN_TRUC_TIEP + "/" + PATH.BB_LAY_MAU, PATH.QLNV_HANG);
  }


}