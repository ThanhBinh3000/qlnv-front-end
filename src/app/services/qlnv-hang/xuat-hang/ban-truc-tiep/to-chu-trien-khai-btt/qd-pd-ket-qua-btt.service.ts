import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../../base.service";
import { PATH } from 'src/app/constants/path';

@Injectable({
  providedIn: 'root'
})
export class QdPdKetQuaBttService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.BAN_TRUC_TIEP + "/" + PATH.KQUA_BTT, PATH.QLNV_HANG);
  }
}
