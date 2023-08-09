import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { OldResponseData } from "../../interfaces/response";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class KhCnQuyChuanKyThuat extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ql-qc-kt', '/qlnv-hang');
  }

  getQuyChuanTheoCloaiVthh(cloaiVthh): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/quy-chuan-theo-loai-hang/${cloaiVthh}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
}
