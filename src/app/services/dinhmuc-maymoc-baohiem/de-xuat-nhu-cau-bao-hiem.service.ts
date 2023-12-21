import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {OldResponseData} from "../../interfaces/response";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DeXuatNhuCauBaoHiemService extends BaseService{

  GATEWAY = '/qlnv-kho'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'de-xuat-bao-hiem', '/qlnv-kho');
  }

  trangThaiHt(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}/qlnv-luukho/hang-trong-kho/trang-thai-ht`
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
  tongHop(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/cuc-th/tra-cuu-dx-chi-cuc`
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  previewDx(body: any)  {
    // const url = `${environment.SERVICE_API}/qlnv-report/dinh-muc/xem-truoc-bao-hiem`;
    const url = `${environment.SERVICE_API_LOCAL}/dinh-muc/xem-truoc-bao-hiem`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
}
