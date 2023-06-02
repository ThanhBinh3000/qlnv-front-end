import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {OldResponseData} from "../../../../interfaces/response";
import {BaseService} from "../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class QdPheDuyetKhlcntTdsclService extends BaseService{

  GATEWAY = '/qlnv-kho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'tien-do-xdsc/sua-chua/quyetdinh-pd-khlcnt', '');
  }

  search(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getLastRecordBySoQdPdDaDtxd(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/list-cv-da-th-by-qdpddadtxd`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  saveDsNhaThau(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-nha-thau/them-moi`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  hoanThanhCapNhatTrangThaiDauThau(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tt-dau-thau/hoan-thanh-cap-nhat`
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
