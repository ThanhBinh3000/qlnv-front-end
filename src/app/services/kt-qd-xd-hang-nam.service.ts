import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BaseService} from "./base.service";
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class KtQdXdHangNamService extends BaseService {

  GATEWAY = '/qlnv-kho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dt-xd-theo-nam/quyet-dinh', '/qlnv-kho');
  }

  getAllPaTc(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dt-xd-theo-nam/quyet-dinh/list-tt`;
    return this.httpClient.get(url).toPromise();
  }

  //Danh sách danh mục dư án quyết định phê duyệt nhu cầu
  getDanhSachDmDuAn(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dt-xd-theo-nam/quyet-dinh/danh-sach-dm-du-an`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getListToTrinh(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/list-tt`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
}
