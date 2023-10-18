import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "src/app/services/base.service";
import {OldResponseData} from "../../../../interfaces/response";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class QuyetDinhPheDuyetKetQuaService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-thanh-ly/quyet-dinh-pdkq', '/qlnv-hang');
  }

  dsTaoHopDong(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-tao-hop-dong`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
