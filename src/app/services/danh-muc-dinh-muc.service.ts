import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {OldResponseData} from "../interfaces/response";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class DanhMucDinhMucService extends BaseService{
  gateway: string = '/qlnv-category'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dmuc-dmuc-phi', '/qlnv-category');
  }

  search(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  searchDsChuaSuDung(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach-chua-su-dung`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  searchDsTongCucApDung(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach-tong-cuc-ra-qd`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  delete(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/xoa/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  update(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/sua`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }


}
