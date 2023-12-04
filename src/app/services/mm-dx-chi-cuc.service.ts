import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class MmDxChiCucService extends BaseService{

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'de-xuat-tbmm-tbcd','/qlnv-kho');
  }

  searchDsChuaSuDung(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach-danh-muc-tai-san-da-ban-hanh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  tongHopDxCc(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/cuc-th/tra-cuu-dx-chi-cuc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getCtieuKhoach(namKh) {
    const url = `${environment.SERVICE_API}/qlnv-khoach/chi-tieu-ke-hoach-nam/ct-kh-nam/khoi-luong-nhap-xuat/${namKh}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  getCtieuKhTc(body) {
    const url = `${environment.SERVICE_API}/qlnv-khoach/chi-tieu-ke-hoach-nam/chi-tieu-cua-tong-cuc`;
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



}
