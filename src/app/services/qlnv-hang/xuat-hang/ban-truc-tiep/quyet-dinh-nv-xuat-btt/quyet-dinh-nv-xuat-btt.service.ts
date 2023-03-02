import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { PATH } from 'src/app/constants/path';
@Injectable({
  providedIn: 'root'
})
export class QuyetDinhNvXuatBttService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.BAN_TRUC_TIEP + "/" + PATH.QD_GNV_XH, PATH.QLNV_HANG);
  }

}