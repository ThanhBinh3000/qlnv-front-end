
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATH } from 'src/app/constants/path';
import { BaseService } from '../../../../base.service';

@Injectable({
  providedIn: 'root'
})
export class QuyetDinhPdKhBanTrucTiepService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.BAN_TRUC_TIEP + "/" + PATH.QD_PD_BTT, PATH.QLNV_HANG);
  }


}