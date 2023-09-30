import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../../base.service";
import {OldResponseData} from "../../../../interfaces/response";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PhieuKtraClThanhLyService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-thanh-ly/kt-cl', '/qlnv-hang');
  }

  getDanhSachTaoPxk(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API_LOCAL}/${this.table}/ds-tao-pxk`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
