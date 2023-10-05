import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../../base.service";
import { environment } from "../../../../../../environments/environment";
import { OldResponseData } from "../../../../../interfaces/response";
import { PATH } from 'src/app/constants/path';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class QdPdKetQuaBanDauGiaService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.DAU_GIA + "/" + PATH.KQ_BDG, PATH.QLNV_HANG);
  }
  exportQdPd(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat/hop-dong`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }
}
