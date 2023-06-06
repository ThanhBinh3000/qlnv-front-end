import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { BaseService } from "../base.service";
import { OldResponseData } from "src/app/interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class BcBnTt145Service extends BaseService {
  GATEWAY = '/qlnv-report';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'tt-btc-145-bn', '/qlnv-report');
  }

  ketXuat(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
}
