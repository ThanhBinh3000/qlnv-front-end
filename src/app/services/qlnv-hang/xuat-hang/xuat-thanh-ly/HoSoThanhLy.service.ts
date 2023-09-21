import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../../base.service";
import { OldResponseData } from "src/app/interfaces/response";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HoSoThanhLyService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-thanh-ly/ho-so', '');
  }


  getHoSoToQuyetDinh(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-quyet-dinh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
