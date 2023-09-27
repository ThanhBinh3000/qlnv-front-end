import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../base.service";
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BienBanLayMauService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dieu-chuyen-noi-bo/bien-ban-lay-mau', '/qlnv-hang');
  }

  getDanhSach(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach-bien-ban`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
