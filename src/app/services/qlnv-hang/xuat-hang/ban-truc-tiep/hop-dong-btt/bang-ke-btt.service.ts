import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { PATH } from 'src/app/constants/path';

@Injectable({
  providedIn: 'root'
})
export class BangKeBttService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.BAN_TRUC_TIEP + "/" + PATH.BK_BAN_LE, PATH.QLNV_HANG);
  }

}