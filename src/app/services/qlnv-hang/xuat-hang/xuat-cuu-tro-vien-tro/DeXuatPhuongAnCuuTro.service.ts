import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../base.service";
import { environment } from "../../../../../environments/environment";
import { OldResponseData } from "../../../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class DeXuatPhuongAnCuuTroService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'cuu-tro/de-xuat', '');
  }
  getPhuongAnCuuTro(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/dieu-chinh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
