import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../base.service";
import {OldResponseData} from "../../../../interfaces/response";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DeXuatScThuongXuyenService extends BaseService {

  GATEWAY = '/qlnv-kho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kt-kh-sc-thuong-xuyen/de-xuat', '');
  }

  getDanhMuc(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet/danh-muc/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

}
