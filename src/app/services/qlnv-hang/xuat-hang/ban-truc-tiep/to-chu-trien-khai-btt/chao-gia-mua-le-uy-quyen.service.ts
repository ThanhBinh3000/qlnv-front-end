import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../base.service';
import { PATH } from 'src/app/constants/path';


@Injectable({
  providedIn: 'root'
})
export class ChaoGiaMuaLeUyQuyenService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.BAN_TRUC_TIEP + "/" + PATH.TTIN_BTT, PATH.QLNV_HANG);
  }


}