import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';
import { PATH } from 'src/app/constants/path';

@Injectable({
  providedIn: 'root'
})
export class QdPdKetQuaBttService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.BAN_TRUC_TIEP + "/" + PATH.KQUA_BTT, PATH.QLNV_HANG);
  }

  getToChucDetail(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/tchuc-chi-tiet/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
}
