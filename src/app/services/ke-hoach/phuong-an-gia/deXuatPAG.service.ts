import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';
import {environment} from "../../../../environments/environment";
import {OldResponseData} from "../../../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class DeXuatPAGService extends BaseService {
  gateway: string = '/qlnv-khoach'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'phuong-an-gia/dx-pag', '/qlnv-khoach')

  }

  getDetailGct(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet-gct/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  previewPag(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/xem-truoc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
