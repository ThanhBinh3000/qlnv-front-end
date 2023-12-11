import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../base.service";
import {environment} from "../../../../../environments/environment";
import {OldResponseData} from "../../../../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class KtKhSuaChuaBtcService extends BaseService{


  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kt-kh-sc-lon/quyet-dinh','/qlnv-kho');
  }

  //Danh sách danh mục dư án quyết định phê duyệt nhu cầu
  getDanhSachDmDuAn(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-kh-sc-lon/quyet-dinh/danh-sach-dm-du-an`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getQdBtcTaoThongBao(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-kh-sc-lon/quyet-dinh/ds-qd-btc-tao-tb`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getListTaoDc(body){
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-kh-sc-lon/quyet-dinh/ds-tao-dc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
