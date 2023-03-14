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

  getCtieuKhTc(body) {
    const url = `${environment.SERVICE_API}/qlnv-khoach/chi-tieu-ke-hoach-nam/chi-tieu-cua-tong-cuc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
  getCtieuKhoach(namKh) {
    const url = `${environment.SERVICE_API}/qlnv-khoach/chi-tieu-ke-hoach-nam/ct-kh-nam/khoi-luong-nhap-xuat/${namKh}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

}
