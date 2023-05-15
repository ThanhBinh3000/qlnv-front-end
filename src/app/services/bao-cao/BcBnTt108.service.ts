import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { BaseService } from "../base.service";

@Injectable({
  providedIn: 'root',
})
export class BcBnTt108Service extends BaseService {
  GATEWAY = '';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bc-dtqg-bn', '');
  }

  bcNguonHinhThanhDtqg(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/001h`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
}
