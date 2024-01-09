import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import {OldResponseData} from "../../../../../interfaces/response";
import {environment} from "../../../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class DieuChinhQuyetDinhPdKhlcntService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'qd-lcnt/dieu-chinh', '/qlnv-hang');
  }
  findByIdQdGoc(idQdGoc, lanDieuChinh): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet/findByIdQdGoc/${idQdGoc}/${lanDieuChinh}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
}
