import { Injectable } from '@angular/core';
import {BaseService} from "../../base.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class QuyetDinhDieuChinhGiaTCDTNNService extends BaseService{

  gateway: string = '/qlnv-category'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'phuong-an-gia/qd-dc-gia-tcdtnn', '/qlnv-khoach');
  }
}
