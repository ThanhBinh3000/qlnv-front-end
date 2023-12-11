import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../base.service";
import { environment } from "../../../environments/environment";
import {OldResponseData} from "../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class BcBnTt130Service extends BaseService {
  GATEWAY = '/qlnv-report';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bc-dtqg-bn/tt-130', '/qlnv-report');
  }
  ketXuat(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
  importExcel(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/import-du-lieu`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
