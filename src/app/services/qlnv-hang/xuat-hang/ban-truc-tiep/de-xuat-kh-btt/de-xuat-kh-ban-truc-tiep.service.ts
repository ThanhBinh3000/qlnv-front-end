
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATH } from 'src/app/constants/path';
import { environment } from 'src/environments/environment';
import { OldResponseData } from '../../../../../interfaces/response';
import { BaseService } from '../../../../base.service';


@Injectable({
  providedIn: 'root'
})
export class DeXuatKhBanTrucTiepService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.BAN_TRUC_TIEP + "/" + PATH.DX_KH_BTT, PATH.QLNV_HANG);
  }


}