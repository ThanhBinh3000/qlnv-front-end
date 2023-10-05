import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { PATH } from 'src/app/constants/path';

@Injectable({
  providedIn: 'root'
})
export class QuyetDinhDcBanttService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.BAN_TRUC_TIEP + "/" + PATH.QD_DC, PATH.QLNV_HANG);
  }

}
