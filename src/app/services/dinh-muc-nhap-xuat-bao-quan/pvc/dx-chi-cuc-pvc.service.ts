import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../base.service";
import {environment} from "../../../../environments/environment";
import {OldResponseData} from "../../../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class DxChiCucPvcService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'pvc-de-xuat-ccdc','/qlnv-kho');
  }

  tongHopDxCc(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tong-hop/tra-cuu-dx`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getSlHienCo(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/so-luong-hien-co`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getSlNhapThem(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/so-luong-nhap-them`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getDinhMuc(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/dinhmuc-mmtbcd-dtl-theo-ma`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getListDxChiCucTheoIdTongHopTC(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/list-dx-theo-id-th-tcdt/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  exportDetail(body: any) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat-detail`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }
}
