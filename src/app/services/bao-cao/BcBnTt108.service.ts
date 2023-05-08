import { Injectable } from "@angular/core";
import { BaseLocalService } from "../base-local.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class BcBnTt108Service extends BaseLocalService {
  GATEWAY = '';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bc-dtqg-bn', '');
  }

  bcNguonHinhThanhDtqg(body) {
    const url = `${environment.SERVICE_API_BC}${this.GATEWAY}/${this.table}/001h`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
}