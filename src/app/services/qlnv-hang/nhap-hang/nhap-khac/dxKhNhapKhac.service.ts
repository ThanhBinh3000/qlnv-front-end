import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {OldResponseData} from "../../../../interfaces/response";
import {environment} from "../../../../../environments/environment";
import {BaseService} from "../../../base.service";

@Injectable({
  providedIn: 'root',
})
export class DxKhNhapKhacService extends BaseService {
  GATEWAY = '/qlnv-hang';
  CONTROLLER = 'nhap-khac/dx-kh';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'nhap-khac/dx-kh', '/qlnv-hang');
  }

  dsDxDuocTaoQDinhPDuyet(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach-dx-tao-qd`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
}
