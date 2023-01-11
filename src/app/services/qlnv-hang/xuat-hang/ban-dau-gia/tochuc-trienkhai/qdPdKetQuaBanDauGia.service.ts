import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../../base.service";
import { environment } from "../../../../../../environments/environment";
import { OldResponseData } from "../../../../../interfaces/response";
import { PATH } from 'src/app/constants/path';

@Injectable({
  providedIn: 'root',
})
export class QdPdKetQuaBanDauGiaService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.DAU_GIA + "/" + PATH.KQ_BDG, PATH.QLNV_HANG);
  }
}
