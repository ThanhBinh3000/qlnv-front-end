import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class MuaBuBoSungBtcService extends BaseService{


  gateway: string = '/qlnv-khoach'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'giao-ke-hoach-mua-bu-bo-sung/quyet-dinh/btc', '/qlnv-khoach');
  }
}
