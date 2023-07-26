import { BaseService } from "../../../base.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';
import {BaseLocalService} from "../../../base-local.service";
@Injectable({
  providedIn: 'root',
})
export class PhieuKtraCluongService extends BaseService {
  GATEWAY = '/qlnv-hang';
  CONTROLLER = 'nhap-khac/phieu-kiem-tra-chat-luong';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'nhap-khac/phieu-kiem-tra-chat-luong', '/qlnv-hang');
  }

  timKiemPhieuKTCL(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tim-kiem-phieu-ktcl`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
  dsQdNvuDuocLapPhieuKtcl(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/lap-phieu-ktcl`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
