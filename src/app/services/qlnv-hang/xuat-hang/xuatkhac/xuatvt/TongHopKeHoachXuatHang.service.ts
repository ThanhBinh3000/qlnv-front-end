import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../../base.service";
import {environment} from "../../../../../../environments/environment";
import {OldResponseData} from "../../../../../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class TongHopKeHoachXuatHangService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-khac/ktcl-vt-truoc-het-han/kh-xuat-hang/tong-hop', '');
  }


  searchTh(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu-th`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
