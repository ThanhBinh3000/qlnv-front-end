import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../../base.service";
import {environment} from "../../../../../../environments/environment";
import {OldResponseData} from "../../../../../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class QdGiaoNvXuatHangTrongThoiGianBaoHanhService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-khac/ktcl-vt-trong-bao-hanh/qd-giao-nv-xuat-hang', '');
  }
  listQd(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/listQd`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
