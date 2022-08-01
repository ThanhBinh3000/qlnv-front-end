import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class QuyetDinhUbtvqhMuaBuBoSungService extends BaseService{

  gateway: string = '/qlnv-khoach'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'giao-ke-hoach-mua-bu-bo-sung/quyet-dinh/ub-tv-qh', '/qlnv-khoach');
  }
}
