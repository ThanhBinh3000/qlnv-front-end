import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class QthtKetChuyenService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'quan-tri-he-thong/ket-chuyen', '/qlnv-hang');
  }

  getListDviKc(body: any) {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/get-dvi-kc`
    return this.httpClient.post<any>(url, body).toPromise();
  }


}
